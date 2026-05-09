"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../storage/database/supabase-client");
let AddressService = class AddressService {
    async create(createAddressDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        try {
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
        }
        catch (error) {
            console.error('创建地址失败:', error);
            throw error;
        }
    }
    async findByUser(userId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
        }
        catch (error) {
            console.error('查询地址失败:', error);
            throw error;
        }
    }
    async findOne(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
        }
        catch (error) {
            console.error('查询地址失败:', error);
            throw error;
        }
    }
    async update(id, updateAddressDto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        try {
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
        }
        catch (error) {
            console.error('更新地址失败:', error);
            throw error;
        }
    }
    async remove(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
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
        }
        catch (error) {
            console.error('删除地址失败:', error);
            throw error;
        }
    }
    async setDefault(id) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        try {
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
            await client
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', address.user_id);
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
        }
        catch (error) {
            console.error('设置默认地址失败:', error);
            throw error;
        }
    }
};
exports.AddressService = AddressService;
exports.AddressService = AddressService = __decorate([
    (0, common_1.Injectable)()
], AddressService);
//# sourceMappingURL=address.service.js.map