import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const autheticationCheckGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const token: string | null = localStorage.getItem('cdn_auth_token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
