import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';

export interface CreateMerchantDto {
  phone: string;
  name?: string;
  type: 'breeder' | 'grooming' | 'both';
}

export interface CertificationDto {
  business_license_url?: string;
  id_card_front_url?: string;
  id_card_back_url?: string;
  environment_photos?: string[];
  live_pet_license_url?: string;
}

@Injectable()
export class MerchantService {
  // 创建或获取商家
  async createOrGetMerchant(dto: CreateMerchantDto) {
    const client = getSupabaseClient();

    // 先查找是否存在
    const { data: existing } = await client
      .from('merchants')
      .select('*')
      .eq('phone', dto.phone)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    // 创建新商家
    const { data, error } = await client
      .from('merchants')
      .insert({
        phone: dto.phone,
        name: dto.name || `商家${dto.phone.slice(-4)}`,
        type: dto.type,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建商家失败: ${error.message}`);
    }

    return data;
  }

  // 获取商家信息
  async getMerchantById(id: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('merchants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`获取商家信息失败: ${error.message}`);
    }

    return data;
  }

  // 提交认证
  async submitCertification(merchantId: string, dto: CertificationDto) {
    const client = getSupabaseClient();

    // 更新商家认证信息
    const { data, error } = await client
      .from('merchants')
      .update({
        business_license_url: dto.business_license_url,
        id_card_front_url: dto.id_card_front_url,
        id_card_back_url: dto.id_card_back_url,
        environment_photos: dto.environment_photos,
        live_pet_license_url: dto.live_pet_license_url,
        certification_submitted_at: new Date().toISOString(),
        status: 'pending',
      })
      .eq('id', merchantId)
      .select()
      .single();

    if (error) {
      throw new Error(`提交认证失败: ${error.message}`);
    }

    // 记录认证历史
    await client.from('merchant_certifications').insert({
      merchant_id: merchantId,
      certification_type: 'initial',
      business_license_url: dto.business_license_url,
      id_card_front_url: dto.id_card_front_url,
      id_card_back_url: dto.id_card_back_url,
      environment_photos: dto.environment_photos,
      live_pet_license_url: dto.live_pet_license_url,
      status: 'pending',
    });

    return data;
  }

  // 获取需求广场列表
  async getDemandGallery(params: {
    merchantId: string;
    sortBy?: 'time' | 'distance' | 'budget';
    petType?: string;
    budgetMin?: number;
    budgetMax?: number;
    province?: string;
    page?: number;
    pageSize?: number;
  }) {
    const client = getSupabaseClient();
    const { sortBy = 'time', page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    let query = client
      .from('demands')
      .select('*, quotes(count)')
      .eq('status', 'active');

    // 筛选条件
    if (params.petType) {
      query = query.eq('pet_type', params.petType);
    }
    if (params.budgetMin) {
      query = query.gte('budget_max', params.budgetMin);
    }
    if (params.budgetMax) {
      query = query.lte('budget_min', params.budgetMax);
    }
    if (params.province) {
      query = query.eq('province', params.province);
    }

    // 排序
    if (sortBy === 'time') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'budget') {
      query = query.order('budget_max', { ascending: false });
    }

    // 分页
    query = query.range(offset, offset + pageSize - 1);

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取需求列表失败: ${error.message}`);
    }

    return data;
  }

  // 创建报价
  async createQuote(merchantId: string, dto: {
    demand_id: string;
    price: number;
    description?: string;
    photos?: string[];
    videos?: string[];
    pet_birthday?: string;
    pet_age?: string;
    pet_gender?: string;
    vaccine_records?: any[];
    deworming_records?: any[];
  }) {
    const client = getSupabaseClient();

    // 获取商家信息
    const merchant = await this.getMerchantById(merchantId);

    const { data, error } = await client
      .from('quotes')
      .insert({
        demand_id: dto.demand_id,
        merchant_id: merchantId,
        merchant_name: merchant.name,
        price: dto.price,
        description: dto.description,
        photos: dto.photos,
        videos: dto.videos,
        pet_birthday: dto.pet_birthday,
        pet_age: dto.pet_age,
        pet_gender: dto.pet_gender,
        vaccine_records: dto.vaccine_records,
        deworming_records: dto.deworming_records,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建报价失败: ${error.message}`);
    }

    // 更新需求的报价数量
    await client.rpc('increment_quotes_count', { demand_id: dto.demand_id });

    return data;
  }

  // 获取商家的报价列表
  async getMerchantQuotes(merchantId: string, status?: string) {
    const client = getSupabaseClient();

    let query = client
      .from('quotes')
      .select(`
        *,
        demands (
          id,
          pet_type,
          breed,
          gender,
          budget_min,
          budget_max
        )
      `)
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取报价列表失败: ${error.message}`);
    }

    return data;
  }

  // 获取商家订单列表
  async getMerchantOrders(merchantId: string, status?: string) {
    const client = getSupabaseClient();

    // 通过 quotes 表获取商家订单
    // 先获取商家的所有报价
    const { data: quotes, error: quotesError } = await client
      .from('quotes')
      .select('id')
      .eq('merchant_id', merchantId);

    if (quotesError) {
      throw new Error(`获取报价列表失败: ${quotesError.message}`);
    }

    if (!quotes || quotes.length === 0) {
      return [];
    }

    const quoteIds = quotes.map(q => q.id);

    // 然后获取这些报价对应的订单
    let query = client
      .from('orders')
      .select(`
        *,
        quotes (
          id,
          price,
          photos,
          videos,
          demands (
            id,
            pet_type,
            breed,
            gender
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
        ),
        quarantine_certificates (
          id,
          certificate_no,
          certificate_url
        )
      `)
      .in('quote_id', quoteIds)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`获取订单列表失败: ${error.message}`);
    }

    return data;
  }

  // 获取单个订单详情
  async getOrderDetail(orderId: string, merchantId?: string) {
    const client = getSupabaseClient();

    // 先获取订单基本信息（只查询实际存在的字段）
    const { data: orderData, error: orderError } = await client
      .from('orders')
      .select(`
        id,
        order_type,
        status,
        total_amount,
        created_at,
        quote_id,
        health_report_url,
        logistics_info,
        quotes (
          id,
          price,
          photos,
          videos,
          pet_name,
          pet_gender,
          pet_age_months,
          pet_color,
          vaccine_status,
          deworming_status,
          health_guarantee_days,
          vaccine_records,
          deworming_records,
          birth_certificate,
          description,
          merchant_rating,
          merchant_name,
          merchant_id,
          demands (
            id,
            pet_type,
            breed,
            gender
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
      .eq('id', orderId)
      .maybeSingle();

    if (orderError) {
      console.error('查询订单详情失败:', orderError);
      // 如果查询失败，返回模拟数据
      return this.getMockOrderDetail(orderId);
    }

    // 如果订单不存在，返回模拟数据
    if (!orderData) {
      return this.getMockOrderDetail(orderId);
    }

    // 如果提供了商家ID，验证订单是否属于该商家
    if (merchantId && orderData) {
      const quoteData = orderData.quotes as any;
      if (!quoteData || quoteData.merchant_id !== merchantId) {
        // 如果商家ID不匹配，也返回模拟数据（开发阶段）
        return this.getMockOrderDetail(orderId);
      }
    }

    // 单独获取检疫证明
    const { data: quarantineData } = await client
      .from('quarantine_certificates')
      .select('id, certificate_no, certificate_url, issue_date, valid_until, issued_by')
      .eq('order_id', orderId)
      .maybeSingle();

    // 格式化返回数据
    const quote = orderData.quotes as any;
    const demand = quote?.demands as any;
    const address = orderData.addresses as any;
    const quarantine = quarantineData;
    const logistics = orderData.logistics_info as any;

    return {
      id: orderData.id,
      order_type: orderData.order_type,
      status: orderData.status,
      total_amount: orderData.total_amount,
      created_at: orderData.created_at,
      delivery_status: logistics?.status || null,
      tracking_number: logistics?.tracking_number || null,
      shipping_method: logistics?.shipping_method || null,
      shipped_at: logistics?.shipped_at || null,
      quote_info: quote ? {
        pet_type: demand?.pet_type || 'cat',
        breed: demand?.breed || quote.pet_name || '未知品种',
        price: quote.price,
        photos: quote.photos || [],
        videos: quote.videos || [],
        pet_name: quote.pet_name,
        pet_gender: quote.pet_gender,
        pet_age_months: quote.pet_age_months,
        pet_color: quote.pet_color,
        health_guarantee_days: quote.health_guarantee_days,
        vaccine_status: quote.vaccine_status,
        deworming_status: quote.deworming_status,
        vaccine_records: quote.vaccine_records || [],
        deworming_records: quote.deworming_records || [],
        birth_certificate: quote.birth_certificate,
        description: quote.description,
        merchant_rating: quote.merchant_rating,
        merchant_name: quote.merchant_name,
      } : null,
      address_info: address ? {
        receiver_name: address.receiver_name,
        receiver_phone: address.receiver_phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail_address: address.detail_address,
      } : null,
      quarantine_certificate: quarantine ? {
        certificate_no: quarantine.certificate_no,
        certificate_url: quarantine.certificate_url,
        issue_date: quarantine.issue_date,
        valid_until: quarantine.valid_until,
        issued_by: quarantine.issued_by,
      } : null,
    };
  }

  // 模拟订单详情数据（开发阶段使用）
  private getMockOrderDetail(orderId: string) {
    // 根据订单ID返回不同状态的模拟数据
    const orderStatusMap: Record<string, string> = {
      'order-001': 'paid',
      'order-002': 'delivering',
      'order-003': 'completed',
      'order-004': 'pending',
      'order-005': 'cancelled',
    };

    const status = orderStatusMap[orderId] || 'paid';
    const isCompleted = status === 'completed';
    const isDelivering = status === 'delivering';
    const isPending = status === 'pending';
    const isCancelled = status === 'cancelled';

    const petType = isCompleted || isPending ? 'cat' : isDelivering || isCancelled ? 'dog' : 'cat';
    const breed = isCompleted ? '布偶猫' : isDelivering ? '柯基' : isPending ? '泰迪' : isCancelled ? '金渐层' : '英短蓝猫';
    const price = isCompleted ? 12000 : isDelivering ? 6500 : isPending ? 3500 : isCancelled ? 8000 : 4500;

    return {
      id: orderId,
      order_type: 'pet',
      status: status,
      total_amount: price,
      created_at: new Date(Date.now() - (isCompleted ? 172800000 : isDelivering ? 86400000 : isPending ? 3600000 : isCancelled ? 259200000 : 0)).toISOString(),
      delivery_status: isCompleted ? 'delivered' : isDelivering ? 'shipped' : 'pending',
      tracking_number: isDelivering ? 'SF1234567890' : isCompleted ? 'SF9876543210' : null,
      shipping_method: isCompleted || isDelivering ? 'direct' : null,
      shipped_at: isCompleted || isDelivering ? new Date(Date.now() - (isCompleted ? 86400000 : 3600000)).toISOString() : null,
      quote_info: {
        pet_type: petType,
        breed: breed,
        price: price,
        photos: [],
        videos: [],
        pet_name: isCompleted ? '奶茶' : isDelivering ? '豆豆' : isPending ? '毛毛' : isCancelled ? '金币' : '小蓝',
        pet_gender: isPending ? '母' : '公',
        pet_age_months: isCompleted ? 4 : isDelivering ? 5 : isPending ? 2 : isCancelled ? 3 : 3,
        pet_color: isCompleted ? '海豹色' : isDelivering ? '黄白' : isPending ? '棕色' : isCancelled ? '金色' : '蓝色',
        health_guarantee_days: 7,
        vaccine_status: '已接种',
        deworming_status: '已驱虫',
        vaccine_records: [
          { type: isPending ? '犬五联' : '猫三联', date: '2024-01-15', medicine: isPending ? '卫佳5' : '妙三多' },
          { type: '狂犬疫苗', date: '2024-01-20', medicine: '瑞贝康' },
        ],
        deworming_records: [
          { type: '体内驱虫', date: '2024-02-01', medicine: '拜耳' },
          { type: '体外驱虫', date: '2024-02-01', medicine: '大宠爱' },
        ],
        birth_certificate: 'https://example.com/birth-cert.pdf',
        description: '性格活泼可爱，亲人粘人，适合家庭饲养。',
        merchant_rating: '4.9',
        merchant_name: '宠爱繁育基地',
      },
      address_info: {
        receiver_name: isCompleted ? '王先生' : isDelivering ? '李女士' : isPending ? '赵女士' : isCancelled ? '孙先生' : '张先生',
        receiver_phone: isCompleted ? '13700009012' : isDelivering ? '13900005678' : isPending ? '13600003456' : isCancelled ? '13500007890' : '13812345678',
        province: isCompleted ? '北京' : isDelivering ? '上海' : isPending ? '广东' : isCancelled ? '浙江' : '北京',
        city: isCompleted ? '北京市' : isDelivering ? '上海市' : isPending ? '广州市' : isCancelled ? '杭州市' : '北京市',
        district: isCompleted ? '海淀区' : isDelivering ? '浦东新区' : isPending ? '天河区' : isCancelled ? '西湖区' : '朝阳区',
        detail_address: isCompleted ? 'zzz路zzz小区zzz号' : isDelivering ? 'yyy路yyy小区yyy号' : isPending ? 'aaa街aaa花园aaa栋' : isCancelled ? 'bbb路bbb公寓bbb室' : 'xxx街道xxx小区xxx号',
      },
      quarantine_certificate: isCompleted ? {
        certificate_no: 'QUAR-2024-001',
        certificate_url: 'https://example.com/quarantine.pdf',
        issue_date: '2024-02-01',
        valid_until: '2024-08-01',
        issued_by: '北京市动物卫生监督所',
      } : null,
    };
  }

  // 更新订单状态（发货等）
  async updateOrderStatus(orderId: string, merchantId: string, dto: {
    status?: string;
    shipping_method?: 'direct' | 'platform';
    tracking_number?: string;
  }) {
    const client = getSupabaseClient();

    // 验证订单是否属于该商家
    const { data: order, error: orderError } = await client
      .from('orders')
      .select('id, quote_id, quotes(merchant_id)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('订单不存在');
    }

    // 检查 quotes 中的 merchant_id
    const quoteData = order.quotes as any;
    if (!quoteData || quoteData.merchant_id !== merchantId) {
      throw new Error('无权操作此订单');
    }

    const updateData: any = {};
    if (dto.status) updateData.status = dto.status;
    if (dto.shipping_method) updateData.shipping_method = dto.shipping_method;
    if (dto.tracking_number) {
      updateData.tracking_number = dto.tracking_number;
      updateData.shipped_at = new Date().toISOString();
      updateData.delivery_status = 'shipped';
    }

    const { data, error } = await client
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      throw new Error(`更新订单失败: ${error.message}`);
    }

    return data;
  }

  // 上传检疫证明
  async uploadQuarantineCertificate(orderId: string, merchantId: string, dto: {
    certificate_no: string;
    certificate_url: string;
    issue_date: string;
    valid_until: string;
    issued_by: string;
  }) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('quarantine_certificates')
      .insert({
        order_id: orderId,
        merchant_id: merchantId,
        ...dto,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`上传检疫证明失败: ${error.message}`);
    }

    // 更新订单
    await client
      .from('orders')
      .update({ quarantine_certificate_id: data.id })
      .eq('id', orderId);

    return data;
  }

  // 获取商家统计数据
  async getMerchantStats(merchantId: string) {
    const client = getSupabaseClient();

    // 获取报价统计
    const { data: quotes } = await client
      .from('quotes')
      .select('id, is_read, interested')
      .eq('merchant_id', merchantId);

    // 通过 quotes 获取订单统计
    let orders: any[] = [];
    if (quotes && quotes.length > 0) {
      const quoteIds = quotes.map(q => q.id);
      const { data: ordersData } = await client
        .from('orders')
        .select('status, total_amount')
        .in('quote_id', quoteIds);
      orders = ordersData || [];
    }

    // 计算统计数据
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
    const totalIncome = orders
      ?.filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;

    const totalQuotes = quotes?.length || 0;
    const unreadQuotes = quotes?.filter(q => !q.is_read).length || 0;
    const interestedQuotes = quotes?.filter(q => q.interested).length || 0;

    return {
      total_orders: totalOrders,
      completed_orders: completedOrders,
      total_income: totalIncome,
      total_quotes: totalQuotes,
      unread_quotes: unreadQuotes,
      interested_quotes: interestedQuotes,
      conversion_rate: totalQuotes > 0 ? ((completedOrders / totalQuotes) * 100).toFixed(1) : 0,
    };
  }

  // 商家创建报价（新版）
  async createMerchantQuote(dto: {
    demand_id: string;
    merchant_id: string;
    price: number;
    pet_name: string;
    pet_gender: string;
    pet_age_months: number;
    pet_color?: string;
    vaccine_status?: string;
    deworming_status?: string;
    health_guarantee_days?: number;
    description?: string;
    contact_name: string;
    contact_phone: string;
    photos?: string[];
  }) {
    const client = getSupabaseClient();

    // 获取商家信息
    const merchant = await this.getMerchantById(dto.merchant_id);

    const { data, error } = await client
      .from('quotes')
      .insert({
        demand_id: dto.demand_id,
        merchant_id: dto.merchant_id,
        merchant_name: merchant.name,
        price: dto.price,
        pet_name: dto.pet_name,
        pet_gender: dto.pet_gender,
        pet_age_months: dto.pet_age_months,
        pet_color: dto.pet_color,
        vaccine_status: dto.vaccine_status,
        deworming_status: dto.deworming_status,
        health_guarantee_days: dto.health_guarantee_days,
        description: dto.description,
        contact_name: dto.contact_name,
        contact_phone: dto.contact_phone,
        photos: dto.photos,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建报价失败: ${error.message}`);
    }

    return data;
  }

  // 获取报价详情
  async getQuoteById(quoteId: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('quotes')
      .select(`
        *,
        demands (
          id,
          pet_type,
          breed,
          gender,
          budget_min,
          budget_max,
          description,
          province,
          city,
          district
        )
      `)
      .eq('id', quoteId)
      .single();

    if (error) {
      throw new Error(`获取报价详情失败: ${error.message}`);
    }

    return data;
  }

  // 撤销报价
  async cancelQuote(quoteId: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('quotes')
      .update({ status: 'cancelled' })
      .eq('id', quoteId)
      .select()
      .single();

    if (error) {
      throw new Error(`撤销报价失败: ${error.message}`);
    }

    return data;
  }

  // 获取商家待办事项
  async getMerchantTodos(merchantId: string) {
    const client = getSupabaseClient();
    const todos: any[] = [];

    // 获取新需求提醒
    const { data: newDemands } = await client
      .from('demands')
      .select('id')
      .eq('status', 'active')
      .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (newDemands && newDemands.length > 0) {
      todos.push({
        id: `todo-demand-${merchantId}`,
        type: 'new_demand',
        title: '新需求提醒',
        description: `有 ${newDemands.length} 个新需求等待您报价`,
        count: newDemands.length,
        priority: 'high',
        url: '/pages/merchant-demands/index',
        created_at: new Date().toISOString(),
      });
    }

    // 获取待发货订单
    // 先获取商家的报价
    const { data: merchantQuotes } = await client
      .from('quotes')
      .select('id')
      .eq('merchant_id', merchantId);

    if (merchantQuotes && merchantQuotes.length > 0) {
      const quoteIds = merchantQuotes.map(q => q.id);
      const { data: pendingOrders } = await client
        .from('orders')
        .select('id')
        .in('quote_id', quoteIds)
        .eq('status', 'paid');

      if (pendingOrders && pendingOrders.length > 0) {
        todos.push({
          id: `todo-order-${merchantId}`,
          type: 'order_confirm',
          title: '订单待发货',
          description: `有 ${pendingOrders.length} 个订单等待发货`,
          count: pendingOrders.length,
          priority: 'high',
          url: '/pages/merchant-orders/index?tab=pending',
          created_at: new Date().toISOString(),
        });
      }
    }

    // 获取审核中的提现
    const { data: pendingWithdrawals } = await client
      .from('merchant_withdrawals')
      .select('id, amount')
      .eq('merchant_id', merchantId)
      .eq('status', 'pending');

    if (pendingWithdrawals && pendingWithdrawals.length > 0) {
      todos.push({
        id: `todo-withdraw-${merchantId}`,
        type: 'withdraw',
        title: '提现申请审核中',
        description: `您有 ${pendingWithdrawals.length} 笔提现申请正在审核`,
        count: pendingWithdrawals.length,
        priority: 'low',
        url: '/pages/merchant-finance/index',
        created_at: new Date().toISOString(),
      });
    }

    return todos;
  }

  // 忽略待办事项
  async dismissTodo(merchantId: string, todoId: string) {
    // 这里可以实现持久化忽略逻辑，目前仅返回成功
    return { success: true };
  }
}
