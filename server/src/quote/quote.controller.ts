import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { QuoteService, CreateQuoteDto } from './quote.service';

@Controller('quotes')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto) {
    return await this.quoteService.create(createQuoteDto);
  }

  @Get()
  async findAll(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return await this.quoteService.findAll(limitNumber);
  }

  @Get('demand/:demandId')
  async findByDemand(
    @Param('demandId') demandId: string,
    @Query('sort_by') sortBy?: string,
  ) {
    return await this.quoteService.findByDemand(demandId, sortBy);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.quoteService.findOne(id);
  }

  @Post(':id/accept')
  async accept(@Param('id') id: string) {
    return await this.quoteService.accept(id);
  }
}
