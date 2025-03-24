import { DynamicModule, Global } from "@nestjs/common";
import { CORE_AUTHORIZATION_OPTION, CORE_PLUGIN_OPTION } from "./constants";

/**
 * Representa as opções de autorização para o módulo do plugin core.
 */
export class AuthorizationOption {

  /** 
   * URL base do servidor de autenticação ou do core banking.
   */
  authServerUrl: string;

  /** 
   * Reino do servidor de autenticação.
   */
  realm: string;

  /** 
   * Identificador do cliente do micro serviço.
   */
  clientId: string;

  /** 
   * Secret do cliente do micro serviço.
   */
  clientSecret: string;

  /** 
   * Indica se o servidor a ser usado para autenticação é o core banking.
   * 
   * @default `false` utiliza diretamente o servidor de autenticação.
   */
  isCoreServiceAuth?: boolean = false;
}

/**
 * Representa as opções gerais para o módulo do plugin core.
 */
export class PluginCoreOption {

  /**
   * Configurações de autorização.
   */
  authorization: AuthorizationOption;
}

/**
 * Módulo principal do plugin core.
 */
@Global()
export class PluginCoreModule {
  /**
   * Configura o módulo com as opções fornecidas.
   * 
   * @param option Opções para configurar o módulo.
   * @returns Um módulo dinâmico configurado.
   */
  static forRoot(option: PluginCoreOption): DynamicModule {
    return {
      module: PluginCoreModule,
      imports: [],
      providers: [
        {
          provide: CORE_PLUGIN_OPTION,
          useValue: option,
        },
        {
          provide: CORE_AUTHORIZATION_OPTION,
          useValue: option.authorization,
        },
      ],
      exports: [
        CORE_PLUGIN_OPTION,
        CORE_AUTHORIZATION_OPTION,
      ],
    }
  }
}

