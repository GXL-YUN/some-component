import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { MerchantService } from './merchant.service';

@Controller('merchant-quotes')
export class MerchantQuoteController {
  constructor(private readonly merchantService: MerchantService) {}

  // 创建商家报价
  @Post()
  async createQuote(@Body() dto: {
    demand_id: string;
    merchant_id: string;
    price: number;
    pet_name: string;
    pet_gender: string;
    pet_age_months: number;
    pet_color?: string;
    vaccine_status?: string;
    deworming_status?: string;
    health_guarantee_days?: number;
    description?: string;
    contact_name: string;
    contact_phone: string;
    photos?: string[];
  }) {
    return await this.merchantService.createMerchantQuote(dto);
  }

  // 获取报价详情
  @Get(':id')
  async getQuoteDetail(@Param('id') id: string) {
    return await this.merchantService.getQuoteById(id);
  }

  // 撤销报价
  @Delete(':id')
  async cancelQuote(@Param('id') id: string) {
    return await this.merchantService.cancelQuote(id);
  }
}
