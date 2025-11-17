import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from '../../infrastructure/schemas/log.schema';

export interface CreateLogDto {
  method: string;
  url: string;
  statusCode: number;
  headers?: Record<string, string | string[]>;
  body?: Record<string, unknown>;
  query?: Record<string, string | string[]>;
  response?: Record<string, unknown>;
  timestamp: Date;
  responseTime?: number;
  ip?: string;
  userAgent?: string;
  service?: string;
  error?: string;
  level?: string;
}

export interface LogQueryOptions {
  service?: string;
  method?: string;
  statusCode?: number;
  level?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}

interface LogQuery {
  service?: string;
  method?: string;
  statusCode?: number;
  level?: string;
  timestamp?: {
    $gte?: Date;
    $lte?: Date;
  };
}

interface LogStats {
  _id: number;
  count: number;
  avgResponseTime: number | null;
}

@Injectable()
export class LoggingService {
  constructor(
    @InjectModel(Log.name) private logModel: Model<LogDocument>
  ) {}

  async createLog(createLogDto: CreateLogDto): Promise<Log> {
    try {
      const createdLog = new this.logModel(createLogDto);
      return await createdLog.save();
    } catch (error) {
      console.error('Error saving log to database:', error);
      throw error;
    }
  }

  async findLogs(options: LogQueryOptions = {}): Promise<Log[]> {
    const {
      service,
      method,
      statusCode,
      level,
      startDate,
      endDate,
      limit = 100,
      skip = 0,
    } = options;

    const query: LogQuery = {};

    if (service) query.service = service;
    if (method) query.method = method;
    if (statusCode) query.statusCode = statusCode;
    if (level) query.level = level;

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = startDate;
      if (endDate) query.timestamp.$lte = endDate;
    }

    return this.logModel
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async findLogById(id: string): Promise<Log | null> {
    return this.logModel.findById(id).exec();
  }

  async getLogStats(service?: string): Promise<LogStats[]> {
    const match: Record<string, string> = {};
    if (service) match.service = service;

    return this.logModel.aggregate<LogStats>([
      { $match: match },
      {
        $group: {
          _id: '$statusCode',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async deleteOldLogs(daysToKeep = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.logModel.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    return result.deletedCount || 0;
  }
}
