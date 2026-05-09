import { StoreService } from './store.service';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    findAll(sortBy?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
}
