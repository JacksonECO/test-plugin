export declare const META_LOG_CUSTOM = "MetaLogCustom";
export interface LogCustomOptions {
    tipo?: string;
    mensagem?: string;
    salvarSucesso?: boolean;
    salvarResponseSucesso?: boolean;
    excluirRequest?: boolean;
    excluirResponse?: boolean;
    excluirCampoRequest?: string[];
    excluirCampoResponse?: string[];
    mascararCampoRequest?: string[];
    mascararCampoResponse?: string[];
}
export declare const LogCustom: (options: LogCustomOptions) => import("@nestjs/common").CustomDecorator<string>;
