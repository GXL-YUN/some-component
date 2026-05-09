"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../storage/database/supabase-client");
let StoreService = class StoreService {
    async findAll(sortBy) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        let query = client
            .from('stores')
            .select('*');
        if (sortBy === 'rating') {
            query = query.order('rating', { ascending: false });
        }
        else if (sortBy === 'distance') {
            query = query.order('distance', { ascending: true });
        }
        else {
            query = query.order('created_at', { ascending: false });
        }
        const { data, error } = await query;
        if (error) {
            throw new Error(`查询门店列表失败: ${error.message}`);
        }
        return data;
    }
    async findOne(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)()
], StoreService);
//# sourceMappingURL=store.service.js.map