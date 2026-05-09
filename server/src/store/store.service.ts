import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

@Injectable()
export class StoreService {
  async findAll(sortBy?: string) {
    const client = getSupabaseClient();
    
    let query = client
      .from('stores')
      .select('*');

    // 排序逻辑
    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    } else if (sortBy === 'distance') {
      query = query.order('distance', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`查询门店列表失败: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('stores')
      .select(`
        *,
        services (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`查询门店详情失败: ${error.message}`);
    }

    return data;
  }
}
