import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, Optional } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type UploadFileDto from './file-dto/upload-file.dto.js';
import type UpdateFileDto from './file-dto/update-file.dto.js';
import FileServiceImpl from './file.service.js';
import type { ResponseApi } from '../response/response.interface.js';
import type { File } from '@prisma/client';

@Controller('file')
export class FileController {

    constructor(
        @Optional() private readonly fileService?: FileServiceImpl,
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: any, @Body() body: Partial<UploadFileDto>): Promise<ResponseApi<File>> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const payload: UploadFileDto = {
            fileName: body.fileName || file?.originalname || 'upload',
            fileSize: body.fileSize ?? file?.size ?? 0,
            fileType: body.fileType || file?.mimetype || 'application/octet-stream',
            file: file?.buffer ?? Buffer.from([]),
            uploadedBy: body.uploadedBy ?? 'system',
        };

        const data = await fileService.postFile(payload, payload.uploadedBy);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data as File,
        };
    }

    @Get(':id')
    async getFile(@Param('id') id: string): Promise<ResponseApi<File>> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const data = await fileService.getFile(id);
        return {
            statusCode: data.statusCode,
            message: data.message,
            data: data.data as File,
        };
    }

    @Get('files')
    async getFiles(): Promise<ResponseApi<File[]>> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const data = await fileService.getFiles();
        return {
            statusCode: data.statusCode,
            message: data.message,
            data: data.data as File[],
        };
    }

    @Delete(':id')
    async deleteFile(@Param('id') id: string): Promise<ResponseApi> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const data = await fileService.deleteFile(id);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data,
        };
    }

    @Put(':id')
    async updateFile(@Param('id') id: string, @Body() body: UpdateFileDto): Promise<ResponseApi<File>> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const data = await fileService.updateFile(id, body);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data as File,
        };
    }

}
