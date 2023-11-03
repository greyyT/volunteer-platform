import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestWithAuth } from 'src/types';

@Injectable()
export class ControllerAuthGuard implements CanActivate {
  private readonly logger = new Logger(ControllerAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: RequestWithAuth = context.switchToHttp().getRequest();

    this.logger.debug(`Checking for authorization header`);
    const accessToken = request.cookies['vta_access_token'];

    try {
      const payload = this.jwtService.verify(accessToken);

      this.logger.log(`Access token verified`);

      request.email = payload.email;
      request.isOrganization = payload.isOrganization;
      request.id = payload.sub;

      return true;
    } catch {
      throw new ForbiddenException('Invalid authorization token');
    }
  }
}

@Injectable()
export class PublicAuthGuard implements CanActivate {
  private readonly logger = new Logger(PublicAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: RequestWithAuth = context.switchToHttp().getRequest();

    this.logger.debug(`Checking for authorization header`);
    const accessToken = request.cookies['vta_access_token'];

    if (!accessToken) {
      // If access token is not present, allow access to the route
      this.logger.log(`No access token found, allowing access to the route`);
      return true;
    }

    try {
      const payload = this.jwtService.verify(accessToken);

      this.logger.log(`Access token verified`);

      request.email = payload.email;
      request.isOrganization = payload.isOrganization;
      request.id = payload.sub;

      return true;
    } catch {
      throw new ForbiddenException('Invalid authorization token');
    }
  }
}
