import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // Check for Public decorator both in individual route handler level and controller level

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // check the method level first
      context.getClass(), // check the controller level second
    ]);

    /* If isPublic is true, 
    the guard immediately allows the request through 
    without checking for an Authorization header or JWT token. */

    if (isPublic) {
      return true;
    }

    /* If the route is not public, 
    it executes Passport's default JWT authentication logic */
    return super.canActivate(context);
  }
}
