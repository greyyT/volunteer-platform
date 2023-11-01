import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOrganizationDto, SignInDto } from './dto/auth.dto';
import { Response } from 'express';

@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const accessToken = await this.authService.signIn(signInDto);

    this.logger.log(`Get access token for ${signInDto.email} successfully`);
    this.logger.debug(`Setting access token to cookie`);

    res.cookie('vta_access_token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    this.logger.log(`Set access token to cookie successfully`);

    return res.status(200).json({
      message: `Sign in successfully`,
      statusCode: 200,
    });
  }

  @Post('sign-up/organization')
  async signUpOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    await this.authService.createOrganization(createOrganizationDto);
    return {
      message: `Organization ${createOrganizationDto.username} created`,
      statusCode: 200,
    };
  }

  @Post('sign-up/user')
  async signUpUser(@Body() createUserDto: CreateOrganizationDto) {
    await this.authService.createUser(createUserDto);
    return {
      message: `User ${createUserDto.username} created`,
      statusCode: 200,
    };
  }
}
