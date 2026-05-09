"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const demand_module_1 = require("./demand/demand.module");
const quote_module_1 = require("./quote/quote.module");
const store_module_1 = require("./store/store.module");
const appointment_module_1 = require("./appointment/appointment.module");
const order_module_1 = require("./order/order.module");
const pet_module_1 = require("./pet/pet.module");
const address_module_1 = require("./address/address.module");
const merchant_module_1 = require("./merchant/merchant.module");
const grooming_module_1 = require("./grooming/grooming.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            demand_module_1.DemandModule,
            quote_module_1.QuoteModule,
            store_module_1.StoreModule,
            appointment_module_1.AppointmentModule,
            order_module_1.OrderModule,
            pet_module_1.PetModule,
            address_module_1.AddressModule,
            merchant_module_1.MerchantModule,
            grooming_module_1.GroomingModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map