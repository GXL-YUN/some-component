"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../storage/database/supabase-client");
let DemandService = class DemandService {
    async create(createDemandDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async findAll(userId, status) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async findOne(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async update(id, updateDemandDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async remove(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { error } = await client
            .from('demands')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(`删除需求失败: ${error.message}`);
        }
        return { message: '删除成功' };
    }
};
exports.DemandService = DemandService;
exports.DemandService = DemandService = __decorate([
    (0, common_1.Injectable)()
], DemandService);
//# sourceMappingURL=demand.service.js.map