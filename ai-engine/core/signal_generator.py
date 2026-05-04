"""
Signal generator — produces trading signals from market data.
"""

import logging
import numpy as np

from typing import Any

from data.indicators import sma, rsi, macd

logger = logging.getLogger(__name__)


class SignalGenerator:
    """Generates grid and trend trading signals."""

    @staticmethod
    def generate_grid_signals(
        current_price: float, grid_levels: list[float]
    ) -> dict[str, Any]:
        """Generate grid-trading signals based on the current price relative to grid levels.

        Args:
            current_price: Current market price.
            grid_levels: Sorted list of grid price levels (ascending).

        Returns:
            Signal dict with keys: action, price, reason.
        """
        if not grid_levels:
            return {"action": "hold", "price": current_price, "reason": "No grid levels defined."}

        sorted_levels = sorted(grid_levels)

        # Find the nearest buy level (below current price)
        buy_levels = [lvl for lvl in sorted_levels if lvl < current_price]
        sell_levels = [lvl for lvl in sorted_levels if lvl > current_price]

        if buy_levels:
            nearest_buy = buy_levels[-1]
            return {
                "action": "buy",
                "price": nearest_buy,
                "reason": f"Price {current_price:.4f} above grid buy level {nearest_buy:.4f}.",
            }
        elif sell_levels:
            nearest_sell = sell_levels[0]
            return {
                "action": "sell",
                "price": nearest_sell,
                "reason": f"Price {current_price:.4f} below grid sell level {nearest_sell:.4f}.",
            }

        return {"action": "hold", "price": current_price, "reason": "No suitable grid level."}

    @staticmethod
    def generate_trend_signals(klines: list[dict]) -> dict[str, Any]:
        """Generate trend-following signals based on moving averages.

        Uses a simple SMA crossover strategy:
        - Short SMA (12) crosses above Long SMA (26) → buy
        - Short SMA crosses below Long SMA (26) → sell

        Args:
            klines: List of kline dicts with 'close' key, sorted by time ascending.

        Returns:
            Signal dict with keys: action, price, reason.
        """
        if not klines or len(klines) < 26:
            return {"action": "hold", "price": 0.0, "reason": "Insufficient data."}

        closes = np.array([k["close"] for k in klines], dtype=np.float64)
        current_price = float(closes[-1])

        short_sma = sma(closes, 12)
        long_sma = sma(closes, 26)

        if np.isnan(short_sma[-1]) or np.isnan(long_sma[-1]):
            return {"action": "hold", "price": current_price, "reason": "Indicators not ready."}

        prev_short = short_sma[-2] if len(short_sma) >= 2 else short_sma[-1]
        prev_long = long_sma[-2] if len(long_sma) >= 2 else long_sma[-1]

        # Crossover detection
        if prev_short <= prev_long and short_sma[-1] > long_sma[-1]:
            return {
                "action": "buy",
                "price": current_price,
                "reason": f"SMA(12) {short_sma[-1]:.4f} crossed above SMA(26) {long_sma[-1]:.4f}.",
            }
        elif prev_short >= prev_long and short_sma[-1] < long_sma[-1]:
            return {
                "action": "sell",
                "price": current_price,
                "reason": f"SMA(12) {short_sma[-1]:.4f} crossed below SMA(26) {long_sma[-1]:.4f}.",
            }

        return {"action": "hold", "price": current_price, "reason": "No crossover signal."}
