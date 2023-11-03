import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrganizationRepository {
  private readonly logger = new Logger(OrganizationRepository.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async saveVerification(organizationId: string, filePath: string) {
    try {
      this.logger.debug(
        `Saving verification for organization with id ${organizationId}`,
      );

      await this.databaseService.organization.update({
        where: { id: organizationId },
        data: { isVerified: true },
      });

      await this.databaseService.organizationVerification.create({
        data: {
          organization: { connect: { id: organizationId } },
          verificationPaper: filePath,
        },
      });

      return true;
    } catch (error) {
      this.logger.error(`Error saving verification: ${error}`);
      throw new InternalServerErrorException('Error saving verification');
    }
  }
}
