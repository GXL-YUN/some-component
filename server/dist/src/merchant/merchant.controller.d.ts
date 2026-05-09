import { MerchantService, CreateMerchantDto, CertificationDto } from './merchant.service';
export declare class MerchantController {
    private readonly merchantService;
    constructor(merchantService: MerchantService);
    createOrGetMerchant(dto: CreateMerchantDto): Promise<any>;
    getMerchant(id: string): Promise<any>;
    submitCertification(id: string, dto: CertificationDto): Promise<any>;
    getDemandGallery(id: string, sortBy?: 'time' | 'distance' | 'budget', petType?: string, budgetMin?: string, budgetMax?: string, province?: string, page?: string, pageSize?: string): Promise<any[]>;
    createQuote(id: string, dto: any): Promise<any>;
    getQuotes(id: string, status?: string): Promise<any[]>;
    getOrders(id: string, status?: string): Promise<any[]>;
    getOrderDetail(id: string, orderId: string): Promise<{
        id: any;
        order_type: any;
        status: any;
        total_amount: any;
        created_at: any;
        delivery_status: any;
        tracking_number: any;
        shipping_method: any;
        shipped_at: any;
        quote_info: {
            pet_type: any;
            breed: any;
            price: any;
            photos: any;
            videos: any;
            pet_name: any;
            pet_gender: any;
            pet_age_months: any;
            pet_color: any;
            health_guarantee_days: any;
            vaccine_status: any;
            deworming_status: any;
            vaccine_records: any;
            deworming_records: any;
            birth_certificate: any;
            description: any;
            merchant_rating: any;
            merchant_name: any;
        } | null;
        address_info: {
            receiver_name: any;
            receiver_phone: any;
            province: any;
            city: any;
            district: any;
            detail_address: any;
        } | null;
        quarantine_certificate: {
            certificate_no: any;
            certificate_url: any;
            issue_date: any;
            valid_until: any;
            issued_by: any;
        } | null;
    }>;
    updateOrderStatus(orderId: string, merchantId: string, dto: any): Promise<any>;
    uploadQuarantineCertificate(orderId: string, merchantId: string, dto: any): Promise<any>;
    getStats(id: string): Promise<{
        total_orders: number;
        completed_orders: number;
        total_income: any;
        total_quotes: number;
        unread_quotes: number;
        interested_quotes: number;
        conversion_rate: string | number;
    }>;
    getTodos(id: string): Promise<any[]>;
    dismissTodo(todoId: string, merchantId: string): Promise<{
        success: boolean;
    }>;
}
