import { AppointmentService, CreateAppointmentDto } from './appointment.service';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<any>;
    findByUser(userId: string, status?: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    cancel(id: string): Promise<any>;
}
