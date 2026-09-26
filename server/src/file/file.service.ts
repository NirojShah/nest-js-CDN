import { Injectable } from "@nestjs/common";
import type { ResponseApi } from "../response/response.interface.js";
import type UpdateFileDto from "./file-dto/update-file.dto.js";
import type UploadFileDto from "./file-dto/upload-file.dto.js";
import FileRepository from "./file.repository.js";

interface FileService {
    postFile(uploadFileDto: UploadFileDto, userId: string): Promise<ResponseApi>;
    getFile(fileId: string): Promise<ResponseApi>;
    getFiles(): Promise<ResponseApi>;
    getFilePermissions(fileId: string): Promise<ResponseApi>;
    deleteFile(fileId: string): Promise<ResponseApi>;
    updateFile(fileId: string, updateFileDto: UpdateFileDto): Promise<ResponseApi>;
    updateFilePermission(fileId: string, accessedBy: string): Promise<ResponseApi>;
}

@Injectable()
class FileServiceImpl implements FileService {
    constructor(private readonly fileRepository: FileRepository) { }

    async postFile(uploadFileDto: UploadFileDto, userId: string): Promise<ResponseApi> {

        try {
            const fileBuffer = Buffer.isBuffer(uploadFileDto.file)
                ? uploadFileDto.file
                : Buffer.from(uploadFileDto.file ?? []);

            const response = await this.fileRepository.uploadFile(
                {
                    ...uploadFileDto,
                    accessedBy: uploadFileDto.accessedBy ?? 'ALL',
                    uploadedBy: uploadFileDto.uploadedBy ?? userId,
                },
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

    async getFiles(): Promise<ResponseApi> {
        const files = await this.fileRepository.getFiles();
        return {
            statusCode: 200,
            message: "Files retrieved successfully",
            data: files,
        };
    }

    async getFilePermissions(fileId: string): Promise<ResponseApi> {
        const file = await this.fileRepository.fileExists(fileId);
        if (!file) {
            throw new Error("File not found");
        }

        const permissions = await this.fileRepository.getFilePermissions(fileId);
        return {
            statusCode: 200,
            message: "File permissions retrieved successfully",
            data: permissions,
        };
    }

    async deleteFile(fileId: string): Promise<ResponseApi> {
        const file = await this.fileRepository.fileExists(fileId);
        if (!file) {
            throw new Error("File not found");
        }
        await this.fileRepository.deleteFile(fileId);
        return {
            statusCode: 201,
            message: "File deleted successfully",
            data: null
        };
    }

    async updateFile(fileId: string, updateFileDto: UpdateFileDto): Promise<ResponseApi> {
        const fileExists = await this.fileRepository.fileExists(fileId)
        if (!fileExists) {
            throw new Error("File not found");
        }

        const updatedFile = await this.fileRepository.updateFile(updateFileDto, fileId);

        return {
            statusCode: 200,
            message: "File updated successfully.",
            data: updatedFile
        }
    }

    async updateFilePermission(fileId: string, accessedBy: string): Promise<ResponseApi> {
        const fileExists = await this.fileRepository.fileExists(fileId);
        if (!fileExists) {
            throw new Error("File not found");
        }

        const updatedPermission = await this.fileRepository.updateFilePermission(fileId, accessedBy);

        return {
            statusCode: 200,
            message: "File permission updated successfully",
            data: updatedPermission,
        };
    }
}

export default FileServiceImpl;