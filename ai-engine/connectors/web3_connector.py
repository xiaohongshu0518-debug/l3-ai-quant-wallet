"""
Web3 on-chain connector — MVP stub.

Will be used to fetch on-chain data (wallet balances, token prices,
DEX liquidity, etc.) via Web3 provider in future iterations.
"""

import logging
from typing import Any

logger = logging.getLogger(__name__)


class Web3Connector:
    """Stub Web3 connector for MVP.

    In production this would use web3.py or ethers.js to interact
    with Ethereum-compatible chains.
    """

    def __init__(self, rpc_url: str | None = None):
        self.rpc_url = rpc_url or "https://eth.llamarpc.com"
        logger.info("Web3Connector initialised (MVP stub) with RPC: %s", self.rpc_url)

    async def get_eth_balance(self, address: str) -> dict[str, Any]:
        """Get ETH balance for an address (stub).

        Args:
            address: Ethereum address.

        Returns:
            Dict with balance in wei and ether.
        """
        logger.debug("Web3Connector.get_eth_balance(%s) — stub returning mock data.", address)
        return {
            "address": address,
            "balance_wei": "1000000000000000000",
            "balance_ether": 1.0,
        }

    async def get_token_balance(self, address: str, token_address: str) -> dict[str, Any]:
        """Get ERC-20 token balance (stub).

        Args:
            address: Wallet address.
            token_address: Token contract address.

        Returns:
            Dict with balance as string.
        """
        logger.debug(
            "Web3Connector.get_token_balance(%s, %s) — stub returning mock data.",
            address,
            token_address,
        )
        return {
            "wallet": address,
            "token": token_address,
            "balance": "5000000000000000000",
            "decimals": 18,
        }

    async def get_token_price(self, token_address: str) -> dict[str, Any]:
        """Get token price from a DEX (stub).

        Args:
            token_address: Token contract address.

        Returns:
            Dict with price in USD.
        """
        logger.debug("Web3Connector.get_token_price(%s) — stub.", token_address)
        return {
            "token": token_address,
            "price_usd": 1.0,
            "source": "mock",
        }
