import { Injectable } from '@nestjs/common';

@Injectable()
export class BatteryService {
  powerSupply(): string {
    return 'Battery is up right now';
  }
}
