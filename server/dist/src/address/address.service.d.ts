export interface CreateAddressDto {
    user_id: string;
    receiver_name: string;
    receiver_phone: string;
    province: string;
    city: string;
    district: string;
    detail_address: string;
    is_default?: boolean;
}
export interface UpdateAddressDto {
    receiver_name?: string;
    receiver_phone?: string;
    province?: string;
    city?: string;
    district?: string;
    detail_address?: string;
    is_default?: boolean;
}
export declare class AddressService {
    create(createAddressDto: CreateAddressDto): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    findByUser(userId: string): Promise<{
        code: number;
        data: any[];
    }>;
    findOne(id: string): Promise<{
        code: number;
        data: any;
    }>;
    update(id: string, updateAddressDto: UpdateAddressDto): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    remove(id: string): Promise<{
        code: number;
        msg: string;
    }>;
    setDefault(id: string): Promise<{
        code: number;
        msg: string;
        data?: undefined;
    } | {
        code: number;
        msg: string;
        data: any;
    }>;
}
