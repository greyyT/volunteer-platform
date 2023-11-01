import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Req() req: Request) {
    console.log(req);
  }

  @Get()
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationService.remove(+id);
  }
}
