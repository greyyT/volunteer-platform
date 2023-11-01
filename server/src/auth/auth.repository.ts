import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateOrganizationDto,
  CreateUserDto,
  SignInDto,
} from './dto/auth.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { Organization, User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(
    password: string,
    hassedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hassedPassword);
  }

  async validateAccount(signInDto: SignInDto): Promise<Organization | User> {
    this.logger.debug(`Validating account`, signInDto.email);

    const account =
      (await this.databaseService.user.findFirst({
        where: {
          email: signInDto.email,
        },
      })) ||
      (await this.databaseService.organization.findFirst({
        where: {
          email: signInDto.email,
        },
      }));

    if (!account) {
      this.logger.error(`Account ${signInDto.email} not found`);
      throw new NotFoundException('Account not found');
    }

    const isPasswordValid = await this.validatePassword(
      signInDto.password,
      account.password,
    );

    if (!isPasswordValid) {
      this.logger.error(`Account ${signInDto.email} password is invalid`);
      throw new BadRequestException('Account password is invalid');
    }

    this.logger.log(`Account ${signInDto.email} is valid`);

    return account;
  }

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<boolean> {
    this.logger.debug(`Creating a new Organization`, createOrganizationDto);

    const isExisted = await this.databaseService.user.findFirst({
      where: {
        OR: [
          {
            email: createOrganizationDto.email,
          },
          {
            username: createOrganizationDto.username,
          },
        ],
      },
    });

    if (isExisted) {
      this.logger.error(
        `Failed to create organization ${createOrganizationDto.username}`,
      );
      throw new ConflictException('Email or username already exists');
    }

    const salt = await bcrypt.genSalt();

    try {
      const createdOrganization =
        await this.databaseService.organization.create({
          data: {
            ...createOrganizationDto,
            salt,
            password: await this.hashPassword(
              createOrganizationDto.password,
              salt,
            ),
          },
        });

      this.logger.log(
        `Created a new Organization`,
        createdOrganization.username,
      );

      return true;
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.error(
          `Failed to create organization ${createOrganizationDto.username}\n${error}`,
        );
        throw new ConflictException(
          'Organization with that email already exists',
        );
      }
      this.logger.error(
        `Failed to create organization ${createOrganizationDto.username}\n${error}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    this.logger.debug(`Createing a new User`, createUserDto);

    const isExisted = await this.databaseService.organization.findFirst({
      where: {
        OR: [
          {
            email: createUserDto.email,
          },
          {
            username: createUserDto.username,
          },
        ],
      },
    });

    if (isExisted) {
      this.logger.error(`Failed to create user ${createUserDto.username}`);
      throw new ConflictException('Email or username already exists');
    }

    const salt = await bcrypt.genSalt();

    try {
      const createdUser = await this.databaseService.user.create({
        data: {
          ...createUserDto,
          salt,
          password: await this.hashPassword(createUserDto.password, salt),
        },
      });

      this.logger.log(`Created a new User`, createdUser.username);
      return true;
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.error(
          `Failed to create user ${createUserDto.username}\n${error}`,
        );
        throw new ConflictException('User with that email already exists');
      }
      this.logger.error(
        `Failed to create user ${createUserDto.username}\n${error}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
