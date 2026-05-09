import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

export interface CreateAddressDto {
  user_id: string;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  city: string;
  district: string;
  detail_address: string;
  is_default?: boolean;
}

export interface UpdateAddressDto {
  receiver_name?: string;
  receiver_phone?: string;
  province?: string;
  city?: string;
  district?: string;
  detail_address?: string;
  is_default?: boolean;
}

@Injectable()
export class AddressService {
  async create(createAddressDto: CreateAddressDto) {
    const client = getSupabaseClient();
    
    try {
      // 如果设置为默认，先取消其他默认地址
      if (createAddressDto.is_default) {
        await client
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', createAddressDto.user_id);
      }

      const { data, error } = await client
        .from('addresses')
        .insert({
          user_id: createAddressDto.user_id,
          receiver_name: createAddressDto.receiver_name,
          receiver_phone: createAddressDto.receiver_phone,
          province: createAddressDto.province,
          city: createAddressDto.city,
          district: createAddressDto.district,
          detail_address: createAddressDto.detail_address,
          is_default: createAddressDto.is_default || false,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`创建地址失败: ${error.message}`);
      }

      return {
        code: 200,
        msg: '创建成功',
        data: data,
      };
    } catch (error) {
      console.error('创建地址失败:', error);
      throw error;
    }
  }

  async findByUser(userId: string) {
    const client = getSupabaseClient();
    
    try {
      const { data, error } = await client
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) {
        throw new Error(`查询地址失败: ${error.message}`);
      }

      return {
        code: 200,
        data: data,
      };
    } catch (error) {
      console.error('查询地址失败:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    const client = getSupabaseClient();
    
    try {
      const { data, error } = await client
        .from('addresses')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw new Error(`查询地址失败: ${error.message}`);
      }

      return {
        code: 200,
        data: data,
      };
    } catch (error) {
      console.error('查询地址失败:', error);
      throw error;
    }
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const client = getSupabaseClient();
    
    try {
      // 如果设置为默认，先取消其他默认地址
      if (updateAddressDto.is_default) {
        const { data: address } = await client
          .from('addresses')
          .select('user_id')
          .eq('id', id)
          .single();
        
        if (address) {
          await client
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', address.user_id);
        }
      }

      const { data, error } = await client
        .from('addresses')
        .update({
          ...updateAddressDto,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`更新地址失败: ${error.message}`);
      }

      return {
        code: 200,
        msg: '更新成功',
        data: data,
      };
    } catch (error) {
      console.error('更新地址失败:', error);
      throw error;
    }
  }

  async remove(id: string) {
    const client = getSupabaseClient();
    
    try {
      const { error } = await client
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`删除地址失败: ${error.message}`);
      }

      return {
        code: 200,
        msg: '删除成功',
      };
    } catch (error) {
      console.error('删除地址失败:', error);
      throw error;
    }
  }

  async setDefault(id: string) {
    const client = getSupabaseClient();
    
    try {
      // 获取地址信息
      const { data: address, error: findError } = await client
        .from('addresses')
        .select('*')
        .eq('id', id)
        .single();

      if (findError || !address) {
        return {
          code: 404,
          msg: '地址不存在',
        };
      }

      // 取消其他默认地址
      await client
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', address.user_id);

      // 设置当前地址为默认
      const { data, error } = await client
        .from('addresses')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`设置默认地址失败: ${error.message}`);
      }

      return {
        code: 200,
        msg: '设置成功',
        data: data,
      };
    } catch (error) {
      console.error('设置默认地址失败:', error);
      throw error;
    }
  }
}
