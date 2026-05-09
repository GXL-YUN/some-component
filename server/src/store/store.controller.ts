import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findAll(@Query('sort_by') sortBy?: string) {
    return await this.storeService.findAll(sortBy);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.storeService.findOne(id);
  }
}
