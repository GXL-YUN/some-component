export interface CreatePetDto {
    user_id: string;
    name: string;
    pet_type: string;
    breed: string;
    gender: string;
    birthday?: string;
    photo_url?: string;
    vaccine_records?: any;
    deworming_records?: any;
    description?: string;
}
export interface UpdatePetDto {
    name?: string;
    photo_url?: string;
    vaccine_records?: any;
    deworming_records?: any;
    description?: string;
}
export declare class PetService {
    create(createPetDto: CreatePetDto): Promise<any>;
    findByUser(userId: string): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updatePetDto: UpdatePetDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
    addRecord(petId: string, recordData: any): Promise<any>;
    getRecords(petId: string): Promise<any[]>;
    getPhotos(petId: string): Promise<any[]>;
    uploadPhoto(petId: string, file: Express.Multer.File, description?: string): Promise<any>;
    deletePhoto(petId: string, photoId: string): Promise<{
        message: string;
    }>;
    updatePhoto(petId: string, photoId: string, body: {
        description?: string;
        sort_order?: number;
    }): Promise<any>;
}
