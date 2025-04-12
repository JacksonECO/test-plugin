import { RequestInfoCoreService } from 'src/request-info/request-info-core.service';
import { UserRequest } from 'src/request-info/user-request.model';

export class RequestInfoCoreServiceMock extends RequestInfoCoreService {
  static tokenGerado = 'Bearer token-request';

  constructor() {
    super(undefined);
  }

  getRequest(): Request {
    return {} as Request;
  }
  getHeaders() {
    return {};
  }
  getIp(): string {
    return '127.0.0.1';
  }
  getAuthorization(): string {
    return RequestInfoCoreServiceMock.tokenGerado;
  }
  getUser(): UserRequest {
    return {} as UserRequest;
  }
  getUserId(): string {
    return '1';
  }
  getUserEmail(): string {
    return 'email@host.com';
  }
  getUserAgencia(): string {
    return '0001';
  }
}

export const mockRequestInfoCoreService = (): RequestInfoCoreService => new RequestInfoCoreServiceMock();
