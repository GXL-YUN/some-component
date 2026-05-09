import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

export interface CreateOrderDto {
  user_id: string;
  quote_id?: string; // 洗护订单可能没有 quote
  order_type: string;
  total_amount: number;
  deposit_amount?: number;
  paid_amount?: number;
  address_id?: string;
  status?: string;
  verification_code?: string; // 核销码（洗护订单）
  appointment_time?: string; // 预约时间（洗护订单）
  appointment?: any; // 预约信息快照（洗护订单）
}

@Injectable()
export class OrderService {
  async create(createOrderDto: CreateOrderDto) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('orders')
      .insert({
        ...createOrderDto,
        status: createOrderDto.status || 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建订单失败: ${error.message}`);
    }

    return data;
  }

  async findByUser(userId: string, status?: string, orderType?: string) {
    const client = getSupabaseClient();
    
    let query = client
      .from('orders')
      .select(`
        *,
        quotes (
          id,
          price,
          merchant_name,
          merchant_avatar,
          demands (
            id,
            pet_type,
            breed
          )
        ),
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (orderType) {
      query = query.eq('order_type', orderType);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`查询订单列表失败: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('orders')
      .select(`
        *,
        quotes (
          id,
          price,
          merchant_name,
          merchant_avatar,
          photos,
          videos,
          demands (
            id,
            pet_type,
            breed,
            gender,
            color
          )
        ),
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
      throw new Error(`查询订单详情失败: ${error.message}`);
    }

    return data;
  }

  async updateStatus(id: string, status: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`更新订单状态失败: ${error.message}`);
    }

    return data;
  }

  async confirmReceipt(id: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`确认收货失败: ${error.message}`);
    }

    return data;
  }
}
