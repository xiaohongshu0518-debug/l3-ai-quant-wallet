"""
OKX exchange connector — MVP stub.
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)


async def get_klines(
    symbol: str, interval: str, limit: int = 100
) -> list[dict[str, Any]]:
    """Fetch kline data from OKX.

    MVP stub — returns simulated data.

    Args:
        symbol: Trading pair (e.g. 'BTC-USDT').
        interval: Kline interval.
        limit: Number of klines.

    Returns:
        List of kline dicts.
    """
    logger.info("OKX connector is a stub (MVP). Returning simulated data for %s.", symbol)
    from data.market_data import _simulate_klines
    return _simulate_klines(limit)
