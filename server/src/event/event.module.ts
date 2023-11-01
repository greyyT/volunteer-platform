import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EventRepository } from './event.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
