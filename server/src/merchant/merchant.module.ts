import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantQuoteController } from './merchant-quote.controller';
import { MerchantService } from './merchant.service';

@Module({
  controllers: [MerchantController, MerchantQuoteController],
  providers: [MerchantService],
  exports: [MerchantService],
})
export class MerchantModule {}
