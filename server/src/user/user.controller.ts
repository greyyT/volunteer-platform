import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ControllerAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { privateStorageConfig } from 'src/storage.config';
import { RequestWithAuth } from 'src/types';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(ControllerAuthGuard)
  @UseInterceptors(
    FileInterceptor('verificationPaper', {
      storage: privateStorageConfig('user-verifications'),
    }),
  )
  @Post('verification')
  async uploadVerification(
    @Req() request: RequestWithAuth,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id } = request;
    await this.userService.uploadVerification(id, file.path);
  }
}
