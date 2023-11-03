import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async saveVerification(userId: string, filePath: string) {
    try {
      this.logger.debug(`Saving verification for user with id ${userId}`);

      await this.databaseService.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });

      await this.databaseService.userVerification.create({
        data: {
          user: { connect: { id: userId } },
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
