import { Injectable, Logger } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/event.dto';
import { createEventId } from 'src/utils/id-handler';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(
    createEventDto: CreateEventDto,
    id: string,
  ): Promise<boolean> {
    const eventId = createEventId();

    const isCreated = await this.eventRepository.createEvent(
      createEventDto,
      id,
      eventId,
    );

    this.logger.log(`Event created successfully`);

    return isCreated;
  }
}
