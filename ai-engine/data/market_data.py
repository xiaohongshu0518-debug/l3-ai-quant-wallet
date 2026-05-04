"""
Market data — kline data retrieval (MVP mock).
"""

import asyncio
import logging
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)


async def get_klines(
    exchange: str, symbol: str, interval: str, limit: int = 100
) -> list[dict[str, Any]]:
    """Fetch kline (candlestick) data.

    MVP phase: returns simulated data for all exchanges.

    Args:
        exchange: Exchange identifier ('mock', 'binance', 'okx').
        symbol: Trading pair symbol (e.g. 'BTCUSDT').
        interval: Kline interval (e.g. '1m', '1h', '1d').
        limit: Number of klines to return.

    Returns:
        List of kline dicts with keys: open, high, low, close, volume, timestamp.
    """
    await asyncio.sleep(0)  # yield control

    if exchange == "binance":
        from connectors.binance_connector import get_klines as binance_klines
        return await binance_klines(symbol, interval, limit)

    if exchange == "okx":
        from connectors.okx_connector import get_klines as okx_klines
        return await okx_klines(symbol, interval, limit)

    # Default: return simulated data
    logger.debug("Generating simulated klines for %s/%s (%s)", exchange, symbol, interval)
    return _simulate_klines(limit)


def _simulate_klines(limit: int) -> list[dict[str, Any]]:
    """Generate simulated kline data for MVP testing."""
    np.random.seed(42)

    base_price = 50000.0
    closes = base_price + np.cumsum(np.random.randn(limit) * 100)
    closes = np.maximum(closes, base_price * 0.5)  # floor

    klines = []
    for i in range(limit):
        close = float(closes[i])
        open_ = float(closes[i - 1]) if i > 0 else close
        high = max(open_, close) + abs(float(np.random.randn() * 50))
        low = min(open_, close) - abs(float(np.random.randn() * 50))
        klines.append({
            "timestamp": i,
            "open": round(open_, 2),
            "high": round(high, 2),
            "low": round(max(low, open_ * 0.9), 2),
            "close": round(close, 2),
            "volume": round(abs(float(np.random.randn() * 100)), 2),
        })

    return klines
