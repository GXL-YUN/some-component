import { QuoteService, CreateQuoteDto } from './quote.service';
export declare class QuoteController {
    private readonly quoteService;
    constructor(quoteService: QuoteService);
    create(createQuoteDto: CreateQuoteDto): Promise<any>;
    findAll(limit?: string): Promise<any[]>;
    findByDemand(demandId: string, sortBy?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    accept(id: string): Promise<any>;
}
