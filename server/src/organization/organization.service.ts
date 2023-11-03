import { Injectable, Logger } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async uploadVerification(
    organizationId: string,
    filePath: string,
  ): Promise<boolean> {
    const isUploaded = await this.organizationRepository.saveVerification(
      organizationId,
      filePath,
    );

    this.logger.log(`Verification uploaded successfully`);

    return isUploaded;
  }
}
