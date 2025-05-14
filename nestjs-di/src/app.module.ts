import { Module } from '@nestjs/common';
import { BatteryModule } from './battery/battery.module';
import { CarModule } from './car/car.module';
import { ConditionerModule } from './conditioner/conditioner.module';
import { EngineModule } from './engine/engine.module';

@Module({
  imports: [BatteryModule, CarModule, ConditionerModule, EngineModule],
})
export class AppModule {}
