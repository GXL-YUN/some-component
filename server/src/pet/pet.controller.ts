import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PetService, CreatePetDto, UpdatePetDto } from './pet.service';

@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  async create(@Body() createPetDto: CreatePetDto) {
    return await this.petService.create(createPetDto);
  }

  @Get()
  async findByUser(@Query('user_id') userId: string) {
    if (!userId || userId === 'undefined') {
      throw new Error('user_id 参数缺失');
    }
    return await this.petService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.petService.findOne(id);
  }

  @Get(':id/records')
  async getRecords(@Param('id') id: string) {
    return await this.petService.getRecords(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return await this.petService.update(id, updatePetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.petService.remove(id);
  }

  @Post(':id/records')
  async addRecord(
    @Param('id') id: string,
    @Body() recordData: any,
  ) {
    return await this.petService.addRecord(id, recordData);
  }

  // ========== 宠物相册相关接口 ==========

  @Get(':id/photos')
  async getPhotos(@Param('id') id: string) {
    return await this.petService.getPhotos(id);
  }

  @Post(':id/photos')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description?: string,
  ) {
    return await this.petService.uploadPhoto(id, file, description);
  }

  @Delete(':id/photos/:photoId')
  async deletePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
  ) {
    return await this.petService.deletePhoto(id, photoId);
  }

  @Put(':id/photos/:photoId')
  async updatePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @Body() body: { description?: string; sort_order?: number },
  ) {
    return await this.petService.updatePhoto(id, photoId, body);
  }
}
