import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';

export interface CreatePetDto {
  user_id: string;
  name: string;
  pet_type: string;
  breed: string;
  gender: string;
  birthday?: string;
  photo_url?: string;
  vaccine_records?: any;
  deworming_records?: any;
  description?: string;
}

export interface UpdatePetDto {
  name?: string;
  photo_url?: string;
  vaccine_records?: any;
  deworming_records?: any;
  description?: string;
}

// 初始化 S3 存储客户端
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: '',
  secretKey: '',
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

@Injectable()
export class PetService {
  async create(createPetDto: CreatePetDto) {
    const client = getSupabaseClient();
    
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

  async findByUser(userId: string) {
    const client = getSupabaseClient();
    
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

  async findOne(id: string) {
    const client = getSupabaseClient();
    
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

  async update(id: string, updatePetDto: UpdatePetDto) {
    const client = getSupabaseClient();
    
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

  async remove(id: string) {
    const client = getSupabaseClient();
    
    const { error } = await client
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`删除宠物档案失败: ${error.message}`);
    }

    return { message: '删除成功' };
  }

  async addRecord(petId: string, recordData: any) {
    const client = getSupabaseClient();
    
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

  async getRecords(petId: string) {
    const client = getSupabaseClient();
    
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

  // ========== 宠物相册相关方法 ==========

  async getPhotos(petId: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('pet_photos')
      .select('*')
      .eq('pet_id', petId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`获取宠物相册失败: ${error.message}`);
    }

    // 为每张照片生成签名 URL
    const photosWithUrl = await Promise.all(
      (data || []).map(async (photo) => {
        try {
          const signedUrl = await storage.generatePresignedUrl({
            key: photo.photo_key,
            expireTime: 86400, // 1 天有效期
          });
          return { ...photo, photo_url: signedUrl };
        } catch {
          return photo;
        }
      })
    );

    return photosWithUrl;
  }

  async uploadPhoto(petId: string, file: Express.Multer.File, description?: string) {
    const client = getSupabaseClient();

    if (!file) {
      throw new Error('请选择要上传的照片');
    }

    // 上传文件到对象存储
    const fileBuffer = file.buffer || Buffer.from([]);
    const fileName = `pets/${petId}/${Date.now()}_${file.originalname}`;
    
    const photoKey = await storage.uploadFile({
      fileContent: fileBuffer,
      fileName: fileName,
      contentType: file.mimetype || 'image/jpeg',
    });

    // 生成签名 URL
    const photoUrl = await storage.generatePresignedUrl({
      key: photoKey,
      expireTime: 86400,
    });

    // 保存到数据库
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
      // 删除已上传的文件
      await storage.deleteFile({ fileKey: photoKey });
      throw new Error(`上传照片失败: ${error.message}`);
    }

    return { ...data, photo_url: photoUrl };
  }

  async deletePhoto(petId: string, photoId: string) {
    const client = getSupabaseClient();

    // 先获取照片信息
    const { data: photo, error: fetchError } = await client
      .from('pet_photos')
      .select('*')
      .eq('id', photoId)
      .eq('pet_id', petId)
      .single();

    if (fetchError || !photo) {
      throw new Error('照片不存在或无权删除');
    }

    // 从对象存储删除
    try {
      await storage.deleteFile({ fileKey: photo.photo_key });
    } catch (err) {
      console.error('删除对象存储文件失败:', err);
      // 继续删除数据库记录
    }

    // 从数据库删除
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

  async updatePhoto(petId: string, photoId: string, body: { description?: string; sort_order?: number }) {
    const client = getSupabaseClient();
    
    const updateData: any = {};
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

    // 生成签名 URL
    if (data) {
      try {
        const signedUrl = await storage.generatePresignedUrl({
          key: data.photo_key,
          expireTime: 86400,
        });
        return { ...data, photo_url: signedUrl };
      } catch {
        return data;
      }
    }

    return data;
  }
}
