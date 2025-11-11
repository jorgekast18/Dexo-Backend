import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { TransactionTypeEntity } from './transaction-type.entity';
import { CategoryEntity } from './category.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'transaction_type_id' })
  transactionTypeId: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TransactionTypeEntity, (type) => type.transactions)
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionTypeEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.transactions)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
}
