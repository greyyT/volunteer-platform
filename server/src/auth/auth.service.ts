import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreateOrganizationDto,
  CreateUserDto,
  SignInDto,
} from './dto/auth.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    const account = await this.authRepository.validateAccount(signInDto);

    this.logger.debug(`Creating access token for ${account.email}`);

    const signedString = this.jwtService.sign(
      {
        isOrganization: account.isOrganization,
        email: account.email,
      },
      {
        subject: account.id,
      },
    );

    this.logger.log(`Access token created for ${account.email}`);

    return signedString;
  }

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<boolean> {
    const isCreated = await this.authRepository.createOrganization(
      createOrganizationDto,
    );
    return isCreated;
  }

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = await this.authRepository.createUser(createUserDto);
    return createdUser;
  }
}
