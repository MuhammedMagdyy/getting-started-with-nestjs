import { Module } from '@nestjs/common';
import { EngineModule } from 'src/engine/engine.module';
import { ConditionerService } from './conditioner.service';

@Module({
  imports: [EngineModule],
  providers: [ConditionerService],
  exports: [ConditionerService],
})
export class ConditionerModule {}
