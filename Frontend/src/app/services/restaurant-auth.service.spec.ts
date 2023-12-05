import { TestBed } from '@angular/core/testing';

import { RestaurantAuthService } from './restaurant-auth.service';

describe('RestaurantAuthService', () => {
  let service: RestaurantAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestaurantAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
