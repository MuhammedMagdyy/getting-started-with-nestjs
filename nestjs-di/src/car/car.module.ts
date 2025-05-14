import { Module } from '@nestjs/common';
import { ConditionerModule } from 'src/conditioner/conditioner.module';
import { EngineModule } from 'src/engine/engine.module';
import { CarController } from './car.controller';

@Module({
  imports: [EngineModule, ConditionerModule],
  controllers: [CarController],
})
export class CarModule {}
