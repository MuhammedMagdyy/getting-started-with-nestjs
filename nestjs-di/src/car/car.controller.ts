import { Controller, Get } from '@nestjs/common';
import { ConditionerService } from 'src/conditioner/conditioner.service';
import { EngineService } from 'src/engine/engine.service';

@Controller('car')
export class CarController {
  constructor(
    private readonly engineService: EngineService,
    private readonly conditionerService: ConditionerService,
  ) {}

  @Get('/')
  move(): string {
    return `The car is moving based on ${this.engineService.start()} and ${this.conditionerService.on()}`;
  }
}
