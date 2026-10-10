import { AuthGuard } from './auth.guard.js';
import type AuthenticateUser from '../user/user-auth/auth.service.js';
import type { ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard({ verifyToken: vi.fn() } as unknown as AuthenticateUser)).toBeDefined();
  });

  it('allows unauthenticated GET requests for public files', async () => {
    const authenticateUser = { verifyToken: vi.fn() };
    const guard = new AuthGuard(authenticateUser as unknown as AuthenticateUser);
    const request = { method: 'GET', path: '/file/public/file-id' };
    const context = {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(authenticateUser.verifyToken).not.toHaveBeenCalled();
  });
});
