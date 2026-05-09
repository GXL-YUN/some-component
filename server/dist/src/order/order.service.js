"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../storage/database/supabase-client");
let OrderService = class OrderService {
    async create(createOrderDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async findByUser(userId, status, orderType) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async findOne(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async updateStatus(id, status) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async confirmReceipt(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)()
], OrderService);
//# sourceMappingURL=order.service.js.map