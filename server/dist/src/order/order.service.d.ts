export interface CreateOrderDto {
    user_id: string;
    quote_id?: string;
    order_type: string;
    total_amount: number;
    deposit_amount?: number;
    paid_amount?: number;
    address_id?: string;
    status?: string;
    verification_code?: string;
    appointment_time?: string;
    appointment?: any;
}
export declare class OrderService {
    create(createOrderDto: CreateOrderDto): Promise<any>;
    findByUser(userId: string, status?: string, orderType?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    updateStatus(id: string, status: string): Promise<any>;
    confirmReceipt(id: string): Promise<any>;
}
