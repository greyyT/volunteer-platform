import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { ConfigModule } from '@nestjs/config';
import { jwtModule } from 'src/modules.config';

@Module({
  imports: [ConfigModule, jwtModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [],
})
export class AuthModule {}
