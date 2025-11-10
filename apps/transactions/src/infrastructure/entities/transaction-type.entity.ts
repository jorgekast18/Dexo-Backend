import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { TransactionEntity } from './transaction.entity';

@Entity('transaction_types')
export class TransactionTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => CategoryEntity, (category) => category.transactionType)
  categories: CategoryEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.transactionType)
  transactions: TransactionEntity[];
}
