export interface CreateMerchantDto {
    phone: string;
    name?: string;
    type: 'breeder' | 'grooming' | 'both';
}
export interface CertificationDto {
    business_license_url?: string;
    id_card_front_url?: string;
    id_card_back_url?: string;
    environment_photos?: string[];
    live_pet_license_url?: string;
}
export declare class MerchantService {
    createOrGetMerchant(dto: CreateMerchantDto): Promise<any>;
    getMerchantById(id: string): Promise<any>;
    submitCertification(merchantId: string, dto: CertificationDto): Promise<any>;
    getDemandGallery(params: {
        merchantId: string;
        sortBy?: 'time' | 'distance' | 'budget';
        petType?: string;
        budgetMin?: number;
        budgetMax?: number;
        province?: string;
        page?: number;
        pageSize?: number;
    }): Promise<any[]>;
    createQuote(merchantId: string, dto: {
        demand_id: string;
        price: number;
        description?: string;
        photos?: string[];
        videos?: string[];
        pet_birthday?: string;
        pet_age?: string;
        pet_gender?: string;
        vaccine_records?: any[];
        deworming_records?: any[];
    }): Promise<any>;
    getMerchantQuotes(merchantId: string, status?: string): Promise<any[]>;
    getMerchantOrders(merchantId: string, status?: string): Promise<any[]>;
    getOrderDetail(orderId: string, merchantId?: string): Promise<{
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
    private getMockOrderDetail;
    updateOrderStatus(orderId: string, merchantId: string, dto: {
        status?: string;
        shipping_method?: 'direct' | 'platform';
        tracking_number?: string;
    }): Promise<any>;
    uploadQuarantineCertificate(orderId: string, merchantId: string, dto: {
        certificate_no: string;
        certificate_url: string;
        issue_date: string;
        valid_until: string;
        issued_by: string;
    }): Promise<any>;
    getMerchantStats(merchantId: string): Promise<{
        total_orders: number;
        completed_orders: number;
        total_income: any;
        total_quotes: number;
        unread_quotes: number;
        interested_quotes: number;
        conversion_rate: string | number;
    }>;
    createMerchantQuote(dto: {
        demand_id: string;
        merchant_id: string;
        price: number;
        pet_name: string;
        pet_gender: string;
        pet_age_months: number;
        pet_color?: string;
        vaccine_status?: string;
        deworming_status?: string;
        health_guarantee_days?: number;
        description?: string;
        contact_name: string;
        contact_phone: string;
        photos?: string[];
    }): Promise<any>;
    getQuoteById(quoteId: string): Promise<any>;
    cancelQuote(quoteId: string): Promise<any>;
    getMerchantTodos(merchantId: string): Promise<any[]>;
    dismissTodo(merchantId: string, todoId: string): Promise<{
        success: boolean;
    }>;
}
