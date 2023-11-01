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
} from '@nestjs/common';
import { EventService } from './event.service';
import { ControllerAuthGuard } from 'src/auth/auth.guard';
import { CreateEventDto } from './dto/event.dto';
import { RequestWithAuth } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { privateStorageConfig } from 'src/storage.config';

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

    await this.eventService.createEvent(createEventDto, id);

    return {
      message: 'Event created successfully',
      statusCode: 200,
    };
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
    console.log(request.body);
    this.logger.log(`File destination: ${file}`);
  }
}
