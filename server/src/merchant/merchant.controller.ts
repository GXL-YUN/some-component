import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MerchantService, CreateMerchantDto, CertificationDto } from './merchant.service';

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  // 创建或获取商家
  @Post()
  async createOrGetMerchant(@Body() dto: CreateMerchantDto) {
    return await this.merchantService.createOrGetMerchant(dto);
  }

  // 获取商家信息
  @Get(':id')
  async getMerchant(@Param('id') id: string) {
    return await this.merchantService.getMerchantById(id);
  }

  // 提交认证
  @Post(':id/certification')
  async submitCertification(
    @Param('id') id: string,
    @Body() dto: CertificationDto,
  ) {
    return await this.merchantService.submitCertification(id, dto);
  }

  // 获取需求广场
  @Get(':id/demands')
  async getDemandGallery(
    @Param('id') id: string,
    @Query('sort_by') sortBy?: 'time' | 'distance' | 'budget',
    @Query('pet_type') petType?: string,
    @Query('budget_min') budgetMin?: string,
    @Query('budget_max') budgetMax?: string,
    @Query('province') province?: string,
    @Query('page') page?: string,
    @Query('page_size') pageSize?: string,
  ) {
    return await this.merchantService.getDemandGallery({
      merchantId: id,
      sortBy,
      petType,
      budgetMin: budgetMin ? Number(budgetMin) : undefined,
      budgetMax: budgetMax ? Number(budgetMax) : undefined,
      province,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 20,
    });
  }

  // 创建报价
  @Post(':id/quotes')
  async createQuote(
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return await this.merchantService.createQuote(id, dto);
  }

  // 获取商家报价列表
  @Get(':id/quotes')
  async getQuotes(
    @Param('id') id: string,
    @Query('status') status?: string,
  ) {
    return await this.merchantService.getMerchantQuotes(id, status);
  }

  // 获取商家订单列表
  @Get(':id/orders')
  async getOrders(
    @Param('id') id: string,
    @Query('status') status?: string,
  ) {
    return await this.merchantService.getMerchantOrders(id, status);
  }

  // 获取单个订单详情
  @Get(':id/orders/:orderId')
  async getOrderDetail(
    @Param('id') id: string,
    @Param('orderId') orderId: string,
  ) {
    return await this.merchantService.getOrderDetail(orderId, id);
  }

  // 更新订单状态
  @Post('orders/:orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('merchant_id') merchantId: string,
    @Body() dto: any,
  ) {
    return await this.merchantService.updateOrderStatus(orderId, merchantId, dto);
  }

  // 上传检疫证明
  @Post('orders/:orderId/quarantine')
  async uploadQuarantineCertificate(
    @Param('orderId') orderId: string,
    @Body('merchant_id') merchantId: string,
    @Body() dto: any,
  ) {
    return await this.merchantService.uploadQuarantineCertificate(orderId, merchantId, dto);
  }

  // 获取商家统计数据
  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return await this.merchantService.getMerchantStats(id);
  }

  // 获取商家待办事项
  @Get(':id/todos')
  async getTodos(@Param('id') id: string) {
    return await this.merchantService.getMerchantTodos(id);
  }

  // 忽略待办事项
  @Post('todos/:todoId/dismiss')
  async dismissTodo(
    @Param('todoId') todoId: string,
    @Body('merchant_id') merchantId: string,
  ) {
    return await this.merchantService.dismissTodo(merchantId, todoId);
  }
}
