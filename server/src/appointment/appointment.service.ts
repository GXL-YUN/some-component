import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { randomBytes } from 'crypto';

export interface CreateAppointmentDto {
  user_id: string;
  store_id: string;
  service_id: string;
  pet_id?: string;
  appointment_time: string;
  note?: string;
  price: number;
}

@Injectable()
export class AppointmentService {
  async create(createAppointmentDto: CreateAppointmentDto) {
    const client = getSupabaseClient();
    
    // 生成核销码
    const verificationCode = randomBytes(4).toString('hex').toUpperCase();
    
    const { data, error } = await client
      .from('appointments')
      .insert({
        ...createAppointmentDto,
        status: 'pending',
        verification_code: verificationCode,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`创建预约失败: ${error.message}`);
    }

    return data;
  }

  async findByUser(userId: string, status?: string) {
    const client = getSupabaseClient();

    let query = client
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_time', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: appointments, error: appointmentsError } = await query;

    if (appointmentsError) {
      throw new Error(`查询预约列表失败: ${appointmentsError.message}`);
    }

    // 分别查询关联数据
    const storeIds = appointments.map(a => a.store_id).filter(Boolean);
    const serviceIds = appointments.map(a => a.service_id).filter(Boolean);
    const petIds = appointments.map(a => a.pet_id).filter(Boolean);

    const [stores, services, pets] = await Promise.all([
      storeIds.length > 0
        ? client.from('stores').select('id, name, address, phone').in('id', storeIds)
        : Promise.resolve({ data: [] }),
      serviceIds.length > 0
        ? client.from('services').select('id, name, price').in('id', serviceIds)
        : Promise.resolve({ data: [] }),
      petIds.length > 0
        ? client.from('pets').select('id, name, pet_type, breed').in('id', petIds)
        : Promise.resolve({ data: [] }),
    ]);

    const storeMap = new Map((stores.data || []).map(s => [s.id, s] as const));
    const serviceMap = new Map((services.data || []).map(s => [s.id, s] as const));
    const petMap = new Map((pets.data || []).map(p => [p.id, p] as const));

    // 组装数据
    return appointments.map(appointment => ({
      ...appointment,
      stores: appointment.store_id ? storeMap.get(appointment.store_id) || null : null,
      services: appointment.service_id ? serviceMap.get(appointment.service_id) || null : null,
      pets: appointment.pet_id ? petMap.get(appointment.pet_id) || null : null,
    }));
  }

  async findOne(id: string) {
    const client = getSupabaseClient();

    const { data: appointment, error: appointmentError } = await client
      .from('appointments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (appointmentError) {
      throw new Error(`查询预约详情失败: ${appointmentError.message}`);
    }

    if (!appointment) {
      return null;
    }

    // 分别查询关联数据
    const [stores, services, pets] = await Promise.all([
      appointment.store_id
        ? client.from('stores').select('id, name, address, phone').eq('id', appointment.store_id).maybeSingle()
        : Promise.resolve({ data: null }),
      appointment.service_id
        ? client.from('services').select('id, name, price').eq('id', appointment.service_id).maybeSingle()
        : Promise.resolve({ data: null }),
      appointment.pet_id
        ? client.from('pets').select('id, name, pet_type, breed').eq('id', appointment.pet_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    return {
      ...appointment,
      stores: stores.data,
      services: services.data,
      pets: pets.data,
    };
  }

  async cancel(id: string) {
    const client = getSupabaseClient();
    
    const { data, error } = await client
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`取消预约失败: ${error.message}`);
    }

    return data;
  }
}
