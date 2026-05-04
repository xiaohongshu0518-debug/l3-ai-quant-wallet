"""
AI Engine — FastAPI application entry point.

Handles HTTP health checks, CORS, Redis pub/sub subscription,
and delegates strategy lifecycle to the StrategyEngine.
"""

import asyncio
import json
import logging
import os

from contextlib import asynccontextmanager

import redis.asyncio as aioredis

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.engine import StrategyEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-engine")

redis_client: aioredis.Redis | None = None
engine: StrategyEngine | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: connect to Redis and start subscribing."""
    global redis_client, engine

    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    redis_client = await aioredis.from_url(redis_url, decode_responses=True)
    engine = StrategyEngine(redis_client)

    logger.info("Connected to Redis at %s", redis_url)

    # Start background task that subscribes to strategy execution commands
    subscribe_task = asyncio.create_task(subscribe_strategy_commands())

    yield

    subscribe_task.cancel()
    if redis_client:
        await redis_client.close()
    logger.info("AI Engine shut down.")


async def subscribe_strategy_commands():
    """Subscribe to Redis channel 'strategy:commands' and dispatch actions."""
    if not redis_client:
        logger.error("Redis client not available, cannot subscribe.")
        return

    pubsub = redis_client.pubsub()
    await pubsub.subscribe("strategy:commands")
    logger.info("Subscribed to channel: strategy:commands")

    try:
        async for message in pubsub.listen():
            if message["type"] != "message":
                continue
            try:
                data = json.loads(message["data"])
                await handle_strategy_command(data)
            except Exception:
                logger.exception("Failed to process strategy command: %s", message["data"])
    except asyncio.CancelledError:
        logger.info("Strategy command subscriber cancelled.")
    finally:
        await pubsub.unsubscribe("strategy:commands")


async def handle_strategy_command(data: dict):
    """Route a strategy command to the engine."""
    if not engine:
        logger.warning("Engine not initialised, ignoring command.")
        return

    action = data.get("action")
    user_strategy_id = data.get("user_strategy_id")

    if action == "start":
        strategy_type = data.get("strategy_type", "grid")
        params = data.get("params", {})
        await engine.start_strategy(user_strategy_id, strategy_type, params)
        logger.info("Started strategy %s (%s)", user_strategy_id, strategy_type)
    elif action == "stop":
        await engine.stop_strategy(user_strategy_id)
        logger.info("Stopped strategy %s", user_strategy_id)
    else:
        logger.warning("Unknown strategy action: %s", action)


app = FastAPI(
    title="L3 AI Quant Wallet — AI Engine",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS ────────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ──────────────────────────────────────────────────────────────────────


@app.get("/api/v1/health")
async def health():
    """Health-check endpoint."""
    redis_ok = redis_client is not None
    try:
        if redis_ok:
            await redis_client.ping()
    except Exception:
        redis_ok = False

    return {
        "status": "ok" if redis_ok else "degraded",
        "redis": redis_ok,
    }
