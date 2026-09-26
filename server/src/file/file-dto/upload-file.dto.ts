import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

class UploadFileDto {
    @IsString()
    fileName: string;

    @IsNumber()
    fileSize: number;

    @IsString()
    fileType: string;

    @IsOptional()
    @IsString()
    accessedBy?: string;

    @IsArray()
    @IsNumber({}, { each: true })
    file: Buffer; // Array of byte values representing the buffer

    @IsString()
    @IsUUID() // Validates that uploadedBy is a proper user UUID string
    uploadedBy: string;
}

export default UploadFileDto;