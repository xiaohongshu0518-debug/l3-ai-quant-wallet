"""
Base strategy abstract class.

All concrete strategies must inherit from BaseStrategy and implement
the analyze() and execute() methods.
"""

from abc import ABC, abstractmethod


class BaseStrategy(ABC):
    """Abstract base class for trading strategies."""

    @abstractmethod
    async def analyze(self, market_data: dict) -> dict:
        """Analyse market data and return a trading decision.

        Args:
            market_data: Dictionary containing relevant market information.

        Returns:
            A dict with keys like 'signal', 'price', 'reason', etc.
        """
        ...

    @abstractmethod
    async def execute(self, signal: dict, portfolio: dict) -> dict:
        """Execute a trading signal against a portfolio.

        Args:
            signal: Signal dict produced by analyze().
            portfolio: Current portfolio state.

        Returns:
            Execution result dict (e.g. filled order details).
        """
        ...
