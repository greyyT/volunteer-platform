import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  ForbiddenException,
  Param,
  UseInterceptors,
  UploadedFile,
  Logger,
  Get,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ControllerAuthGuard, PublicAuthGuard } from 'src/auth/auth.guard';
import { CreateEventDto } from './dto/event.dto';
import { RequestWithAuth } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { privateStorageConfig, publicStorageConfig } from 'src/storage.config';

@UsePipes(new ValidationPipe())
@Controller('api/event')
export class EventController {
  private readonly logger = new Logger(EventController.name);

  constructor(private readonly eventService: EventService) {}

  @UseGuards(ControllerAuthGuard)
  @Post()
  async createEvent(
    @Req() request: RequestWithAuth,
    @Body() createEventDto: CreateEventDto,
  ) {
    const { id, isOrganization } = request;

    if (!isOrganization) {
      throw new ForbiddenException('Only organizations can create events');
    }

    const event = await this.eventService.createEvent(createEventDto, id);

    return event;
  }

  @Get()
  @UseGuards(PublicAuthGuard)
  async listEvents(@Req() request: RequestWithAuth) {
    if (!request.email) {
      return await this.eventService.listPublicEvents();
    }

    const { id, isOrganization } = request;

    return await this.eventService.listEvents(id, isOrganization);
  }

  @Get(':eventId')
  @UseGuards(PublicAuthGuard)
  async getEvent(
    @Req() request: RequestWithAuth,
    @Param('eventId') eventId: string,
  ) {
    if (!request.email) {
      return await this.eventService.getPublicEvent(eventId);
    }

    const { id, isOrganization } = request;

    const event = await this.eventService.getEvent(eventId, id, isOrganization);

    return event;
  }

  @Post(':positionId/register')
  @UseGuards(ControllerAuthGuard)
  async registerEvent(
    @Req() request: RequestWithAuth,
    @Param('positionId') positionId: string,
  ) {
    const { id } = request;

    await this.eventService.registerEvent(positionId, id);
  }

  @Post(':positionId/unregister')
  @UseGuards(ControllerAuthGuard)
  async unregisterEvent(
    @Req() request: RequestWithAuth,
    @Param('positionId') positionId: string,
  ) {
    const { id } = request;

    await this.eventService.unregisterEvent(positionId, id);
  }

  @UseGuards(ControllerAuthGuard)
  @UseInterceptors(
    FileInterceptor('verificationPaper', {
      storage: privateStorageConfig('event-verifications'),
    }),
  )
  @Post(':eventId/verification')
  async uploadVerification(
    @Param('eventId') eventId: string,
    @Req() request: RequestWithAuth,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.eventService.uploadVerification(eventId, file.path);
  }

  @UseGuards(ControllerAuthGuard)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: publicStorageConfig('event-photos'),
    }),
  )
  @Post(':eventId/photo')
  async uploadPhoto(
    @Param('eventId') eventId: string,
    @Req() request: RequestWithAuth,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.eventService.uploadPhoto(eventId, file.filename);
  }
}
