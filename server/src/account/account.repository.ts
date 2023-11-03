import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { AccountInfo } from 'src/types';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountRepository {
  private readonly logger = new Logger(AccountRepository.name);

  constructor(
    configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  async getAccountInfo(
    id: string,
    isOrganization: boolean,
  ): Promise<AccountInfo> {
    this.logger.debug(`Fetching account with id ${id}`);

    if (isOrganization) {
      const account = await this.databaseService.organization.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          phone: true,
          isVerified: true,
          portrait: true,
          location: true,
          isOrganization: true,
        },
      });

      if (!account) {
        throw new InternalServerErrorException(
          `Organization with id ${id} does not exist`,
        );
      }

      return account;
    }

    const account = await this.databaseService.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        isVerified: true,
        portrait: true,
        location: true,
        isOrganization: true,
      },
    });

    if (!account) {
      throw new InternalServerErrorException(
        `User with id ${id} does not exist`,
      );
    }

    return account;
  }

  async updateAccountInfo(
    id: string,
    isOrganization: boolean,
    updateAccountDto: UpdateAccountDto,
  ): Promise<void> {
    this.logger.debug(`Updating account with id ${id}`);
    this.logger.verbose(`Account info: ${JSON.stringify(updateAccountDto)}`);

    try {
      if (isOrganization) {
        await this.databaseService.organization.update({
          where: {
            id,
          },
          data: {
            ...updateAccountDto,
          },
        });
      } else {
        await this.databaseService.user.update({
          where: {
            id,
          },
          data: {
            ...updateAccountDto,
          },
        });
      }
    } catch (error) {
      this.logger.error(`Error updating account with id ${id}: ${error}`);
      throw new InternalServerErrorException('Error updating account info');
    }
  }
}
