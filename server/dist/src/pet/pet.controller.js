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
exports.PetController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const pet_service_1 = require("./pet.service");
let PetController = class PetController {
    constructor(petService) {
        this.petService = petService;
    }
    async create(createPetDto) {
        return await this.petService.create(createPetDto);
    }
    async findByUser(userId) {
        if (!userId || userId === 'undefined') {
            throw new Error('user_id 参数缺失');
        }
        return await this.petService.findByUser(userId);
    }
    async findOne(id) {
        return await this.petService.findOne(id);
    }
    async getRecords(id) {
        return await this.petService.getRecords(id);
    }
    async update(id, updatePetDto) {
        return await this.petService.update(id, updatePetDto);
    }
    async remove(id) {
        return await this.petService.remove(id);
    }
    async addRecord(id, recordData) {
        return await this.petService.addRecord(id, recordData);
    }
    async getPhotos(id) {
        return await this.petService.getPhotos(id);
    }
    async uploadPhoto(id, file, description) {
        return await this.petService.uploadPhoto(id, file, description);
    }
    async deletePhoto(id, photoId) {
        return await this.petService.deletePhoto(id, photoId);
    }
    async updatePhoto(id, photoId, body) {
        return await this.petService.updatePhoto(id, photoId, body);
    }
};
exports.PetController = PetController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/records'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "getRecords", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/records'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "addRecord", null);
__decorate([
    (0, common_1.Get)(':id/photos'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "getPhotos", null);
__decorate([
    (0, common_1.Post)(':id/photos'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Delete)(':id/photos/:photoId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Put)(':id/photos/:photoId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('photoId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PetController.prototype, "updatePhoto", null);
exports.PetController = PetController = __decorate([
    (0, common_1.Controller)('pets'),
    __metadata("design:paramtypes", [pet_service_1.PetService])
], PetController);
//# sourceMappingURL=pet.controller.js.map