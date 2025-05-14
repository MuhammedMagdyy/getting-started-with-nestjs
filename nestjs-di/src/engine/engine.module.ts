import { Module } from '@nestjs/common';
import { BatteryModule } from 'src/battery/battery.module';
import { EngineService } from './engine.service';

@Module({
  imports: [BatteryModule],
  providers: [EngineService],
  exports: [EngineService],
})
export class EngineModule {}
