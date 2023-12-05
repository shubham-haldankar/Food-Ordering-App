import { CanActivateFn } from '@angular/router';

export const restaurantLoginPageGuard: CanActivateFn = (route, state) => {
  return true;
};
