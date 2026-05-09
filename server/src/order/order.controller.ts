import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrderService, CreateOrderDto } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get()
  async findByUser(
    @Query('user_id') userId: string,
    @Query('status') status?: string,
    @Query('order_type') orderType?: string,
  ) {
    if (!userId || userId === 'undefined') {
      throw new Error('user_id 参数缺失');
    }
    return await this.orderService.findByUser(userId, status, orderType);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  @Post(':id/confirm')
  async confirmReceipt(@Param('id') id: string) {
    return await this.orderService.confirmReceipt(id);
  }
}
