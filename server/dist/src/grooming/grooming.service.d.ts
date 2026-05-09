export declare class GroomingService {
    getStoreByMerchant(merchantId: string): Promise<any>;
    createStore(dto: {
        merchant_id: string;
        name: string;
        phone: string;
        province: string;
        city: string;
        district: string;
        address: string;
        opening_hours?: string;
        service_range?: string;
        description?: string;
        photos?: string[];
    }): Promise<any>;
    updateStore(storeId: string, dto: Partial<{
        name: string;
        phone: string;
        address: string;
        opening_hours: string;
        service_range: string;
        description: string;
        photos: string[];
        is_open: boolean;
    }>): Promise<any>;
    getStoreServices(storeId: string): Promise<any[]>;
    createService(dto: {
        store_id: string;
        name: string;
        category: string;
        description?: string;
        price_config: {
            small?: number;
            medium?: number;
            large?: number;
        };
        duration: number;
        is_available?: boolean;
    }): Promise<any>;
    updateService(serviceId: string, dto: Partial<{
        name: string;
        category: string;
        description: string;
        price_config: object;
        duration: number;
        is_available: boolean;
    }>): Promise<any>;
    toggleServiceStatus(serviceId: string, isAvailable: boolean): Promise<any>;
    getAppointments(params: {
        storeId?: string;
        merchantId?: string;
        status?: string;
        date?: string;
    }): Promise<{
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
    }[]>;
    confirmAppointment(appointmentId: string): Promise<any>;
    startService(appointmentId: string): Promise<any>;
    completeService(appointmentId: string): Promise<any>;
    cancelAppointment(appointmentId: string, reason?: string): Promise<any>;
    verifyCode(verificationCode: string): Promise<{
        id: any;
        user_name: any;
        user_phone: any;
        pet_name: any;
        service_name: any;
        appointment_time: any;
        status: any;
        verification_code: any;
    }>;
    getMembers(merchantId: string, sortBy?: 'frequency' | 'amount'): Promise<any[]>;
    private calculateMemberLevel;
    getRevenueStats(merchantId: string): Promise<{
        today: number;
        week: number;
        month: number;
        todayOrders: number;
        weekOrders: number;
        monthOrders: number;
    }>;
    getBalance(merchantId: string): Promise<{
        balance: number;
    }>;
    getBankAccounts(merchantId: string): Promise<any[]>;
    addBankAccount(merchantId: string, dto: {
        bank_name: string;
        account_name: string;
        account_no: string;
        bank_branch?: string;
    }): Promise<any>;
    getWithdrawals(merchantId: string): Promise<any[]>;
    createWithdrawal(merchantId: string, amount: number): Promise<any>;
}
