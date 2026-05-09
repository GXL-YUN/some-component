import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

// 疫苗记录类型
export interface VaccineRecord {
  name: string;
  date: string;
  dose: number;
  total_doses: number;
}

// 驱虫记录类型
export interface DewormingRecord {
  type: string;
  date: string;
  medicine: string;
}

export interface CreateQuoteDto {
  demand_id: string;
  merchant_id: string;
  merchant_name: string;
  merchant_avatar?: string;
  price: number;
  description?: string;
  photos?: string[];
  videos?: string[];
  vaccine_records?: VaccineRecord[];
  deworming_records?: DewormingRecord[];
  birth_certificate?: string;
  merchant_rating?: number;
  distance?: number;
}

@Injectable()
export class QuoteService {
  async create(createQuoteDto: CreateQuoteDto) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('quotes')
      .insert({
        ...createQuoteDto,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建报价失败: ${error.message}`);
    }

    // 更新需求的报价数量
    await client.rpc('increment_quotes_count', { demand_id: createQuoteDto.demand_id });

    return data;
  }

  async findByDemand(demandId: string, sortBy?: string) {
    const client = getSupabaseClient();
    
    let query = client
      .from('quotes')
      .select('*')
      .eq('demand_id', demandId)
      .eq('status', 'active');

    // 排序逻辑
    if (sortBy === 'price') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'rating') {
      query = query.order('merchant_rating', { ascending: false });
    } else if (sortBy === 'distance') {
      query = query.order('distance', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`查询报价列表失败: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('quotes')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`查询报价详情失败: ${error.message}`);
    }

    return data;
  }

  async findAll(limit?: number) {
    const client = getSupabaseClient();
    
    let query = client
      .from('quotes')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`查询报价列表失败: ${error.message}`);
    }

    return data;
  }

  async accept(id: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`接受报价失败: ${error.message}`);
    }

    return data;
  }
}
