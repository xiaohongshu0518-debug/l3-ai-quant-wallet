"""
Binance exchange connector — fetches kline data via the public REST API.
"""

import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)

BASE_URL = "https://api.binance.com"


async def get_klines(
    symbol: str, interval: str, limit: int = 100
) -> list[dict[str, Any]]:
    """Fetch kline data from Binance spot API.

    Args:
        symbol: Trading pair (e.g. 'BTCUSDT').
        interval: Kline interval ('1m', '5m', '15m', '30m', '1h', '4h', '1d', etc.).
        limit: Number of klines (max 1000).

    Returns:
        List of kline dicts with keys: open, high, low, close, volume, timestamp.
    """
    url = f"{BASE_URL}/api/v3/klines"
    params = {"symbol": symbol.upper(), "interval": interval, "limit": min(limit, 1000)}

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            raw = resp.json()
        except httpx.HTTPStatusError as exc:
            logger.error("Binance API error: %s — %s", exc.response.status_code, exc.response.text)
            raise
        except Exception:
            logger.exception("Failed to fetch klines from Binance.")
            raise

    klines = []
    for entry in raw:
        klines.append({
            "timestamp": int(entry[0]),
            "open": float(entry[1]),
            "high": float(entry[2]),
            "low": float(entry[3]),
            "close": float(entry[4]),
            "volume": float(entry[5]),
        })

    logger.debug("Fetched %d klines for %s (%s)", len(klines), symbol, interval)
    return klines
