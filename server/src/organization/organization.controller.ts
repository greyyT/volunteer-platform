import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { ControllerAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { privateStorageConfig } from 'src/storage.config';
import { RequestWithAuth } from 'src/types';

@Controller('api/organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @UseGuards(ControllerAuthGuard)
  @UseInterceptors(
    FileInterceptor('verificationPaper', {
      storage: privateStorageConfig('organization-verifications'),
    }),
  )
  @Post('verification')
  async uploadVerification(
    @Req() request: RequestWithAuth,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id } = request;
    await this.organizationService.uploadVerification(id, file.path);
  }
}
