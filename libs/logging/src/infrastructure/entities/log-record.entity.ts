import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class LogRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  serviceName!: string;

  @Column()
  method!: string;

  @Column()
  path!: string;

  @Column('jsonb', { nullable: true })
  requestBody!: any;

  @Column('jsonb', { nullable: true })
  responseBody!: any;

  @CreateDateColumn()
  timestamp!: Date;

  @Column()
  statusCode!: number;
}
