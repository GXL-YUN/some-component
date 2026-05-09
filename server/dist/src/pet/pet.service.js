"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../storage/database/supabase-client");
const coze_coding_dev_sdk_1 = require("coze-coding-dev-sdk");
const storage = new coze_coding_dev_sdk_1.S3Storage({
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    accessKey: '',
    secretKey: '',
    bucketName: process.env.COZE_BUCKET_NAME,
    region: 'cn-beijing',
});
let PetService = class PetService {
    async create(createPetDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('pets')
            .insert(createPetDto)
            .select()
            .single();
        if (error) {
            throw new Error(`创建宠物档案失败: ${error.message}`);
        }
        return data;
    }
    async findByUser(userId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('pets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`查询宠物档案列表失败: ${error.message}`);
        }
        return data;
    }
    async findOne(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('pets')
            .select(`
        *,
        pet_records (
          id,
          record_type,
          record_date,
          value,
          unit,
          description,
          photos
        )
      `)
            .eq('id', id)
            .maybeSingle();
        if (error) {
            throw new Error(`查询宠物档案详情失败: ${error.message}`);
        }
        return data;
    }
    async update(id, updatePetDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('pets')
            .update(updatePetDto)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(`更新宠物档案失败: ${error.message}`);
        }
        return data;
    }
    async remove(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { error } = await client
            .from('pets')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(`删除宠物档案失败: ${error.message}`);
        }
        return { message: '删除成功' };
    }
    async addRecord(petId, recordData) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('pet_records')
            .insert({
            pet_id: petId,
            ...recordData,
        })
            .select()
            .single();
        if (error) {
            throw new Error(`添加成长记录失败: ${error.message}`);
        }
        return data;
    }
    async getRecords(petId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('pet_records')
            .select('*')
            .eq('pet_id', petId)
            .order('record_date', { ascending: false });
        if (error) {
            throw new Error(`获取成长记录失败: ${error.message}`);
        }
        return data || [];
    }
    async getPhotos(petId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('pet_photos')
            .select('*')
            .eq('pet_id', petId)
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`获取宠物相册失败: ${error.message}`);
        }
        const photosWithUrl = await Promise.all((data || []).map(async (photo) => {
            try {
                const signedUrl = await storage.generatePresignedUrl({
                    key: photo.photo_key,
                    expireTime: 86400,
                });
                return { ...photo, photo_url: signedUrl };
            }
            catch {
                return photo;
            }
        }));
        return photosWithUrl;
    }
    async uploadPhoto(petId, file, description) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        if (!file) {
            throw new Error('请选择要上传的照片');
        }
        const fileBuffer = file.buffer || Buffer.from([]);
        const fileName = `pets/${petId}/${Date.now()}_${file.originalname}`;
        const photoKey = await storage.uploadFile({
            fileContent: fileBuffer,
            fileName: fileName,
            contentType: file.mimetype || 'image/jpeg',
        });
        const photoUrl = await storage.generatePresignedUrl({
            key: photoKey,
            expireTime: 86400,
        });
        const { data, error } = await client
            .from('pet_photos')
            .insert({
            pet_id: petId,
            photo_key: photoKey,
            photo_url: photoUrl,
            description: description || null,
        })
            .select()
            .single();
        if (error) {
            await storage.deleteFile({ fileKey: photoKey });
            throw new Error(`上传照片失败: ${error.message}`);
        }
        return { ...data, photo_url: photoUrl };
    }
    async deletePhoto(petId, photoId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: photo, error: fetchError } = await client
            .from('pet_photos')
            .select('*')
            .eq('id', photoId)
            .eq('pet_id', petId)
            .single();
        if (fetchError || !photo) {
            throw new Error('照片不存在或无权删除');
        }
        try {
            await storage.deleteFile({ fileKey: photo.photo_key });
        }
        catch (err) {
            console.error('删除对象存储文件失败:', err);
        }
        const { error } = await client
            .from('pet_photos')
            .delete()
            .eq('id', photoId)
            .eq('pet_id', petId);
        if (error) {
            throw new Error(`删除照片失败: ${error.message}`);
        }
        return { message: '删除成功' };
    }
    async updatePhoto(petId, photoId, body) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const updateData = {};
        if (body.description !== undefined) {
            updateData.description = body.description;
        }
        if (body.sort_order !== undefined) {
            updateData.sort_order = body.sort_order;
        }
        const { data, error } = await client
            .from('pet_photos')
            .update(updateData)
            .eq('id', photoId)
            .eq('pet_id', petId)
            .select()
            .single();
        if (error) {
            throw new Error(`更新照片信息失败: ${error.message}`);
        }
        if (data) {
            try {
                const signedUrl = await storage.generatePresignedUrl({
                    key: data.photo_key,
                    expireTime: 86400,
                });
                return { ...data, photo_url: signedUrl };
            }
            catch {
                return data;
            }
        }
        return data;
    }
};
exports.PetService = PetService;
exports.PetService = PetService = __decorate([
    (0, common_1.Injectable)()
], PetService);
//# sourceMappingURL=pet.service.js.map