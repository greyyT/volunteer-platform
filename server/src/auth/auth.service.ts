import { Inject, Injectable, Logger } from '@nestjs/common';
import { SignInDto } from './dto/auth.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManger: Cache) {}

  async signIn(signInDto: SignInDto) {
    this.logger.log(`signInDto: ${JSON.stringify(signInDto)}`);
    return { message: 'Sign in successful' };
  }
}
