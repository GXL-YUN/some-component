import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AppointmentService, CreateAppointmentDto } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  async findByUser(
    @Query('user_id') userId: string,
    @Query('status') status?: string,
  ) {
    if (!userId || userId === 'undefined') {
      throw new Error('user_id 参数缺失');
    }
    return await this.appointmentService.findByUser(userId, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.appointmentService.findOne(id);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    return await this.appointmentService.cancel(id);
  }
}
