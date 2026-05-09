import { AddressService, CreateAddressDto, UpdateAddressDto } from './address.service';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
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
