import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

export interface CreateDemandDto {
  user_id: string;
  pet_type: string;
  breed: string;
  gender?: string;
  color?: string;
  age_min?: number;
  age_max?: number;
  vaccine_required?: boolean;
  budget_min?: number;
  budget_max?: number;
  address_id?: string;
  description?: string;
}

export interface UpdateDemandDto {
  pet_type?: string;
  breed?: string;
  gender?: string;
  color?: string;
  age_min?: number;
  age_max?: number;
  vaccine_required?: boolean;
  budget_min?: number;
  budget_max?: number;
  address_id?: string;
  description?: string;
  status?: string;
}

@Injectable()
export class DemandService {
  async create(createDemandDto: CreateDemandDto) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('demands')
      .insert({
        ...createDemandDto,
        status: 'pending',
        quotes_count: 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建需求失败: ${error.message}`);
    }

    return data;
  }

  async findAll(userId?: string, status?: string) {
    const client = getSupabaseClient();
    
    let query = client
      .from('demands')
      .select(`
        *,
        addresses (
          id,
          receiver_name,
          receiver_phone,
          province,
          city,
          district,
          detail_address
        )
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`查询需求列表失败: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('demands')
      .select(`
        *,
        addresses (
          id,
          receiver_name,
          receiver_phone,
          province,
          city,
          district,
          detail_address
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`查询需求详情失败: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updateDemandDto: UpdateDemandDto) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('demands')
      .update(updateDemandDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新需求失败: ${error.message}`);
    }

    return data;
  }

  async remove(id: string) {
    const client = getSupabaseClient();
    
    const { error } = await client
      .from('demands')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`删除需求失败: ${error.message}`);
    }

    return { message: '删除成功' };
  }
}
