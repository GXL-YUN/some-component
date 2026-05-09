import { OrderService, CreateOrderDto } from './order.service';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: CreateOrderDto): Promise<any>;
    findByUser(userId: string, status?: string, orderType?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    confirmReceipt(id: string): Promise<any>;
}
