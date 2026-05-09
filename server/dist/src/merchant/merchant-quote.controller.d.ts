import { MerchantService } from './merchant.service';
export declare class MerchantQuoteController {
    private readonly merchantService;
    constructor(merchantService: MerchantService);
    createQuote(dto: {
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
    getQuoteDetail(id: string): Promise<any>;
    cancelQuote(id: string): Promise<any>;
}
