import { CanActivateChildFn } from '@angular/router';

export const restaurantAuthGuard: CanActivateChildFn = (childRoute, state) => {
  return true;
};
