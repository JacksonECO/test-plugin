export declare const META_LOG_EXCLUDE = "MetaLogExclude";
export interface LogExcludeOptions {
    excludeRequest?: boolean;
    excludeResponse?: boolean;
    requestFields?: string[];
    responseFields?: string[];
    requestFieldsRedact?: string[];
    responseFieldsRedact?: string[];
}
export declare const LogExclude: (options: LogExcludeOptions) => import("@nestjs/common").CustomDecorator<string>;
