import { Test, TestingModule } from '@nestjs/testing';
import { HttpCoreRequestModule } from './http-core-request.module';
import { HttpCoreRequestService } from './http-core-request.service';
import { PluginCoreModule } from 'src/plugin-core.module';
import { mockPluginCoreOption } from 'test/mocks/options.dto.mock';
import { INestApplicationContext } from '@nestjs/common';
import { AuthServerCoreModule } from 'src/auth-server/auth-server.module';
import { RequestInfoCoreModule } from 'src/request-info/request-info-core.module';

describe('HttpCoreRequestModule', () => {
  let moduleTest: TestingModule;
  let module: INestApplicationContext;

  beforeEach(async () => {
    moduleTest = await Test.createTestingModule({
      imports: [HttpCoreRequestModule, PluginCoreModule.forRoot(mockPluginCoreOption())],
    }).compile();

    module = moduleTest.select(HttpCoreRequestModule);
  });

  it('deve estar definido', () => {
    expect(moduleTest).toBeDefined();
    expect(module).toBeDefined();
  });

  it('deve prover corretamente', () => {
    const service = moduleTest.get<HttpCoreRequestService>(HttpCoreRequestService);
    expect(service).toBeDefined();

    const paramUndefined = moduleTest.get('default-undefined');
    expect(paramUndefined).toBeUndefined();
  });

  it('deve exportar corretamente', () => {
    const exports = module['contextModule']['_exports'];

    expect(exports.size).toBe(1);
    expect(exports.has(HttpCoreRequestService)).toBeTruthy();
  });

  it('deve importar corretamente suas dependências', () => {
    expect(moduleTest.select(AuthServerCoreModule)).toBeDefined();
    expect(moduleTest.select(RequestInfoCoreModule)).toBeDefined();
  });
});
