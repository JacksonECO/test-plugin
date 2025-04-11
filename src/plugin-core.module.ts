import { DynamicModule, Global } from '@nestjs/common';
import { CORE_AUTHORIZATION_OPTION, CORE_PLUGIN_OPTION } from './constants';
import { PluginCoreOption } from './options.dto';

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
      exports: [CORE_PLUGIN_OPTION, CORE_AUTHORIZATION_OPTION],
    };
  }
}
