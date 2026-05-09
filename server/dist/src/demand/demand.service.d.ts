export interface CreateDemandDto {
    user_id: string;
    pet_type: string;
    breed: string;
    gender?: string;
    color?: string;
    age_min?: number;
    age_max?: number;
    vaccine_required?: boolean;
    budget_min?: number;
    budget_max?: number;
    address_id?: string;
    description?: string;
}
export interface UpdateDemandDto {
    pet_type?: string;
    breed?: string;
    gender?: string;
    color?: string;
    age_min?: number;
    age_max?: number;
    vaccine_required?: boolean;
    budget_min?: number;
    budget_max?: number;
    address_id?: string;
    description?: string;
    status?: string;
}
export declare class DemandService {
    create(createDemandDto: CreateDemandDto): Promise<any>;
    findAll(userId?: string, status?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDemandDto: UpdateDemandDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
