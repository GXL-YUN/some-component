import { PetService, CreatePetDto, UpdatePetDto } from './pet.service';
export declare class PetController {
    private readonly petService;
    constructor(petService: PetService);
    create(createPetDto: CreatePetDto): Promise<any>;
    findByUser(userId: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    getRecords(id: string): Promise<any[]>;
    update(id: string, updatePetDto: UpdatePetDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addRecord(id: string, recordData: any): Promise<any>;
    getPhotos(id: string): Promise<any[]>;
    uploadPhoto(id: string, file: Express.Multer.File, description?: string): Promise<any>;
    deletePhoto(id: string, photoId: string): Promise<{
        message: string;
    }>;
    updatePhoto(id: string, photoId: string, body: {
        description?: string;
        sort_order?: number;
    }): Promise<any>;
}
