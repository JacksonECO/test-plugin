import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'log-sistema' })
export class LogSistemaCoreEntity {
  @Prop({ type: Date })
  dataOcorrencia?: Date;

  @Prop({ type: String })
  message?: string;

  @Prop({ type: Object })
  request?: any;

  @Prop({ type: Object })
  response?: any;

  @Prop({ type: Object })
  info?: any;

  @Prop({ type: Number })
  statusCode?: number;

  @Prop({ type: String })
  tipo?: string;

  @Prop({ type: String })
  user?: string;

  /** Nome do sistema que gerou o log. Gravado quando `LogOptions.systemName` está configurado. */
  @Prop({ type: String })
  systemName?: string;

  /** IP de origem da requisição. Gravado quando `LogOptions.salvarIp` está ativo. */
  @Prop({ type: String })
  ip?: string;

  /** Id de correlação da requisição. Gravado quando `LogOptions.salvarCorrelationId` está ativo. */
  @Prop({ type: String })
  correlationId?: string;
}

export const LogSistemaCoreSchema = SchemaFactory.createForClass(LogSistemaCoreEntity);

// export const createLogSistemaSchema = (collectionName: string) => {
//   const schema = SchemaFactory.createForClass(LogSistemaCoreEntity);
//   schema.set('collection', collectionName);
//   return schema;
// };

// export const modelNameLogCore = 'LogSistemaCoreEntity';

// export const createLogSistemaSchema = (collectionName: string) => {
//   if (!mongoose.models[modelNameLogCore]) {
//     const schema = SchemaFactory.createForClass(LogSistemaCoreEntity);
//     schema.set('collection', collectionName);
//     mongoose.model(modelNameLogCore, schema);
//   }

//   return mongoose.models[modelNameLogCore];
// };
