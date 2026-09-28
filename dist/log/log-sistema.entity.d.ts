export declare class LogSistemaCoreEntity {
  dataOcorrencia?: Date;
  message?: string;
  request?: any;
  response?: any;
  info?: any;
  statusCode?: number;
  tipo?: string;
  user?: string;
  systemName?: string;
  ip?: string;
  correlationId?: string;
}
export declare const LogSistemaCoreSchema: import('mongoose').Schema<
  LogSistemaCoreEntity,
  import('mongoose').Model<LogSistemaCoreEntity, any, any, any, any, any, LogSistemaCoreEntity>,
  {},
  {},
  {},
  {},
  import('mongoose').DefaultSchemaOptions,
  LogSistemaCoreEntity,
  import('mongoose').Document<
    unknown,
    {},
    LogSistemaCoreEntity,
    {
      id: string;
    },
    import('mongoose').DefaultSchemaOptions
  > &
    Omit<
      LogSistemaCoreEntity & {
        _id: import('mongoose').Types.ObjectId;
      } & {
        __v: number;
      },
      'id'
    > &
    import('mongoose').HydratedDocumentOverrides<{
      id: string;
    }>,
  {
    dataOcorrencia?: import('mongoose').SchemaDefinitionProperty<
      Date,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    message?: import('mongoose').SchemaDefinitionProperty<
      string,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    request?: import('mongoose').SchemaDefinitionProperty<
      any,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    response?: import('mongoose').SchemaDefinitionProperty<
      any,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    info?: import('mongoose').SchemaDefinitionProperty<
      any,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    statusCode?: import('mongoose').SchemaDefinitionProperty<
      number,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    tipo?: import('mongoose').SchemaDefinitionProperty<
      string,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    user?: import('mongoose').SchemaDefinitionProperty<
      string,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    systemName?: import('mongoose').SchemaDefinitionProperty<
      string,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    ip?: import('mongoose').SchemaDefinitionProperty<
      string,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
    correlationId?: import('mongoose').SchemaDefinitionProperty<
      string,
      LogSistemaCoreEntity,
      import('mongoose').Document<
        unknown,
        {},
        LogSistemaCoreEntity,
        {
          id: string;
        },
        import('mongoose').DefaultSchemaOptions
      > &
        Omit<
          LogSistemaCoreEntity & {
            _id: import('mongoose').Types.ObjectId;
          } & {
            __v: number;
          },
          'id'
        > &
        import('mongoose').HydratedDocumentOverrides<{
          id: string;
        }>
    >;
  },
  LogSistemaCoreEntity
>;
