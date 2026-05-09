"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../storage/database/supabase-client");
let QuoteService = class QuoteService {
    async create(createQuoteDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
        await client.rpc('increment_quotes_count', { demand_id: createQuoteDto.demand_id });
        return data;
    }
    async findByDemand(demandId, sortBy) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        let query = client
            .from('quotes')
            .select('*')
            .eq('demand_id', demandId)
            .eq('status', 'active');
        if (sortBy === 'price') {
            query = query.order('price', { ascending: true });
        }
        else if (sortBy === 'rating') {
            query = query.order('merchant_rating', { ascending: false });
        }
        else if (sortBy === 'distance') {
            query = query.order('distance', { ascending: true });
        }
        else {
            query = query.order('created_at', { ascending: false });
        }
        const { data, error } = await query;
        if (error) {
            throw new Error(`查询报价列表失败: ${error.message}`);
        }
        return data;
    }
    async findOne(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async findAll(limit) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
    async accept(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
};
exports.QuoteService = QuoteService;
exports.QuoteService = QuoteService = __decorate([
    (0, common_1.Injectable)()
], QuoteService);
//# sourceMappingURL=quote.service.js.map