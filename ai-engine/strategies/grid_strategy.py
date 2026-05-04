"""
Grid strategy — buys at progressively lower levels and sells at higher ones.
"""

import logging
from typing import Any

from strategies.base import BaseStrategy

logger = logging.getLogger(__name__)


class GridStrategy(BaseStrategy):
    """A simple grid-trading strategy.

    Attributes:
        min_price: Lower bound of the grid.
        max_price: Upper bound of the grid.
        grid_count: Number of grid levels.
        amount_per_grid: Quote currency amount allocated per grid level.
        _levels: Computed grid price levels (ascending).
    """

    def __init__(
        self, min_price: float, max_price: float, grid_count: int, amount_per_grid: float
    ):
        self.min_price = min_price
        self.max_price = max_price
        self.grid_count = grid_count
        self.amount_per_grid = amount_per_grid
        self._levels = self._compute_levels()

    def _compute_levels(self) -> list[float]:
        """Compute evenly-spaced grid price levels."""
        if self.grid_count < 2:
            return [self.min_price, self.max_price]
        step = (self.max_price - self.min_price) / (self.grid_count - 1)
        return [self.min_price + i * step for i in range(self.grid_count)]

    def get_grid_levels(self) -> list[float]:
        """Return the computed grid price levels."""
        return list(self._levels)

    async def analyze(self, market_data: dict) -> dict:
        """Analyse market data against grid levels.

        Args:
            market_data: Must contain 'price' key.

        Returns:
            Signal dict with action, price, and reason.
        """
        current_price = market_data.get("price", 0.0)
        sorted_levels = sorted(self._levels)

        # Buy if price is below the second-lowest level (opportunity zone)
        if current_price <= sorted_levels[1]:
            return {
                "signal": "buy",
                "price": current_price,
                "reason": f"Price {current_price:.4f} near grid bottom {sorted_levels[0]:.4f}.",
            }

        # Sell if price is near the top
        if current_price >= sorted_levels[-2]:
            return {
                "signal": "sell",
                "price": current_price,
                "reason": f"Price {current_price:.4f} near grid top {sorted_levels[-1]:.4f}.",
            }

        return {
            "signal": "hold",
            "price": current_price,
            "reason": f"Price {current_price:.4f} within grid range.",
        }

    async def execute(self, signal: dict, portfolio: dict) -> dict:
        """Execute a grid signal.

        Args:
            signal: Signal dict from analyze().
            portfolio: Portfolio dict with 'balance' key.

        Returns:
            Execution result.
        """
        action = signal.get("signal", "hold")
        price = signal.get("price", 0.0)

        if action == "buy":
            size = self.amount_per_grid / price if price > 0 else 0
            logger.info("Grid buy: %.6f at %.4f", size, price)
            return {"action": "buy", "filled_size": size, "filled_price": price}

        elif action == "sell":
            logger.info("Grid sell: %.6f at %.4f", self.amount_per_grid, price)
            return {
                "action": "sell",
                "filled_size": self.amount_per_grid / price if price > 0 else 0,
                "filled_price": price,
            }

        return {"action": "hold", "filled_size": 0.0, "filled_price": 0.0}
