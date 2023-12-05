import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userLoginPageGuard } from './user-login-page.guard';

describe('userLoginPageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userLoginPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
