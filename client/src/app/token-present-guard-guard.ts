import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const tokenPresentGuardGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const token: string | null = localStorage.getItem('cdn_auth_token');

  if (token) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
