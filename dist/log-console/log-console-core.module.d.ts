import { DynamicModule } from '@nestjs/common';
import { LogConsoleOptions } from 'src/options.dto';
export declare class LogConsoleCoreModule {
    static forRoot(option?: LogConsoleOptions): DynamicModule;
}
