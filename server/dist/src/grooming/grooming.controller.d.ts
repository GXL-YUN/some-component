import { GroomingService } from './grooming.service';
export declare class GroomingController {
    private readonly groomingService;
    constructor(groomingService: GroomingService);
    getStoreByMerchant(merchantId: string): Promise<{
        data: any;
    }>;
    createStore(dto: any): Promise<any>;
    updateStore(storeId: string, dto: any): Promise<any>;
    updateStoreStatus(storeId: string, isOpen: boolean): Promise<any>;
    getStoreServices(storeId: string): Promise<{
        data: any[];
    }>;
    createService(dto: any): Promise<any>;
    updateService(serviceId: string, dto: any): Promise<any>;
    toggleServiceStatus(serviceId: string, isAvailable: boolean): Promise<any>;
    getAppointments(storeId?: string, merchantId?: string, status?: string, date?: string): Promise<{
        data: {
            id: any;
            user_id: any;
            user_name: any;
            user_phone: any;
            pet_name: any;
            pet_type: any;
            service_name: any;
            service_price: any;
            appointment_time: any;
            status: any;
            note: any;
            verification_code: any;
        }[];
    }>;
    confirmAppointment(id: string): Promise<any>;
    startService(id: string): Promise<any>;
    completeService(id: string): Promise<any>;
    cancelAppointment(id: string, reason?: string): Promise<any>;
    verifyCode(verificationCode: string): Promise<{
        data: {
            id: any;
            user_name: any;
            user_phone: any;
            pet_name: any;
            service_name: any;
            appointment_time: any;
            status: any;
            verification_code: any;
        };
    }>;
    getMembers(merchantId: string, sortBy?: 'frequency' | 'amount'): Promise<{
        data: any[];
    }>;
    getRevenueStats(merchantId: string): Promise<{
        data: {
            today: number;
            week: number;
            month: number;
            todayOrders: number;
            weekOrders: number;
            monthOrders: number;
        };
    }>;
    getBalance(merchantId: string): Promise<{
        data: {
            balance: number;
        };
    }>;
    getBankAccounts(merchantId: string): Promise<{
        data: any[];
    }>;
    addBankAccount(merchantId: string, dto: any): Promise<any>;
    getWithdrawals(merchantId: string): Promise<{
        data: any[];
    }>;
    createWithdrawal(merchantId: string, amount: number): Promise<any>;
}
