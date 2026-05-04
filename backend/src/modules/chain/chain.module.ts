import { Module } from '@nestjs/common';
import { ChainService } from './chain.service';
import { ContractService } from './contract.service';
import { RelayerService } from './relayer.service';

@Module({
  providers: [ChainService, ContractService, RelayerService],
})
export class ChainModule {}
