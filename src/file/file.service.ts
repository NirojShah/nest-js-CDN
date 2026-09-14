import { Injectable } from "@nestjs/common";
import type { ResponseApi } from "../response/response.interface.js";
import type UpdateFileDto from "./file-dto/update-file.dto.js";
import type UploadFileDto from "./file-dto/upload-file.dto.js";
import type FileRepository from "./file.repository.js";

interface FileService {
    postFile(uploadFileDto: UploadFileDto, userId: string): Promise<ResponseApi>;
    getFile(fileId: string): Promise<ResponseApi>;
    getFiles(): Promise<ResponseApi>;
    deleteFile(fileId: string): Promise<ResponseApi>;
    updateFile(fileId: string, updateFileDto: UpdateFileDto): Promise<ResponseApi>;
}

@Injectable()
class FileServiceImpl implements FileService {
    constructor(private readonly fileRepository: FileRepository) { }

    async postFile(uploadFileDto: UploadFileDto, userId: string): Promise<ResponseApi> {

        try {
            const fileBuffer = Buffer.from(uploadFileDto.file);

            const response = await this.fileRepository.uploadFile(
                uploadFileDto,
                fileBuffer
            );

            if (!response) {
                throw new Error("File upload failed");
            }

            return {
                statusCode: 201,
                message: "File uploaded successfully",
                data: response
            };

        } catch (error) {
            throw error;
        }
    }

    async getFile(fileId: string): Promise<ResponseApi> {
        const file = await this.fileRepository.fileExists(fileId);
        if (!file) {
            throw new Error("File not found");
        }
        return {
            statusCode: 200,
            message: "File retrieved successfully",
            data: file
        };
    }
    getFiles(): Promise<ResponseApi> {
        throw new Error("Method not implemented.");
    }
    deleteFile(fileId: string): Promise<ResponseApi> {
        throw new Error("Method not implemented.");
    }
    updateFile(fileId: string, updateFileDto: UpdateFileDto): Promise<ResponseApi> {
        throw new Error("Method not implemented.");
    }
}

export default FileServiceImpl;