import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { DemandModule } from './demand/demand.module';
import { QuoteModule } from './quote/quote.module';
import { StoreModule } from './store/store.module';
import { AppointmentModule } from './appointment/appointment.module';
import { OrderModule } from './order/order.module';
import { PetModule } from './pet/pet.module';
import { AddressModule } from './address/address.module';
import { MerchantModule } from './merchant/merchant.module';
import { GroomingModule } from './grooming/grooming.module';

@Module({
  imports: [
    DemandModule,
    QuoteModule,
    StoreModule,
    AppointmentModule,
    OrderModule,
    PetModule,
    AddressModule,
    MerchantModule,
    GroomingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
