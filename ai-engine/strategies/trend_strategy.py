"""
Trend strategy stub — MVP phase placeholder.
"""

import json
import logging
from typing import Any

from strategies.base import BaseStrategy

logger = logging.getLogger(__name__)


class TrendStrategy(BaseStrategy):
    """Trend-following strategy (MVP stub)."""

    async def analyze(self, market_data: dict) -> dict:
        """Stub: always returns hold.

        Args:
            market_data: Dictionary with market information.

        Returns:
            Hold signal.
        """
        price = market_data.get("price", 0.0)
        return {
            "signal": "hold",
            "price": price,
            "reason": "Trend strategy not yet implemented (MVP stub).",
        }

    async def execute(self, signal: dict, portfolio: dict) -> dict:
        """Stub: no-op execution.

        Args:
            signal: Signal dict.
            portfolio: Portfolio dict.

        Returns:
            Empty execution result.
        """
        return {"action": "hold", "filled_size": 0.0, "filled_price": 0.0}


async def run_trend_strategy(redis_client, strategy_id: str, params: dict) -> None:
    """Standalone trend strategy loop (stub).

    Args:
        redis_client: Async Redis client.
        strategy_id: Unique strategy identifier.
        params: Strategy parameters.
    """
    import asyncio

    channel = f"strategy:signals:{strategy_id}"
    strategy = TrendStrategy()

    try:
        while True:
            market_data = {"price": params.get("default_price", 50000.0)}
            signal = await strategy.analyze(market_data)
            payload = {
                "user_strategy_id": strategy_id,
                "strategy_type": "trend",
                "signal": signal,
                "price": market_data["price"],
            }
            await redis_client.publish(channel, json.dumps(payload))
            logger.debug("Trend stub signal published for %s", strategy_id)
            await asyncio.sleep(5)
    except asyncio.CancelledError:
        logger.info("Trend strategy %s cancelled.", strategy_id)
    except Exception:
        logger.exception("Trend strategy %s error.", strategy_id)
