import { Test, TestingModule } from '@nestjs/testing';
import { HttpCoreModule } from './http-core.module';
import { HttpCoreService } from './http-core.service';
import { PluginCoreModule } from 'src/plugin-core.module';
import { mockPluginCoreOption } from 'test/mocks/options.dto.mock';
import { INestApplicationContext } from '@nestjs/common';
import { AuthServerCoreModule } from 'src/auth-server/auth-server.module';
import { RequestInfoCoreModule } from 'src/request-info/request-info-core.module';

describe('HttpCoreModule', () => {
  let moduleTest: TestingModule;
  let module: INestApplicationContext;

  beforeEach(async () => {
    moduleTest = await Test.createTestingModule({
      imports: [HttpCoreModule, PluginCoreModule.forRoot(mockPluginCoreOption())],
    }).compile();

    module = moduleTest.select(HttpCoreModule);
  });

  it('deve estar definido', () => {
    expect(moduleTest).toBeDefined();
    expect(module).toBeDefined();
  });

  it('deve prover corretamente', () => {
    const service = moduleTest.get<HttpCoreService>(HttpCoreService);
    expect(service).toBeDefined();

    const paramUndefined = moduleTest.get('default-undefined');
    expect(paramUndefined).toBeUndefined();
  });

  it('deve exportar corretamente', () => {
    const exports = module['contextModule']['_exports'];

    expect(exports.size).toBe(1);
    expect(exports.has(HttpCoreService)).toBeTruthy();
  });

  it('deve importar corretamente suas dependências', () => {
    expect(moduleTest.select(AuthServerCoreModule)).toBeDefined();
    expect(moduleTest.select(RequestInfoCoreModule)).toBeDefined();
  });
});
