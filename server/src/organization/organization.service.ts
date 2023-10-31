import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createOrganizationDto: Prisma.OrganizationCreateInput) {
    this.logger.log(
      `Creating organization with name: ${createOrganizationDto.name}`,
    );

    try {
      const organization = await this.databaseService.organization.create({
        data: createOrganizationDto,
      });

      this.logger.verbose(organization);

      return organization;
    } catch (error) {
      this.logger.error(
        `Failed to create organization: ${createOrganizationDto.name}`,
      );
    }
  }

  findAll() {
    return `This action returns all organization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(id: number) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
