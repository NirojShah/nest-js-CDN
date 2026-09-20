import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type UploadFileDto from './file-dto/upload-file.dto.js';
import type UpdateFileDto from './file-dto/update-file.dto.js';
import FileServiceImpl from './file.service.js';
import type { ResponseApi } from '../response/response.interface.js';
import type { File } from '@prisma/client';

@Controller('file')
export class FileController {

    constructor(
        private readonly fileService: FileServiceImpl
    ) { }

    @Post('upload')
    async uploadFile(@Body() body: UploadFileDto): Promise<ResponseApi<File>> {
        const userId: string = "testing"
        const data = await this.fileService.postFile(body, userId);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data as File
        }
    }

    @Get("file")
    async getFile(@Param("id") id: string): Promise<ResponseApi<File>> {
        const data = await this.fileService.getFile(id);
        return {
            statusCode: data.statusCode,
            message: data.message,
            data: data.data as File
        }
    }

    @Get("files")
    getFiles() {
        throw new Error('Method not implemented.');
    }

    @Delete("file")
    async deleteFile(@Param("id") id: string): Promise<ResponseApi> {
        const data = await this.fileService.deleteFile(id);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data
        }

    }

    @Put("file")
    async updateFile(@Param("id") id: string, @Body() body: UpdateFileDto): Promise<ResponseApi<File>> {
        const data = await this.fileService.updateFile(id, body);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data as File
        }
    }

}
