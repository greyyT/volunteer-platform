import {
  Body,
  Controller,
  Get,
  Logger,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ControllerAuthGuard } from 'src/auth/auth.guard';
import { RequestWithAuth } from 'src/types';
import { UpdateAccountDto } from './dto/update-account.dto';

@UsePipes(new ValidationPipe())
@Controller('api/account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  @UseGuards(ControllerAuthGuard)
  @Get()
  async getAccountInfo(@Req() request: RequestWithAuth) {
    const { id, isOrganization } = request;

    const account = await this.accountService.getAccountInfo(
      id,
      isOrganization,
    );

    return {
      message: 'Account retrieved successfully',
      statusCode: 200,
      data: account,
    };
  }

  @UseGuards(ControllerAuthGuard)
  @Patch()
  async updateAccountInfo(
    @Req() request: RequestWithAuth,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    const { id, isOrganization } = request;

    await this.accountService.updateAccountInfo(
      id,
      isOrganization,
      updateAccountDto,
    );

    return {
      message: 'Account updated successfully',
      statusCode: 200,
    };
  }
}
