"""
Strategy engine dispatcher.

Manages lifecycle of running strategies, spawning and cancelling
asyncio tasks based on Redis pub/sub commands.
"""

import asyncio
import json
import logging

logger = logging.getLogger(__name__)


class StrategyEngine:
    """Strategy engine scheduler.

    Attributes:
        redis_client: Async Redis client for publishing signals.
        _tasks: Mapping of user_strategy_id -> asyncio.Task.
    """

    def __init__(self, redis_client):
        self.redis_client = redis_client
        self._tasks: dict[str, asyncio.Task] = {}

    async def start_strategy(
        self, user_strategy_id: str, strategy_type: str, params: dict
    ) -> None:
        """Start a strategy by creating an asyncio task.

        Args:
            user_strategy_id: Unique identifier for this strategy instance.
            strategy_type: Strategy type identifier (e.g. 'grid', 'trend').
            params: Strategy-specific parameters.
        """
        if user_strategy_id in self._tasks:
            logger.warning("Strategy %s is already running.", user_strategy_id)
            return

        if strategy_type == "grid":
            task = asyncio.create_task(
                self._run_grid_strategy(user_strategy_id, params)
            )
        elif strategy_type == "trend":
            from strategies.trend_strategy import run_trend_strategy
            task = asyncio.create_task(
                run_trend_strategy(self.redis_client, user_strategy_id, params)
            )
        else:
            logger.error("Unknown strategy type: %s", strategy_type)
            return

        self._tasks[user_strategy_id] = task
        logger.info("Strategy %s (%s) task created.", user_strategy_id, strategy_type)

    async def stop_strategy(self, user_strategy_id: str) -> None:
        """Stop a running strategy by cancelling its task."""
        task = self._tasks.pop(user_strategy_id, None)
        if task is None:
            logger.warning("Strategy %s not found.", user_strategy_id)
            return
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass
        logger.info("Strategy %s stopped.", user_strategy_id)

    async def _run_grid_strategy(self, strategy_id: str, params: dict) -> None:
        """Internal grid strategy loop.

        Every second, generates a trading signal and publishes it via Redis.

        Args:
            strategy_id: Unique strategy identifier.
            params: Strategy parameters including grid configuration.
        """
        from strategies.grid_strategy import GridStrategy
        from core.signal_generator import SignalGenerator
        from data.market_data import get_klines

        min_price = params.get("min_price", 0.0)
        max_price = params.get("max_price", 100000.0)
        grid_count = params.get("grid_count", 10)
        amount_per_grid = params.get("amount_per_grid", 0.001)

        grid = GridStrategy(min_price, max_price, grid_count, amount_per_grid)
        sig_gen = SignalGenerator()

        channel = f"strategy:signals:{strategy_id}"

        try:
            while True:
                # Simulate current market price from mock data
                klines = await get_klines("mock", "BTCUSDT", "1m", 1)
                if klines:
                    current_price = klines[0]["close"]
                else:
                    current_price = (min_price + max_price) / 2

                market_data = {"price": current_price}

                # Analyze and generate signal
                grid_signal = await grid.analyze(market_data)
                grid_levels = grid.get_grid_levels()
                signals = sig_gen.generate_grid_signals(current_price, grid_levels)

                # Publish signal to Redis
                payload = {
                    "user_strategy_id": strategy_id,
                    "strategy_type": "grid",
                    "signal": signals,
                    "price": current_price,
                }
                await self.redis_client.publish(channel, json.dumps(payload))
                logger.debug(
                    "Grid signal for %s: %s at %.2f",
                    strategy_id,
                    signals["action"],
                    current_price,
                )

                await asyncio.sleep(1)
        except asyncio.CancelledError:
            logger.info("Grid strategy %s cancelled.", strategy_id)
        except Exception:
            logger.exception("Grid strategy %s encountered an error.", strategy_id)
