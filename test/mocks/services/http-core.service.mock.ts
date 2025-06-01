import { mockAuthorizationOption } from '../options.dto.mock';
import { mockRequestInfoCoreService } from './request-info-core.service.mock';
import { mockAuthServerService } from './auth-server.service.mock';
import { HttpCoreService } from 'src/http/http-core.service';

export class HttpCoreServiceMock extends HttpCoreService {
  constructor() {
    const options = mockAuthorizationOption();
    const requestInfoCoreService = mockRequestInfoCoreService();
    const authServerService = mockAuthServerService();

    super(options, authServerService, requestInfoCoreService, false);
  }
}

export const mockHttpCoreService = (): HttpCoreService => new HttpCoreServiceMock();
