"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroomingService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../storage/database/supabase-client");
let GroomingService = class GroomingService {
    async getStoreByMerchant(merchantId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('grooming_stores')
            .select('*')
            .eq('merchant_id', merchantId)
            .single();
        if (error && error.code !== 'PGRST116') {
            throw new Error(`获取门店信息失败: ${error.message}`);
        }
        return data;
    }
    async createStore(dto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('grooming_stores')
            .insert(dto)
            .select()
            .single();
        if (error) {
            throw new Error(`创建门店失败: ${error.message}`);
        }
        return data;
    }
    async updateStore(storeId, dto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('grooming_stores')
            .update(dto)
            .eq('id', storeId)
            .select()
            .single();
        if (error) {
            throw new Error(`更新门店失败: ${error.message}`);
        }
        return data;
    }
    async getStoreServices(storeId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('grooming_services')
            .select('*')
            .eq('store_id', storeId)
            .order('sort_order', { ascending: true });
        if (error) {
            throw new Error(`获取服务列表失败: ${error.message}`);
        }
        return data || [];
    }
    async createService(dto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('grooming_services')
            .insert(dto)
            .select()
            .single();
        if (error) {
            throw new Error(`创建服务失败: ${error.message}`);
        }
        return data;
    }
    async updateService(serviceId, dto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('grooming_services')
            .update(dto)
            .eq('id', serviceId)
            .select()
            .single();
        if (error) {
            throw new Error(`更新服务失败: ${error.message}`);
        }
        return data;
    }
    async toggleServiceStatus(serviceId, isAvailable) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('grooming_services')
            .update({ is_available: isAvailable })
            .eq('id', serviceId)
            .select()
            .single();
        if (error) {
            throw new Error(`切换服务状态失败: ${error.message}`);
        }
        return data;
    }
    async getAppointments(params) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        let effectiveStoreId = params.storeId;
        if (params.merchantId && !effectiveStoreId) {
            const store = await this.getStoreByMerchant(params.merchantId);
            if (store) {
                effectiveStoreId = store.id;
            }
        }
        let query = client
            .from('appointments')
            .select(`
        *,
        users (id, nickname, phone, avatar_url),
        services (id, name, price_config),
        pets (id, name, pet_type, breed)
      `)
            .order('appointment_time', { ascending: true });
        if (effectiveStoreId) {
            query = query.eq('store_id', effectiveStoreId);
        }
        if (params.status && params.status !== 'all') {
            query = query.eq('status', params.status);
        }
        if (params.date) {
            const startOfDay = new Date(params.date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(params.date);
            endOfDay.setHours(23, 59, 59, 999);
            query = query
                .gte('appointment_time', startOfDay.toISOString())
                .lte('appointment_time', endOfDay.toISOString());
        }
        const { data, error } = await query;
        if (error) {
            throw new Error(`获取预约列表失败: ${error.message}`);
        }
        return (data || []).map((apt) => ({
            id: apt.id,
            user_id: apt.user_id,
            user_name: apt.users?.nickname || '用户',
            user_phone: apt.users?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '',
            pet_name: apt.pets?.name || '宠物',
            pet_type: apt.pets?.pet_type || 'dog',
            service_name: apt.services?.name || '服务',
            service_price: apt.price,
            appointment_time: apt.appointment_time,
            status: apt.status,
            note: apt.note,
            verification_code: apt.verification_code,
        }));
    }
    async confirmAppointment(appointmentId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('appointments')
            .update({ status: 'confirmed' })
            .eq('id', appointmentId)
            .select()
            .single();
        if (error) {
            throw new Error(`确认预约失败: ${error.message}`);
        }
        return data;
    }
    async startService(appointmentId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('appointments')
            .update({ status: 'in_service' })
            .eq('id', appointmentId)
            .select()
            .single();
        if (error) {
            throw new Error(`开始服务失败: ${error.message}`);
        }
        return data;
    }
    async completeService(appointmentId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('appointments')
            .update({ status: 'completed' })
            .eq('id', appointmentId)
            .select()
            .single();
        if (error) {
            throw new Error(`完成服务失败: ${error.message}`);
        }
        return data;
    }
    async cancelAppointment(appointmentId, reason) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', appointmentId)
            .select()
            .single();
        if (error) {
            throw new Error(`取消预约失败: ${error.message}`);
        }
        await client.from('appointment_cancellations').insert({
            appointment_id: appointmentId,
            cancelled_by: 'merchant',
            reason: reason || '商家取消',
        });
        return data;
    }
    async verifyCode(verificationCode) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: appointment, error } = await client
            .from('appointments')
            .select(`
        *,
        users (id, nickname, phone),
        services (id, name),
        pets (id, name, pet_type)
      `)
            .eq('verification_code', verificationCode)
            .single();
        if (error || !appointment) {
            throw new Error('核销码无效');
        }
        if (appointment.status !== 'confirmed') {
            throw new Error('该预约状态不允许核销');
        }
        await client.from('verifications').insert({
            appointment_id: appointment.id,
            store_id: appointment.store_id,
            verification_code: verificationCode,
            verified_by: appointment.store_id,
            verify_method: 'manual',
        });
        return {
            id: appointment.id,
            user_name: appointment.users?.nickname || '用户',
            user_phone: appointment.users?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '',
            pet_name: appointment.pets?.name || '宠物',
            service_name: appointment.services?.name || '服务',
            appointment_time: appointment.appointment_time,
            status: appointment.status,
            verification_code: appointment.verification_code,
        };
    }
    async getMembers(merchantId, sortBy = 'frequency') {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: stores } = await client
            .from('grooming_stores')
            .select('id')
            .eq('merchant_id', merchantId);
        if (!stores || stores.length === 0) {
            return [];
        }
        const storeIds = stores.map(s => s.id);
        const { data: appointments } = await client
            .from('appointments')
            .select(`
        user_id,
        price,
        users (id, nickname, phone, avatar_url),
        pets (id, name, pet_type, breed)
      `)
            .in('store_id', storeIds)
            .eq('status', 'completed');
        if (!appointments || appointments.length === 0) {
            return [];
        }
        const memberMap = new Map();
        appointments.forEach((apt) => {
            if (!memberMap.has(apt.user_id)) {
                memberMap.set(apt.user_id, {
                    user_id: apt.user_id,
                    user_name: apt.users?.nickname || '用户',
                    user_phone: apt.users?.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || '',
                    user_avatar: apt.users?.avatar_url,
                    pets: [],
                    total_spent: 0,
                    total_orders: 0,
                    last_visit: apt.appointment_time,
                });
            }
            const member = memberMap.get(apt.user_id);
            member.total_spent += Number(apt.price) || 0;
            member.total_orders += 1;
            if (apt.pets && !member.pets.find((p) => p.id === apt.pets.id)) {
                member.pets.push({
                    id: apt.pets.id,
                    name: apt.pets.name,
                    type: apt.pets.pet_type,
                    breed: apt.pets.breed,
                });
            }
        });
        let members = Array.from(memberMap.values());
        if (sortBy === 'frequency') {
            members.sort((a, b) => b.total_orders - a.total_orders);
        }
        else {
            members.sort((a, b) => b.total_spent - a.total_spent);
        }
        members = members.map(m => ({
            ...m,
            member_level: this.calculateMemberLevel(m.total_spent),
        }));
        return members;
    }
    calculateMemberLevel(totalSpent) {
        if (totalSpent >= 5000)
            return 'diamond';
        if (totalSpent >= 2000)
            return 'gold';
        if (totalSpent >= 500)
            return 'silver';
        return 'normal';
    }
    async getRevenueStats(merchantId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: stores } = await client
            .from('grooming_stores')
            .select('id')
            .eq('merchant_id', merchantId);
        if (!stores || stores.length === 0) {
            return {
                today: 0,
                week: 0,
                month: 0,
                todayOrders: 0,
                weekOrders: 0,
                monthOrders: 0,
            };
        }
        const storeIds = stores.map(s => s.id);
        const { data: appointments } = await client
            .from('appointments')
            .select('price, created_at')
            .in('store_id', storeIds)
            .eq('status', 'completed');
        if (!appointments || appointments.length === 0) {
            return {
                today: 0,
                week: 0,
                month: 0,
                todayOrders: 0,
                weekOrders: 0,
                monthOrders: 0,
            };
        }
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 7);
        const monthStart = new Date(todayStart);
        monthStart.setDate(monthStart.getDate() - 30);
        let today = 0, week = 0, month = 0;
        let todayOrders = 0, weekOrders = 0, monthOrders = 0;
        appointments.forEach((apt) => {
            const aptDate = new Date(apt.created_at);
            const price = Number(apt.price) || 0;
            if (aptDate >= todayStart) {
                today += price;
                todayOrders++;
            }
            if (aptDate >= weekStart) {
                week += price;
                weekOrders++;
            }
            if (aptDate >= monthStart) {
                month += price;
                monthOrders++;
            }
        });
        return {
            today,
            week,
            month,
            todayOrders,
            weekOrders,
            monthOrders,
        };
    }
    async getBalance(merchantId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('merchants')
            .select('balance')
            .eq('id', merchantId)
            .single();
        if (error) {
            throw new Error(`获取余额失败: ${error.message}`);
        }
        return { balance: Number(data?.balance) || 0 };
    }
    async getBankAccounts(merchantId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('merchant_bank_accounts')
            .select('*')
            .eq('merchant_id', merchantId)
            .eq('status', 'active');
        if (error) {
            throw new Error(`获取银行卡列表失败: ${error.message}`);
        }
        return data || [];
    }
    async addBankAccount(merchantId, dto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: existingAccounts } = await client
            .from('merchant_bank_accounts')
            .select('id')
            .eq('merchant_id', merchantId);
        const isDefault = !existingAccounts || existingAccounts.length === 0;
        const { data, error } = await client
            .from('merchant_bank_accounts')
            .insert({
            merchant_id: merchantId,
            ...dto,
            is_default: isDefault,
        })
            .select()
            .single();
        if (error) {
            throw new Error(`添加银行卡失败: ${error.message}`);
        }
        return data;
    }
    async getWithdrawals(merchantId) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await client
            .from('merchant_withdrawals')
            .select('*')
            .eq('merchant_id', merchantId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`获取提现记录失败: ${error.message}`);
        }
        return data || [];
    }
    async createWithdrawal(merchantId, amount) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: bankAccount } = await client
            .from('merchant_bank_accounts')
            .select('id')
            .eq('merchant_id', merchantId)
            .eq('is_default', true)
            .single();
        const { data, error } = await client
            .from('merchant_withdrawals')
            .insert({
            merchant_id: merchantId,
            bank_account_id: bankAccount?.id,
            amount,
            fee: 0,
            status: 'pending',
        })
            .select()
            .single();
        if (error) {
            throw new Error(`申请提现失败: ${error.message}`);
        }
        await client.rpc('decrease_merchant_balance', {
            merchant_id: merchantId,
            amount: amount,
        });
        return data;
    }
};
exports.GroomingService = GroomingService;
exports.GroomingService = GroomingService = __decorate([
    (0, common_1.Injectable)()
], GroomingService);
//# sourceMappingURL=grooming.service.js.map