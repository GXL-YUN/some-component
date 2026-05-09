export interface CreateAppointmentDto {
    user_id: string;
    store_id: string;
    service_id: string;
    pet_id?: string;
    appointment_time: string;
    note?: string;
    price: number;
}
export declare class AppointmentService {
    create(createAppointmentDto: CreateAppointmentDto): Promise<any>;
    findByUser(userId: string, status?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
}
