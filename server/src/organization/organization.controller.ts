import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Prisma } from '@prisma/client';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@Body() createOrganizationDto: Prisma.OrganizationCreateInput) {
    return await this.organizationService.create(createOrganizationDto);
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
