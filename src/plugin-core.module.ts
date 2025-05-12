import { DynamicModule, Global } from '@nestjs/common';
import { CORE_AUTHORIZATION_OPTION, CORE_LOG_OPTION, CORE_PLUGIN_OPTION, CORE_WEBHOOK_OPTION } from './constants';
import { PluginCoreOption, WebhookOptions } from './options.dto';

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
        {
          provide: CORE_LOG_OPTION,
          useValue: option.log,
        },
        {
          provide: CORE_WEBHOOK_OPTION,
          useValue: new WebhookOptions(option.webhook),
        },
      ],
      exports: [CORE_PLUGIN_OPTION, CORE_AUTHORIZATION_OPTION, CORE_LOG_OPTION, CORE_WEBHOOK_OPTION],
    };
  }
}
