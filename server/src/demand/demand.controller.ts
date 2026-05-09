import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { DemandService, CreateDemandDto, UpdateDemandDto } from './demand.service';

@Controller('demands')
export class DemandController {
  constructor(private readonly demandService: DemandService) {}

  @Post()
  async create(@Body() createDemandDto: CreateDemandDto) {
    return await this.demandService.create(createDemandDto);
  }

  @Get()
  async findAll(
    @Query('user_id') userId?: string,
    @Query('status') status?: string,
  ) {
    // 检查 userId 是否有效（如果提供了但值为 undefined 字符串，则视为未提供）
    const validUserId = (userId && userId !== 'undefined') ? userId : undefined;
    return await this.demandService.findAll(validUserId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.demandService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDemandDto: UpdateDemandDto,
  ) {
    return await this.demandService.update(id, updateDemandDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.demandService.remove(id);
  }
}
