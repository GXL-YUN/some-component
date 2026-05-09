export interface VaccineRecord {
    name: string;
    date: string;
    dose: number;
    total_doses: number;
}
export interface DewormingRecord {
    type: string;
    date: string;
    medicine: string;
}
export interface CreateQuoteDto {
    demand_id: string;
    merchant_id: string;
    merchant_name: string;
    merchant_avatar?: string;
    price: number;
    description?: string;
    photos?: string[];
    videos?: string[];
    vaccine_records?: VaccineRecord[];
    deworming_records?: DewormingRecord[];
    birth_certificate?: string;
    merchant_rating?: number;
    distance?: number;
}
export declare class QuoteService {
    create(createQuoteDto: CreateQuoteDto): Promise<any>;
    findByDemand(demandId: string, sortBy?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findAll(limit?: number): Promise<any[]>;
    accept(id: string): Promise<any>;
}
