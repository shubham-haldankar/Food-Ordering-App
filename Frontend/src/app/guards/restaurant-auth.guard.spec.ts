import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { restaurantAuthGuard } from './restaurant-auth.guard';

describe('restaurantAuthGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => restaurantAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
