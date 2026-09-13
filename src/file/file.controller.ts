import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type UploadFileDto from './file-dto/upload-file.dto.js';
import type UpdateFileDto from './file-dto/update-file.dto.js';

@Controller('file')
export class FileController {

    @Post('upload')
    uploadFile(@Body() body: UploadFileDto) {
        throw new Error('Method not implemented.');
    }

    @Get("file")
    getFile(@Param("id") id: string) {
        throw new Error('Method not implemented.');
    }

    @Get("files")
    getFiles() {
        throw new Error('Method not implemented.');
    }

    @Delete("file")
    deleteFile(@Param("id") id: string) {
        throw new Error('Method not implemented.');
    }

    @Put("file")
    updateFile(@Param("id") id: string, @Body() body: UpdateFileDto) {
        throw new Error('Method not implemented.');
    }

}
