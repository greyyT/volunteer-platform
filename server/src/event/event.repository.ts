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
import { saveMultipleBase64 } from 'src/utils/base64';

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
  ): Promise<boolean> {
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

      const {
        verifications,
        contacts,
        photos,
        positions,
        ...createEventFields
      } = createEventDto;

      this.logger.debug(`Creating event ${createEventDto.name}`);

      await this.databaseService.event.create({
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

      if (verifications && verifications.length > 0) {
        this.logger.debug(`Saving verifications for ${createEventDto.name}`);

        saveMultipleBase64(
          verifications,
          slug,
          eventId,
          'events-verifications',
          false,
        );

        const verificationsToCreate = verifications.map((_, idx: number) => ({
          verificationPaper: `events-verifications/${slug}-${idx}-${eventId}.png`,
          eventId: eventId,
        }));

        this.logger.debug(
          `Saving verifications for ${createEventDto.name} in database`,
        );

        await this.databaseService.eventVerification.createMany({
          data: verificationsToCreate,
        });
      }

      if (contacts.length !== 0) {
        const contactsToCreate = contacts.map((contact) => ({
          ...contact,
          eventId,
        }));

        this.logger.debug(`Saving contacts for ${createEventDto.name}`);
        await this.databaseService.eventContact.createMany({
          data: contactsToCreate,
        });
      }

      if (photos && photos.length > 0) {
        this.logger.debug(`Saving photos for ${createEventDto.name}`);
        saveMultipleBase64(photos, slug, eventId, 'event-photos', true);

        const photosToCreate = photos.map((_, idx: number) => ({
          photo: `http://localhost:3000/event-photos/${slug}-${idx}-${eventId}.png`,
          eventId,
        }));

        this.logger.debug(
          `Saving photos for ${createEventDto.name} in database`,
        );
        await this.databaseService.eventPhoto.createMany({
          data: photosToCreate,
        });
      }

      if (positions.length !== 0) {
        const positionsToCreate = positions.map((position) => ({
          ...position,
          eventId: eventId,
        }));

        this.logger.debug(`Saving positions for ${createEventDto.name}`);
        await this.databaseService.eventPosition.createMany({
          data: positionsToCreate,
        });
      }

      return true;
    } catch (error) {
      this.logger.error(`Error creating event: ${error}`);
      throw new InternalServerErrorException('Error creating event');
    }
  }
}
