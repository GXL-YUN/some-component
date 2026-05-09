import { DemandService, CreateDemandDto, UpdateDemandDto } from './demand.service';
export declare class DemandController {
    private readonly demandService;
    constructor(demandService: DemandService);
    create(createDemandDto: CreateDemandDto): Promise<any>;
    findAll(userId?: string, status?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateDemandDto: UpdateDemandDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
