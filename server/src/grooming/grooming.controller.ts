import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { GroomingService } from './grooming.service';

@Controller('grooming')
export class GroomingController {
  constructor(private readonly groomingService: GroomingService) {}

  // ===== 门店管理 =====

  @Get('stores/merchant/:merchantId')
  async getStoreByMerchant(@Param('merchantId') merchantId: string) {
    const data = await this.groomingService.getStoreByMerchant(merchantId);
    return { data };
  }

  @Post('stores')
  async createStore(@Body() dto: any) {
    return await this.groomingService.createStore(dto);
  }

  @Put('stores/:storeId')
  async updateStore(
    @Param('storeId') storeId: string,
    @Body() dto: any,
  ) {
    return await this.groomingService.updateStore(storeId, dto);
  }

  @Put('stores/:storeId/status')
  async updateStoreStatus(
    @Param('storeId') storeId: string,
    @Body('is_open') isOpen: boolean,
  ) {
    return await this.groomingService.updateStore(storeId, { is_open: isOpen });
  }

  // ===== 服务管理 =====

  @Get('stores/:storeId/services')
  async getStoreServices(@Param('storeId') storeId: string) {
    const data = await this.groomingService.getStoreServices(storeId);
    return { data };
  }

  @Post('services')
  async createService(@Body() dto: any) {
    return await this.groomingService.createService(dto);
  }

  @Put('services/:serviceId')
  async updateService(
    @Param('serviceId') serviceId: string,
    @Body() dto: any,
  ) {
    return await this.groomingService.updateService(serviceId, dto);
  }

  @Put('services/:serviceId/status')
  async toggleServiceStatus(
    @Param('serviceId') serviceId: string,
    @Body('is_available') isAvailable: boolean,
  ) {
    return await this.groomingService.toggleServiceStatus(serviceId, isAvailable);
  }

  // ===== 预约管理 =====

  @Get('appointments')
  async getAppointments(
    @Query('store_id') storeId?: string,
    @Query('merchant_id') merchantId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    const data = await this.groomingService.getAppointments({
      storeId,
      merchantId,
      status,
      date,
    });
    return { data };
  }

  @Post('appointments/:id/confirm')
  async confirmAppointment(@Param('id') id: string) {
    return await this.groomingService.confirmAppointment(id);
  }

  @Post('appointments/:id/start')
  async startService(@Param('id') id: string) {
    return await this.groomingService.startService(id);
  }

  @Post('appointments/:id/complete')
  async completeService(@Param('id') id: string) {
    return await this.groomingService.completeService(id);
  }

  @Post('appointments/:id/cancel')
  async cancelAppointment(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return await this.groomingService.cancelAppointment(id, reason);
  }

  // ===== 核销管理 =====

  @Post('verify')
  async verifyCode(@Body('verification_code') verificationCode: string) {
    const data = await this.groomingService.verifyCode(verificationCode);
    return { data };
  }

  // ===== 会员管理 =====

  @Get('members')
  async getMembers(
    @Query('merchant_id') merchantId: string,
    @Query('sort_by') sortBy?: 'frequency' | 'amount',
  ) {
    if (!merchantId || merchantId === 'undefined') {
      throw new Error('merchant_id 参数缺失');
    }
    const data = await this.groomingService.getMembers(merchantId, sortBy);
    return { data };
  }

  // ===== 营收统计 =====

  @Get('revenue/stats')
  async getRevenueStats(@Query('merchant_id') merchantId: string) {
    if (!merchantId || merchantId === 'undefined') {
      throw new Error('merchant_id 参数缺失');
    }
    const data = await this.groomingService.getRevenueStats(merchantId);
    return { data };
  }

  @Get('revenue/balance')
  async getBalance(@Query('merchant_id') merchantId: string) {
    if (!merchantId || merchantId === 'undefined') {
      throw new Error('merchant_id 参数缺失');
    }
    const data = await this.groomingService.getBalance(merchantId);
    return { data };
  }

  @Get('bank-accounts')
  async getBankAccounts(@Query('merchant_id') merchantId: string) {
    if (!merchantId || merchantId === 'undefined') {
      throw new Error('merchant_id 参数缺失');
    }
    const data = await this.groomingService.getBankAccounts(merchantId);
    return { data };
  }

  @Post('bank-accounts')
  async addBankAccount(
    @Body('merchant_id') merchantId: string,
    @Body() dto: any,
  ) {
    if (!merchantId || merchantId === 'undefined') {
      throw new Error('merchant_id 参数缺失');
    }
    return await this.groomingService.addBankAccount(merchantId, dto);
  }

  @Get('withdrawals')
  async getWithdrawals(@Query('merchant_id') merchantId: string) {
    if (!merchantId || merchantId === 'undefined') {
      throw new Error('merchant_id 参数缺失');
    }
    const data = await this.groomingService.getWithdrawals(merchantId);
    return { data };
  }

  @Post('withdrawals')
  async createWithdrawal(
    @Body('merchant_id') merchantId: string,
    @Body('amount') amount: number,
  ) {
    return await this.groomingService.createWithdrawal(merchantId, amount);
  }
}
