import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateOrganizationDto } from './dto/auth.dto';
import { DatabaseService } from 'src/database/database.service';
import { Organization } from '@prisma/client';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    this.logger.log(`Creating a new Organization`, createOrganizationDto);

    try {
      const createdOrganization =
        await this.databaseService.organization.create({
          data: createOrganizationDto,
        });
      return createdOrganization;
    } catch (error) {
      this.logger.error(
        `Failed to create organization ${createOrganizationDto.name}\n${error}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
