import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
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
}

// export const LogSistemaSchema = SchemaFactory.createForClass(LogSistemaEntity);

export const createLogSistemaSchema = (collectionName: string) => {
  const schema = SchemaFactory.createForClass(LogSistemaCoreEntity);
  schema.set('collection', collectionName);
  return schema;
};

// export const modelNameLogCore = 'LogSistemaCoreEntity';

// export const createLogSistemaSchema = (collectionName: string) => {
//   if (!mongoose.models[modelNameLogCore]) {
//     const schema = SchemaFactory.createForClass(LogSistemaCoreEntity);
//     schema.set('collection', collectionName);
//     mongoose.model(modelNameLogCore, schema);
//   }

//   return mongoose.models[modelNameLogCore];
// };
