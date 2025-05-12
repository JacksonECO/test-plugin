import { DynamicModule } from '@nestjs/common';
import { PluginCoreOption } from './options.dto';
export declare class PluginCoreModule {
  static forRoot(option: PluginCoreOption): DynamicModule;
}
