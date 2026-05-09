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
exports.MerchantController = void 0;
const common_1 = require("@nestjs/common");
const merchant_service_1 = require("./merchant.service");
let MerchantController = class MerchantController {
    constructor(merchantService) {
        this.merchantService = merchantService;
    }
    async createOrGetMerchant(dto) {
        return await this.merchantService.createOrGetMerchant(dto);
    }
    async getMerchant(id) {
        return await this.merchantService.getMerchantById(id);
    }
    async submitCertification(id, dto) {
        return await this.merchantService.submitCertification(id, dto);
    }
    async getDemandGallery(id, sortBy, petType, budgetMin, budgetMax, province, page, pageSize) {
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
    async createQuote(id, dto) {
        return await this.merchantService.createQuote(id, dto);
    }
    async getQuotes(id, status) {
        return await this.merchantService.getMerchantQuotes(id, status);
    }
    async getOrders(id, status) {
        return await this.merchantService.getMerchantOrders(id, status);
    }
    async getOrderDetail(id, orderId) {
        return await this.merchantService.getOrderDetail(orderId, id);
    }
    async updateOrderStatus(orderId, merchantId, dto) {
        return await this.merchantService.updateOrderStatus(orderId, merchantId, dto);
    }
    async uploadQuarantineCertificate(orderId, merchantId, dto) {
        return await this.merchantService.uploadQuarantineCertificate(orderId, merchantId, dto);
    }
    async getStats(id) {
        return await this.merchantService.getMerchantStats(id);
    }
    async getTodos(id) {
        return await this.merchantService.getMerchantTodos(id);
    }
    async dismissTodo(todoId, merchantId) {
        return await this.merchantService.dismissTodo(merchantId, todoId);
    }
};
exports.MerchantController = MerchantController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "createOrGetMerchant", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getMerchant", null);
__decorate([
    (0, common_1.Post)(':id/certification'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "submitCertification", null);
__decorate([
    (0, common_1.Get)(':id/demands'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('sort_by')),
    __param(2, (0, common_1.Query)('pet_type')),
    __param(3, (0, common_1.Query)('budget_min')),
    __param(4, (0, common_1.Query)('budget_max')),
    __param(5, (0, common_1.Query)('province')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('page_size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getDemandGallery", null);
__decorate([
    (0, common_1.Post)(':id/quotes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "createQuote", null);
__decorate([
    (0, common_1.Get)(':id/quotes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getQuotes", null);
__decorate([
    (0, common_1.Get)(':id/orders'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)(':id/orders/:orderId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getOrderDetail", null);
__decorate([
    (0, common_1.Post)('orders/:orderId/status'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('merchant_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Post)('orders/:orderId/quarantine'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)('merchant_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "uploadQuarantineCertificate", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id/todos'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "getTodos", null);
__decorate([
    (0, common_1.Post)('todos/:todoId/dismiss'),
    __param(0, (0, common_1.Param)('todoId')),
    __param(1, (0, common_1.Body)('merchant_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MerchantController.prototype, "dismissTodo", null);
exports.MerchantController = MerchantController = __decorate([
    (0, common_1.Controller)('merchants'),
    __metadata("design:paramtypes", [merchant_service_1.MerchantService])
], MerchantController);
//# sourceMappingURL=merchant.controller.js.map