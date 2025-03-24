import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'log-sistema' })
export class LogSistemaEntity {
  @Prop({ type: Date })
  dataOcorrencia?: Date;

  @Prop({ type: String })
  message?: string;

  @Prop({ type: Object })
  request?: any;

  @Prop({ type: Object })
  response?: any;

  @Prop({ type: Number })
  statusCode?: number;

  @Prop({ type: String })
  tipo?: string;

  @Prop({ type: String })
  user?: string;
}
export const LogSistemaSchema = SchemaFactory.createForClass(LogSistemaEntity);
