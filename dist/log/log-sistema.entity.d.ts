export declare class LogSistemaEntity {
    dataOcorrencia?: Date;
    message?: string;
    request?: any;
    response?: any;
    statusCode?: number;
    tipo?: string;
    user?: string;
}
export declare const LogSistemaSchema: import("mongoose").Schema<LogSistemaEntity, import("mongoose").Model<LogSistemaEntity, any, any, any, import("mongoose").Document<unknown, any, LogSistemaEntity> & LogSistemaEntity & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LogSistemaEntity, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<LogSistemaEntity>> & import("mongoose").FlatRecord<LogSistemaEntity> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
