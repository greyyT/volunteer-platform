import { Injectable, Logger } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountInfo } from 'src/types';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountInfo(
    id: string,
    isOrganization: boolean,
  ): Promise<AccountInfo> {
    const account = await this.accountRepository.getAccountInfo(
      id,
      isOrganization,
    );

    this.logger.log(`Account with id ${id} retrieved successfully`);
    this.logger.verbose(JSON.stringify(account));

    return account;
  }

  async updateAccountInfo(
    id: string,
    isOrganization: boolean,
    updateAccountDto: UpdateAccountDto,
  ): Promise<void> {
    await this.accountRepository.updateAccountInfo(
      id,
      isOrganization,
      updateAccountDto,
    );

    this.logger.log(`Account with id ${id} updated successfully`);
  }
}
