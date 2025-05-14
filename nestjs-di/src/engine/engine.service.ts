import { Injectable } from '@nestjs/common';
import { BatteryService } from 'src/battery/battery.service';

@Injectable()
export class EngineService {
  constructor(private readonly batteryService: BatteryService) {}

  start(): string {
    return `Engine is started based on ${this.batteryService.powerSupply()}`;
  }
}
