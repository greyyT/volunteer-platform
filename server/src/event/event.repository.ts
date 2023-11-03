import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { CreateEventDto } from './dto/event.dto';
import { createSlug } from 'src/utils/slug';

@Injectable()
export class EventRepository {
  private readonly logger = new Logger(EventRepository.name);

  constructor(
    configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,
    organizationId: string,
    eventId: string,
  ) {
    this.logger.debug(`Fetching organization with id ${organizationId}`);

    const organization = await this.databaseService.organization.findFirst({
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      throw new BadRequestException(
        `Organization with id ${organizationId} does not exist`,
      );
    }

    try {
      this.logger.debug(`Creating slug for ${createEventDto.name}`);
      const slug = createSlug(createEventDto.name);

      this.logger.log(
        `Created slug for ${createEventDto.name}: ${slug}-i.${eventId}`,
      );

      const { contacts, positions, ...createEventFields } = createEventDto;

      this.logger.debug(`Creating event ${createEventDto.name}`);

      const event = await this.databaseService.event.create({
        data: {
          id: eventId,
          ...createEventFields,
          slug: slug + '-i.' + eventId,
          organization: {
            connect: {
              id: organizationId,
            },
          },
        },
      });

      const contactsToCreate = contacts.map((contact) => ({
        ...contact,
        eventId,
      }));

      this.logger.debug(`Saving contacts for ${createEventDto.name}`);
      await this.databaseService.eventContact.createMany({
        data: contactsToCreate,
      });

      const positionsToCreate = positions.map((position) => ({
        ...position,
        eventId: eventId,
      }));

      this.logger.debug(`Saving positions for ${createEventDto.name}`);
      await this.databaseService.eventPosition.createMany({
        data: positionsToCreate,
      });

      return event;
    } catch (error) {
      this.logger.error(`Error creating event: ${error}`);
      throw new InternalServerErrorException('Error creating event');
    }
  }

  async listPublicEvents() {
    this.logger.debug(`Fetching public events`);

    const events = await this.databaseService.event.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        platform: true,
        startDate: true,
        endDate: true,
        registrationEndDate: true,
        location: true,
        organization: {
          select: {
            name: true,
            email: true,
            portrait: true,
          },
        },
        photos: {
          select: {
            photo: true,
          },
        },
        positions: {
          select: {
            name: true,
            maxParticipants: true,
            _count: {
              select: {
                participants: true,
              },
            },
          },
        },
      },
    });

    return events;
  }

  async listUserEvents(id: string) {
    this.logger.debug(`Fetching events for ${id}`);

    const events = await this.databaseService.event.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        platform: true,
        startDate: true,
        endDate: true,
        registrationEndDate: true,
        location: true,
        organization: {
          select: {
            name: true,
            email: true,
            portrait: true,
          },
        },
        photos: {
          select: {
            photo: true,
          },
        },
        positions: {
          select: {
            name: true,
            maxParticipants: true,
            _count: {
              select: {
                participants: true,
              },
            },
            participants: {
              select: {
                id: true,
              },
              where: {
                userId: id,
              },
            },
          },
        },
      },
    });

    return events.map((event) => ({
      ...event,
      isUserParticipant: event.positions.some(
        (position) => position.participants.length > 0,
      ),
    }));
  }

  async getPublicEvent(eventId: string) {
    this.logger.debug(`Fetching event with id ${eventId}`);

    const event = await this.databaseService.event.findFirst({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        details: true,
        slug: true,
        platform: true,
        startDate: true,
        endDate: true,
        registrationEndDate: true,
        location: true,
        organization: {
          select: {
            username: true,
            name: true,
            email: true,
            portrait: true,
          },
        },
        photos: {
          select: {
            photo: true,
          },
        },
        positions: {
          select: {
            id: true,
            name: true,
            maxParticipants: true,
            _count: {
              select: {
                participants: true,
              },
            },
          },
        },
        contacts: {
          select: {
            method: true,
            value: true,
          },
        },
      },
    });

    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }

    return event;
  }

  async getUserEvent(eventId: string, userId: string) {
    this.logger.debug(`Fetching event with id ${eventId}`);

    const event = await this.databaseService.event.findFirst({
      where: {
        id: eventId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        details: true,
        slug: true,
        platform: true,
        startDate: true,
        endDate: true,
        registrationEndDate: true,
        location: true,
        organization: {
          select: {
            username: true,
            name: true,
            email: true,
            portrait: true,
          },
        },
        photos: {
          select: {
            photo: true,
          },
        },
        positions: {
          select: {
            id: true,
            name: true,
            maxParticipants: true,
            _count: {
              select: {
                participants: true,
              },
            },
            participants: {
              select: {
                id: true,
              },
              where: {
                userId,
              },
            },
          },
        },
        contacts: {
          select: {
            method: true,
            value: true,
          },
        },
      },
    });

    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }

    return {
      ...event,
      isUserParticipant: event.positions.some(
        (position) => position.participants.length > 0,
      ),
    };
  }

  async saveVerification(eventId: string, filePath: string) {
    this.logger.debug(`Fetching event with id ${eventId}`);

    const event = await this.databaseService.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }

    try {
      this.logger.debug(`Saving verification for ${event.name}`);

      await this.databaseService.eventVerification.create({
        data: {
          verificationPaper: filePath,
          eventId,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(`Error saving verification: ${error}`);
      throw new InternalServerErrorException('Error saving verification');
    }
  }

  async registerEvent(positionId: string, id: string) {
    this.logger.debug(`Fetching position with id ${positionId}`);

    const position = await this.databaseService.eventPosition.findFirst({
      where: {
        id: positionId,
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!position) {
      throw new BadRequestException(
        `Position with id ${positionId} does not exist`,
      );
    }

    if (position._count.participants >= position.maxParticipants) {
      throw new BadRequestException(`Position with id ${positionId} is full`);
    }

    try {
      this.logger.debug(`Registering user with id ${id}`);

      await this.databaseService.userEventPosition.create({
        data: {
          positionId,
          userId: id,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(`Error registering user: ${error}`);
      throw new InternalServerErrorException('Error registering user');
    }
  }

  async unregisterEvent(positionId: string, id: string) {
    this.logger.debug(`Fetching position with id ${positionId}`);

    const position = await this.databaseService.eventPosition.findFirst({
      where: {
        id: positionId,
      },
    });

    if (!position) {
      throw new BadRequestException(
        `Position with id ${positionId} does not exist`,
      );
    }

    try {
      this.logger.debug(`Unregistering user with id ${id}`);

      await this.databaseService.userEventPosition.deleteMany({
        where: {
          positionId,
          userId: id,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(`Error unregistering user: ${error}`);
      throw new InternalServerErrorException('Error unregistering user');
    }
  }

  async savePhoto(eventId: string, fileName: string) {
    this.logger.debug(`Fetching event with id ${eventId}`);

    const event = await this.databaseService.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }

    try {
      this.logger.debug(`Saving photo for ${event.name}`);

      await this.databaseService.eventPhoto.create({
        data: {
          photo: `http://localhost:3000/event-photos/${fileName}`,
          eventId,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(`Error saving photo: ${error}`);
      throw new InternalServerErrorException('Error saving photo');
    }
  }
}
