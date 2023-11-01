import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateOrganizationDto, SignInDto } from './dto/auth.dto';

@UsePipes(new ValidationPipe())
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const result = await this.authService.signIn(signInDto);
    return result;
  }

  @Post('sign-up/organization')
  async signUpOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    const result = await this.authService.createOrganization(
      createOrganizationDto,
    );
    return result;
  }
}
