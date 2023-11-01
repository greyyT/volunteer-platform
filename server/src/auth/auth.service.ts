import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOrganizationDto, SignInDto } from './dto/auth.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
    private readonly authRepository: AuthRepository,
  ) {}

  async signIn(signInDto: SignInDto) {
    this.logger.log(`signInDto: ${JSON.stringify(signInDto)}`);
    return { message: 'Sign in successful' };
  }

  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const createdOrganization = await this.authRepository.createOrganization(
      createOrganizationDto,
    );
  }
}
