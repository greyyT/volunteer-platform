import { Injectable, Logger } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/event.dto';
import { createEventId } from 'src/utils/id-handler';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(private readonly eventRepository: EventRepository) {}

  async createEvent(createEventDto: CreateEventDto, id: string) {
    const eventId = createEventId();

    const event = await this.eventRepository.createEvent(
      createEventDto,
      id,
      eventId,
    );

    this.logger.log(`Event created successfully`);

    return event;
  }

  async listPublicEvents() {
    const events = await this.eventRepository.listPublicEvents();

    return events;
  }

  async listEvents(id: string, isOrganization: boolean) {
    if (isOrganization) {
      this.logger.log(`Fetching events for organization with id ${id}`);

      const events = this.listPublicEvents();

      return events;
    }

    const events = await this.eventRepository.listUserEvents(id);

    return events;
  }

  async getPublicEvent(eventId: string) {
    const event = await this.eventRepository.getPublicEvent(eventId);

    return event;
  }

  async getEvent(eventId: string, id: string, isOrganization: boolean) {
    if (isOrganization) {
      this.logger.log(`Fetching event with id ${eventId}`);

      const event = await this.eventRepository.getPublicEvent(eventId);

      return event;
    }

    const event = await this.eventRepository.getUserEvent(eventId, id);

    return event;
  }

  async registerEvent(positionId: string, id: string) {
    await this.eventRepository.registerEvent(positionId, id);

    this.logger.log(`User registered successfully`);
  }

  async unregisterEvent(positionId: string, id: string) {
    await this.eventRepository.unregisterEvent(positionId, id);

    this.logger.log(`User unregistered successfully`);
  }

  async uploadVerification(
    eventId: string,
    filePath: string,
  ): Promise<boolean> {
    const isUploaded = await this.eventRepository.saveVerification(
      eventId,
      filePath,
    );

    this.logger.log(`Verification uploaded successfully`);

    return isUploaded;
  }

  async uploadPhoto(eventId: string, fileName: string): Promise<boolean> {
    const isUploaded = await this.eventRepository.savePhoto(eventId, fileName);

    this.logger.log(`Photo uploaded successfully`);

    return isUploaded;
  }
}
