import { mockAuthServerService } from './auth-server.service.mock';
import { HttpCoreService } from 'src/http/http-core.service';

export class HttpCoreServiceMock extends HttpCoreService {
  constructor() {
    const authServerService = mockAuthServerService();

    super(authServerService);
  }
}

export const mockHttpCoreService = (): HttpCoreService => new HttpCoreServiceMock();
