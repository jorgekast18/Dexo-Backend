import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TransactionTypeEntity } from './transaction-type.entity';
import { TransactionEntity } from './transaction.entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'transaction_type_id' })
  transactionTypeId: string;

  @ManyToOne(() => TransactionTypeEntity, (type) => type.categories)
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionTypeEntity;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.category)
  transactions: TransactionEntity[];
}
