import { IsString, IsNumber, IsArray, IsUUID } from "class-validator";

class UploadFileDto {
    @IsString()
    fileName: string;

    @IsNumber()
    fileSize: number;

    @IsString()
    fileType: string;

    @IsArray()
    @IsNumber({}, { each: true })
    file: number[]; // Array of byte values representing the buffer

    @IsString()
    @IsUUID() // Validates that uploadedBy is a proper user UUID string
    uploadedBy: string;
}

export default UploadFileDto;