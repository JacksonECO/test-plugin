export declare class LogSistemaCoreEntity {
    dataOcorrencia?: Date;
    message?: string;
    request?: any;
    response?: any;
    info?: any;
    statusCode?: number;
    tipo?: string;
    user?: string;
}
export declare const createLogSistemaSchema: (collectionName: string) => import("mongoose").Schema<LogSistemaCoreEntity, import("mongoose").Model<LogSistemaCoreEntity, any, any, any, import("mongoose").Document<unknown, any, LogSistemaCoreEntity> & LogSistemaCoreEntity & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LogSistemaCoreEntity, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<LogSistemaCoreEntity>> & import("mongoose").FlatRecord<LogSistemaCoreEntity> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
