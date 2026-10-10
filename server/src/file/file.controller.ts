import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Patch, Post, Put, Req, Res, UploadedFile, UseInterceptors, Optional, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import type UploadFileDto from './file-dto/upload-file.dto.js';
import type UpdateFileDto from './file-dto/update-file.dto.js';
import FileServiceImpl from './file.service.js';
import type { ResponseApi } from '../response/response.interface.js';
import type { File } from '@prisma/client';
import { UserData } from '../auth/user-data.decorator.js';
import type { GenerateTokenType } from '../user/user-auth/auth.service.js';
import { FilePermissionService } from './file-permission.service.js';

@Controller('file')
export class FileController {

    constructor(
        @Optional() private readonly fileService: FileServiceImpl,
        @Optional() private readonly filePermissionService?: FilePermissionService,
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: any, @Body() body: Partial<UploadFileDto>, @UserData() userData: GenerateTokenType): Promise<ResponseApi<File>> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const payload: UploadFileDto = {
            fileName: body.fileName || file?.originalname || 'upload',
            fileSize: body.fileSize ?? file?.size ?? 0,
            fileType: body.fileType || file?.mimetype || 'application/octet-stream',
            accessedBy: body.accessedBy ?? 'ALL',
            file: file?.buffer ?? Buffer.from([]),
            uploadedBy: userData.id,
        };

        const data = await fileService.postFile(payload, payload.uploadedBy);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data as File,
        };
    }

    @Get('files')
    async getFiles(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @UserData() userData: GenerateTokenType,
    ): Promise<ResponseApi<File[]>> {
        const userId: string = userData.id;

        // Convert query strings to numbers just to be safe
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;

        const data = await this.fileService.getFiles(userId, pageNum, limitNum);

        return {
            statusCode: data.statusCode,
            message: data.message,
            data: data.data as File[],
        };
    }

    @Get("/latest-uploads")
    async getLatestfiles(@UserData() userData: GenerateTokenType) {
        const data = await this.fileService.latestFiles(userData.id)
        return {
            message: data?.message,
            statusCode: data?.statusCode,
            data: data?.data
        }
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

    @Post(':id/public-link')
    async createPublicLink(
        @Param('id') id: string,
        @Req() request: Request,
        @UserData() userData: GenerateTokenType,
    ): Promise<ResponseApi<{ publicUrl: string }>> {
        const file = await this.getOwnedFile(id, userData.id);
        const host = request.get('host');
        if (!host) {
            throw new BadRequestException('Unable to determine the public link host');
        }

        const publicUrl = new URL(
            `/file/public/${encodeURIComponent(file.id)}`,
            `${request.protocol}://${host}`,
        ).toString();
        await this.fileService.updateFilePermission(id, 'ALL');

        return {
            statusCode: 200,
            message: 'Public link generated successfully',
            data: { publicUrl },
        };
    }

    @Get('public/:id')
    async getPublicFile(@Param('id') id: string, @Res() response: Response): Promise<void> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const fileResponse = await fileService.getFile(id);
        const file = fileResponse.data as (File & { permission?: { accessedBy: string }[] }) | undefined;
        if (!file?.permission?.some(({ accessedBy }) => accessedBy === 'ALL')) {
            throw new NotFoundException('Public file not found');
        }

        const fileBuffer = Buffer.from(file.buffer);
        response.setHeader('Content-Type', file.fileType);
        response.setHeader('Content-Length', fileBuffer.length);
        response.setHeader(
            'Content-Disposition',
            `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
        );
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.end(fileBuffer);
    }

    @Get(':id/permissions')
    async getFilePermissions(@Param('id') id: string): Promise<ResponseApi> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const data = await fileService.getFilePermissions(id);
        return {
            statusCode: data.statusCode,
            message: data.message,
            data: data.data,
        };
    }

    @Post(':id/permissions')
    async createFilePermission(
        @Param('id') id: string,
        @Body() body: { accessedBy?: string },
        @UserData() userData: GenerateTokenType,
    ): Promise<ResponseApi> {
        const fileService = this.fileService;
        const filePermissionService = this.filePermissionService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }
        if (!filePermissionService) {
            throw new Error('FilePermissionService is not available');
        }

        const fileResponse = await fileService.getFile(id);
        const file = fileResponse.data;
        if (!file || typeof file !== 'object' || !('uploadedBy' in file)
            || file.uploadedBy !== userData.id) {
            throw new ForbiddenException('You can only create permissions for your own files');
        }

        const data = await filePermissionService.create(id, body?.accessedBy);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data,
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

    @Patch(':id/permissions')
    async updateFilePermission(@Param('id') id: string, @Body() body: { accessedBy: string }): Promise<ResponseApi> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const data = await fileService.updateFilePermission(id, body.accessedBy);
        return {
            message: data.message,
            statusCode: data.statusCode,
            data: data.data,
        };
    }

    private async getOwnedFile(id: string, userId: string): Promise<File> {
        const fileService = this.fileService;
        if (!fileService) {
            throw new Error('FileService is not available');
        }

        const fileResponse = await fileService.getFile(id);
        const file = fileResponse.data as File | undefined;
        if (!file || file.uploadedBy !== userId) {
            throw new ForbiddenException('You can only create public links for your own files');
        }
        return file;
    }

}
