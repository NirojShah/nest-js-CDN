import { Injectable } from "@nestjs/common";
import type { ResponseApi } from "../response/response.interface.js";
import type UpdateFileDto from "./file-dto/update-file.dto.js";
import type UploadFileDto from "./file-dto/upload-file.dto.js";

interface FileService {
    postFile(uploadFileDto: UploadFileDto, userId: string): Promise<ResponseApi>;
    getFile(fileId: string): Promise<ResponseApi>;
    getFiles(): Promise<ResponseApi>;
    deleteFile(fileId: string): Promise<ResponseApi>;
    updateFile(fileId: string, updateFileDto: UpdateFileDto): Promise<ResponseApi>;
}

@Injectable()
class FileServiceImpl implements FileService {
    constructor(private readonly fileRepository: any) { }
    postFile(uploadFileDto: UploadFileDto, userId: string): Promise<ResponseApi> {
        throw new Error("Method not implemented.");
    }
    getFile(fileId: string): Promise<ResponseApi> {
        throw new Error("Method not implemented.");
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