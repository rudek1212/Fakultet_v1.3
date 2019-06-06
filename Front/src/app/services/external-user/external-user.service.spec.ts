import { TestBed } from '@angular/core/testing';

import { ExternalUserService } from './external-user.service';

describe('ExternalUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExternalUserService = TestBed.get(ExternalUserService);
    expect(service).toBeTruthy();
  });
});
