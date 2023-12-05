import { CanActivateFn } from '@angular/router';

export const userLoginPageGuard: CanActivateFn = (route, state) => {
  return true;
};
