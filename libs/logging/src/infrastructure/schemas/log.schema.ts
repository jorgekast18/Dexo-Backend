import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true, collection: 'logs' })
export class Log {
  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  statusCode: number;

  @Prop({ type: Object })
  headers: Record<string, string | string[]>;

  @Prop({ type: Object })
  body: Record<string, unknown>;

  @Prop({ type: Object })
  query: Record<string, string | string[]>;

  @Prop({ type: Object })
  response: Record<string, unknown>;

  @Prop({ required: true })
  timestamp: Date;

  @Prop()
  responseTime: number;

  @Prop()
  ip: string;

  @Prop()
  userAgent: string;

  @Prop()
  service: string;

  @Prop()
  error: string;

  @Prop({ default: 'info' })
  level: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
