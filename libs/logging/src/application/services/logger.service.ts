import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogRecord } from '../../infrastructure/entities/log-record.entity';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(LogRecord)
    private readonly logRepo: Repository<LogRecord>,
  ) {}

  async logRequest(data: {
    serviceName: string;
    method: string;
    path: string;
    requestBody: any;
    responseBody?: any;
    statusCode: number;
  }) {
    const log = this.logRepo.create(data);
    await this.logRepo.save(log);
  }
}
