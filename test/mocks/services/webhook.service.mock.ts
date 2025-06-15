import { GuardianCoreService } from 'src/guardian/guardian-core.service';
import { mockGuardianOptions } from '../options.dto.mock';

export class GuardianCoreServiceMock extends GuardianCoreService {
  constructor() {
    const guardianOptions = mockGuardianOptions();

    super(guardianOptions);
  }
}

export const mockGuardianCoreService = (): GuardianCoreService => new GuardianCoreServiceMock();
