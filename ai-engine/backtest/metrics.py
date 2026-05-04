"""
Backtest metrics — calculation utilities for evaluating strategy performance.
"""

import math
import numpy as np
from typing import Any


def calculate_sharpe_ratio(returns: list[float], risk_free_rate: float = 0.02) -> float:
    """Calculate the Sharpe ratio from a list of periodic returns.

    Args:
        returns: List of periodic return percentages (e.g. 0.01 for 1%).
        risk_free_rate: Annual risk-free rate (default 2%).

    Returns:
        Sharpe ratio (annualised). Returns 0.0 if insufficient data.
    """
    if not returns or len(returns) < 2:
        return 0.0

    arr = np.array(returns, dtype=np.float64)
    mean_return = np.mean(arr)
    std_return = np.std(arr, ddof=1)

    if std_return == 0.0:
        return 0.0

    # Annualise assuming daily returns (252 trading days)
    trading_periods = 252
    excess_return = mean_return - (risk_free_rate / trading_periods)
    return float(excess_return / std_return * math.sqrt(trading_periods))


def calculate_max_drawdown(equity_curve: list[float]) -> float:
    """Calculate the maximum drawdown percentage from an equity curve.

    The result is expressed as a negative percentage (e.g. -15.5).

    Args:
        equity_curve: List of portfolio values over time.

    Returns:
        Max drawdown as a negative percentage. Returns 0.0 if insufficient data.
    """
    if not equity_curve or len(equity_curve) < 2:
        return 0.0

    arr = np.array(equity_curve, dtype=np.float64)

    # Running maximum
    running_max = np.maximum.accumulate(arr)

    # Drawdown as percentage
    drawdowns = (arr - running_max) / running_max * 100.0

    return float(np.min(drawdowns))


def calculate_win_rate(trades: list[dict[str, Any]]) -> float:
    """Calculate the win rate (percentage of winning trades).

    Each trade dict should contain a 'won' boolean key.

    Args:
        trades: List of trade dicts.

    Returns:
        Win rate as percentage (0-100). Returns 0.0 if no trades.
    """
    if not trades:
        return 0.0

    wins = sum(1 for t in trades if t.get("won", False))
    return round(wins / len(trades) * 100.0, 2)
