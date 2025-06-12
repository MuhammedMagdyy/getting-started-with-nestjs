import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;
}
