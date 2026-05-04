import { Module, forwardRef } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
