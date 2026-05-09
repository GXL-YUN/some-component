"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroomingController = void 0;
const common_1 = require("@nestjs/common");
const grooming_service_1 = require("./grooming.service");
let GroomingController = class GroomingController {
    constructor(groomingService) {
        this.groomingService = groomingService;
    }
    async getStoreByMerchant(merchantId) {
        const data = await this.groomingService.getStoreByMerchant(merchantId);
        return { data };
    }
    async createStore(dto) {
        return await this.groomingService.createStore(dto);
    }
    async updateStore(storeId, dto) {
        return await this.groomingService.updateStore(storeId, dto);
    }
    async updateStoreStatus(storeId, isOpen) {
        return await this.groomingService.updateStore(storeId, { is_open: isOpen });
    }
    async getStoreServices(storeId) {
        const data = await this.groomingService.getStoreServices(storeId);
        return { data };
    }
    async createService(dto) {
        return await this.groomingService.createService(dto);
    }
    async updateService(serviceId, dto) {
        return await this.groomingService.updateService(serviceId, dto);
    }
    async toggleServiceStatus(serviceId, isAvailable) {
        return await this.groomingService.toggleServiceStatus(serviceId, isAvailable);
    }
    async getAppointments(storeId, merchantId, status, date) {
        const data = await this.groomingService.getAppointments({
            storeId,
            merchantId,
            status,
            date,
        });
        return { data };
    }
    async confirmAppointment(id) {
        return await this.groomingService.confirmAppointment(id);
    }
    async startService(id) {
        return await this.groomingService.startService(id);
    }
    async completeService(id) {
        return await this.groomingService.completeService(id);
    }
    async cancelAppointment(id, reason) {
        return await this.groomingService.cancelAppointment(id, reason);
    }
    async verifyCode(verificationCode) {
        const data = await this.groomingService.verifyCode(verificationCode);
        return { data };
    }
    async getMembers(merchantId, sortBy) {
        if (!merchantId || merchantId === 'undefined') {
            throw new Error('merchant_id 参数缺失');
        }
        const data = await this.groomingService.getMembers(merchantId, sortBy);
        return { data };
    }
    async getRevenueStats(merchantId) {
        if (!merchantId || merchantId === 'undefined') {
            throw new Error('merchant_id 参数缺失');
        }
        const data = await this.groomingService.getRevenueStats(merchantId);
        return { data };
    }
    async getBalance(merchantId) {
        if (!merchantId || merchantId === 'undefined') {
            throw new Error('merchant_id 参数缺失');
        }
        const data = await this.groomingService.getBalance(merchantId);
        return { data };
    }
    async getBankAccounts(merchantId) {
        if (!merchantId || merchantId === 'undefined') {
            throw new Error('merchant_id 参数缺失');
        }
        const data = await this.groomingService.getBankAccounts(merchantId);
        return { data };
    }
    async addBankAccount(merchantId, dto) {
        if (!merchantId || merchantId === 'undefined') {
            throw new Error('merchant_id 参数缺失');
        }
        return await this.groomingService.addBankAccount(merchantId, dto);
    }
    async getWithdrawals(merchantId) {
        if (!merchantId || merchantId === 'undefined') {
            throw new Error('merchant_id 参数缺失');
        }
        const data = await this.groomingService.getWithdrawals(merchantId);
        return { data };
    }
    async createWithdrawal(merchantId, amount) {
        return await this.groomingService.createWithdrawal(merchantId, amount);
    }
};
exports.GroomingController = GroomingController;
__decorate([
    (0, common_1.Get)('stores/merchant/:merchantId'),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "getStoreByMerchant", null);
__decorate([
    (0, common_1.Post)('stores'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "createStore", null);
__decorate([
    (0, common_1.Put)('stores/:storeId'),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "updateStore", null);
__decorate([
    (0, common_1.Put)('stores/:storeId/status'),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Body)('is_open')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "updateStoreStatus", null);
__decorate([
    (0, common_1.Get)('stores/:storeId/services'),
    __param(0, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "getStoreServices", null);
__decorate([
    (0, common_1.Post)('services'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "createService", null);
__decorate([
    (0, common_1.Put)('services/:serviceId'),
    __param(0, (0, common_1.Param)('serviceId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "updateService", null);
__decorate([
    (0, common_1.Put)('services/:serviceId/status'),
    __param(0, (0, common_1.Param)('serviceId')),
    __param(1, (0, common_1.Body)('is_available')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "toggleServiceStatus", null);
__decorate([
    (0, common_1.Get)('appointments'),
    __param(0, (0, common_1.Query)('store_id')),
    __param(1, (0, common_1.Query)('merchant_id')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Post)('appointments/:id/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "confirmAppointment", null);
__decorate([
    (0, common_1.Post)('appointments/:id/start'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "startService", null);
__decorate([
    (0, common_1.Post)('appointments/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "completeService", null);
__decorate([
    (0, common_1.Post)('appointments/:id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)('verification_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Get)('members'),
    __param(0, (0, common_1.Query)('merchant_id')),
    __param(1, (0, common_1.Query)('sort_by')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Get)('revenue/stats'),
    __param(0, (0, common_1.Query)('merchant_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "getRevenueStats", null);
__decorate([
    (0, common_1.Get)('revenue/balance'),
    __param(0, (0, common_1.Query)('merchant_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "getBalance", null);
__decorate([
    (0, common_1.Get)('bank-accounts'),
    __param(0, (0, common_1.Query)('merchant_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "getBankAccounts", null);
__decorate([
    (0, common_1.Post)('bank-accounts'),
    __param(0, (0, common_1.Body)('merchant_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "addBankAccount", null);
__decorate([
    (0, common_1.Get)('withdrawals'),
    __param(0, (0, common_1.Query)('merchant_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "getWithdrawals", null);
__decorate([
    (0, common_1.Post)('withdrawals'),
    __param(0, (0, common_1.Body)('merchant_id')),
    __param(1, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], GroomingController.prototype, "createWithdrawal", null);
exports.GroomingController = GroomingController = __decorate([
    (0, common_1.Controller)('grooming'),
    __metadata("design:paramtypes", [grooming_service_1.GroomingService])
], GroomingController);
//# sourceMappingURL=grooming.controller.js.map