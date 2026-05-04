import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class ChainService {
  private providers: Map<number, ethers.JsonRpcProvider> = new Map();

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('blockchain.rpcUrl');
    const chainId = this.configService.get<number>('blockchain.chainId');
    if (rpcUrl && chainId) {
      this.providers.set(chainId, new ethers.JsonRpcProvider(rpcUrl, chainId));
    }
  }

  private getProvider(chainId: number): ethers.JsonRpcProvider {
    let provider = this.providers.get(chainId);
    if (!provider) {
      provider = new ethers.JsonRpcProvider(
        `https://eth-mainnet.g.alchemy.com/v2/demo`,
        chainId,
      );
      this.providers.set(chainId, provider);
    }
    return provider;
  }

  async getChainInfo(chainId: number) {
    const provider = this.getProvider(chainId);
    const [blockNumber, network] = await Promise.all([
      provider.getBlockNumber(),
      provider.getNetwork(),
    ]);

    return {
      chainId: Number(network.chainId),
      name: network.name,
      blockNumber,
      timestamp: Date.now(),
    };
  }

  async getGasPrice(chainId: number) {
    const provider = this.getProvider(chainId);
    const feeData = await provider.getFeeData();

    return {
      gasPrice: feeData.gasPrice?.toString() || '0',
      maxFeePerGas: feeData.maxFeePerGas?.toString() || '0',
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString() || '0',
    };
  }

  async verifyTransaction(txHash: string) {
    const provider = this.getProvider(1); // Default to mainnet
    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return { verified: false, message: 'Transaction not found' };
    }

    const receipt = await provider.getTransactionReceipt(txHash);

    return {
      verified: true,
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      status: receipt?.status === 1 ? 'success' : 'failed',
      blockNumber: receipt?.blockNumber,
      gasUsed: receipt?.gasUsed.toString(),
    };
  }
}
