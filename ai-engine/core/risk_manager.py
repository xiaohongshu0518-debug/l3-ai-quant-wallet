"""
Risk manager — stop-loss, take-profit, and position sizing.
"""

import logging

logger = logging.getLogger(__name__)


class RiskManager:
    """Risk management utilities."""

    @staticmethod
    def check_stop_loss(
        current_price: float, entry_price: float, stop_loss_pct: float
    ) -> bool:
        """Check whether the current price has triggered a stop-loss.

        Args:
            current_price: Current market price.
            entry_price: Entry price of the position.
            stop_loss_pct: Stop-loss percentage (e.g. 5.0 means 5 %).

        Returns:
            True if stop-loss is hit.
        """
        if entry_price <= 0 or stop_loss_pct <= 0:
            return False

        loss_pct = (entry_price - current_price) / entry_price * 100
        triggered = loss_pct >= stop_loss_pct
        if triggered:
            logger.info(
                "Stop-loss triggered: entry=%.4f, current=%.4f, loss=%.2f%% (limit=%.2f%%)",
                entry_price,
                current_price,
                loss_pct,
                stop_loss_pct,
            )
        return triggered

    @staticmethod
    def check_take_profit(
        current_price: float, entry_price: float, take_profit_pct: float
    ) -> bool:
        """Check whether the current price has triggered a take-profit.

        Args:
            current_price: Current market price.
            entry_price: Entry price of the position.
            take_profit_pct: Take-profit percentage (e.g. 10.0 means 10 %).

        Returns:
            True if take-profit is hit.
        """
        if entry_price <= 0 or take_profit_pct <= 0:
            return False

        profit_pct = (current_price - entry_price) / entry_price * 100
        triggered = profit_pct >= take_profit_pct
        if triggered:
            logger.info(
                "Take-profit triggered: entry=%.4f, current=%.4f, profit=%.2f%% (limit=%.2f%%)",
                entry_price,
                current_price,
                profit_pct,
                take_profit_pct,
            )
        return triggered

    @staticmethod
    def calculate_position_size(balance: float, risk_pct: float) -> float:
        """Calculate position size based on account balance and risk percentage.

        Args:
            balance: Total account balance.
            risk_pct: Risk percentage (e.g. 2.0 means 2 % of balance).

        Returns:
            Position size in quote currency.
        """
        if balance <= 0 or risk_pct <= 0:
            return 0.0
        return balance * (risk_pct / 100.0)
