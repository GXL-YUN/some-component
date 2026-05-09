import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AddressService, CreateAddressDto, UpdateAddressDto } from './address.service';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto);
  }

  @Get()
  async findByUser(@Query('user_id') userId: string) {
    if (!userId || userId === 'undefined') {
      throw new Error('user_id 参数缺失');
    }
    return await this.addressService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.addressService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return await this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.addressService.remove(id);
  }

  @Post(':id/default')
  async setDefault(@Param('id') id: string) {
    return await this.addressService.setDefault(id);
  }
}
