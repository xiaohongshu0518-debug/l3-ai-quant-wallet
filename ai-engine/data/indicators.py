"""
Technical indicators — SMA, EMA, RSI, MACD calculations.
"""

import numpy as np


def sma(data: np.ndarray, period: int) -> np.ndarray:
    """Simple moving average.

    Args:
        data: 1-D price array.
        period: Window size.

    Returns:
        Array of SMA values. First (period-1) elements are NaN.
    """
    if period < 1 or len(data) < period:
        return np.full_like(data, np.nan, dtype=np.float64)

    result = np.full_like(data, np.nan, dtype=np.float64)
    for i in range(period - 1, len(data)):
        result[i] = np.mean(data[i - period + 1 : i + 1])
    return result


def ema(data: np.ndarray, period: int) -> np.ndarray:
    """Exponential moving average.

    Args:
        data: 1-D price array.
        period: Window size.

    Returns:
        Array of EMA values. First (period-1) elements are NaN.
    """
    if period < 1 or len(data) < period:
        return np.full_like(data, np.nan, dtype=np.float64)

    result = np.full_like(data, np.nan, dtype=np.float64)
    multiplier = 2.0 / (period + 1)

    # Seed with SMA
    result[period - 1] = np.mean(data[:period])

    for i in range(period, len(data)):
        result[i] = (data[i] - result[i - 1]) * multiplier + result[i - 1]

    return result


def rsi(data: np.ndarray, period: int = 14) -> np.ndarray:
    """Relative Strength Index.

    Args:
        data: 1-D price array.
        period: RSI period (default 14).

    Returns:
        Array of RSI values (0-100). First `period` elements are NaN.
    """
    if len(data) < period + 1:
        return np.full_like(data, np.nan, dtype=np.float64)

    deltas = np.diff(data)
    gains = np.where(deltas > 0, deltas, 0.0)
    losses = np.where(deltas < 0, -deltas, 0.0)

    avg_gain = np.full_like(data, np.nan, dtype=np.float64)
    avg_loss = np.full_like(data, np.nan, dtype=np.float64)

    # First average
    avg_gain[period] = np.mean(gains[:period])
    avg_loss[period] = np.mean(losses[:period])

    for i in range(period + 1, len(data)):
        avg_gain[i] = (avg_gain[i - 1] * (period - 1) + gains[i - 1]) / period
        avg_loss[i] = (avg_loss[i - 1] * (period - 1) + losses[i - 1]) / period

    rs = avg_gain / np.where(avg_loss == 0, 1e-10, avg_loss)
    rsi_values = 100.0 - (100.0 / (1.0 + rs))

    return rsi_values


def macd(data: np.ndarray) -> dict[str, np.ndarray]:
    """Moving Average Convergence Divergence.

    Args:
        data: 1-D price array.

    Returns:
        Dict with 'macd', 'signal', and 'histogram' arrays.
        All arrays have NaN for indices where the value cannot be computed.
    """
    ema12 = ema(data, 12)
    ema26 = ema(data, 26)

    macd_line = ema12 - ema26
    signal_line = ema(macd_line, 9)
    histogram = macd_line - signal_line

    return {
        "macd": macd_line,
        "signal": signal_line,
        "histogram": histogram,
    }
