import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import AuthenticateUser from '../user/user-auth/auth.service.js';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authenticateUser: AuthenticateUser,
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    // Public routes
    if (
      request.path.includes('/login') ||
      request.path.includes('/signup')
    ) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Authorization header is required'
      );
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Invalid authorization format'
      );
    }

    const user = await this.authenticateUser.verifyToken(token);

    console.log(user)

    if (!user) {
      throw new UnauthorizedException(
        'Invalid or expired token'
      );
    }

    request.user = user;

    return true;
  }
}