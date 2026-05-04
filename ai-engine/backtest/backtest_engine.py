"""
Backtest engine — runs historical simulations of strategies.
"""

import asyncio
import logging
from typing import Any

from backtest.metrics import (
    calculate_sharpe_ratio,
    calculate_max_drawdown,
    calculate_win_rate,
)

logger = logging.getLogger(__name__)


async def run_backtest(
    strategy_type: str, params: dict, klines: list[dict]
) -> dict[str, Any]:
    """Run a backtest simulation.

    MVP phase: returns simulated results.

    Args:
        strategy_type: Type of strategy ('grid' or 'trend').
        params: Strategy parameters.
        klines: Historical kline data.

    Returns:
        Backtest result dict with metrics.
    """
    if not klines:
        return {
            "strategy_type": strategy_type,
            "error": "No kline data provided.",
        }

    # ── Simulated trades for MVP ──────────────────────────────────────────────
    await asyncio.sleep(0)  # yield control (placeholder for real simulation)

    total_return = 12.5  # percent
    max_drawdown = -8.3  # percent
    sharpe_ratio = 1.85
    win_rate = 62.5  # percent
    total_trades = 40

    try:
        # Compute metrics from dummy data for MVP
        returns = [0.5, -0.3, 0.8, -0.1, 1.2, -0.5, 0.6]
        equity = [100_000, 100_500, 100_200, 101_000, 100_900, 102_100, 101_600]
        trades = [
            {"pnl": 50, "won": True},
            {"pnl": -30, "won": False},
            {"pnl": 80, "won": True},
            {"pnl": -10, "won": False},
            {"pnl": 120, "won": True},
        ]

        calculated_sharpe = calculate_sharpe_ratio(returns)
        calculated_drawdown = calculate_max_drawdown(equity)
        calculated_win_rate = calculate_win_rate(trades)

        result = {
            "strategy_type": strategy_type,
            "params": params,
            "total_return_pct": total_return,
            "max_drawdown_pct": max_drawdown,
            "sharpe_ratio": round(calculated_sharpe, 4),
            "win_rate_pct": calculated_win_rate,
            "total_trades": total_trades,
            "total_return_calculated_pct": round(
                sum(returns) / len(returns) * 100, 2
            ) if returns else 0,
            "max_drawdown_calculated_pct": round(calculated_drawdown, 4),
        }
    except Exception:
        logger.exception("Error computing backtest metrics.")
        result = {
            "strategy_type": strategy_type,
            "total_return_pct": total_return,
            "max_drawdown_pct": max_drawdown,
            "sharpe_ratio": sharpe_ratio,
            "win_rate_pct": win_rate,
            "total_trades": total_trades,
            "error": "Metrics calculation error, using fallback values.",
        }

    logger.info("Backtest completed for %s strategy.", strategy_type)
    return result
