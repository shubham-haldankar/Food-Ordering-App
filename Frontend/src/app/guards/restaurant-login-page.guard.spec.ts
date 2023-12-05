import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { restaurantLoginPageGuard } from './restaurant-login-page.guard';

describe('restaurantLoginPageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => restaurantLoginPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
