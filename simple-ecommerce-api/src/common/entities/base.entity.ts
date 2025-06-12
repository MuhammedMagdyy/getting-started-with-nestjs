import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DEFAULT_CURRENT_TIMESTAMP } from '../utils/constants';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => DEFAULT_CURRENT_TIMESTAMP,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => DEFAULT_CURRENT_TIMESTAMP,
    onUpdate: DEFAULT_CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
