import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],

  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),

    signOptions: {
      expiresIn: parseInt(configService.get<string>('JWT_EXPIRATION_TIME')),
    },
  }),

  inject: [ConfigService],
});
