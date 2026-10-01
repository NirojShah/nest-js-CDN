import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import type UploadFileDto from "./file-dto/upload-file.dto.js";
import type UpdateFileDto from "./file-dto/update-file.dto.js";

@Injectable()
class FileRepository {
    constructor(private readonly prisma: PrismaService) { }

    private normalizeAccessedBy(accessedBy?: string) {
        const value = (accessedBy ?? 'ALL').toString().toUpperCase();
        return value === 'UPLOADER' ? 'UPLOADER' : 'ALL';
    }

    async uploadFile(
        uploadFileDto: UploadFileDto,
        fileBuffer: Buffer,
    ) {


        console.log("------------------------------------------------")

        console.log("uploadFileDto: ", uploadFileDto)
        console.log(uploadFileDto)

        console.log("------------------------------------------------")



        const normalizedBuffer = Buffer.isBuffer(fileBuffer)
            ? fileBuffer
            : Buffer.from(fileBuffer);

        const byteArray = new Uint8Array(normalizedBuffer);

        return this.prisma.file.create({
            data: {
                fileName: uploadFileDto.fileName,
                fileSize: Number(uploadFileDto.fileSize),
                fileType: uploadFileDto.fileType,
                buffer: byteArray,
                uploadedBy: uploadFileDto.uploadedBy,
                permission: {
                    create: [{
                        accessedBy: this.normalizeAccessedBy(uploadFileDto.accessedBy),
                    }],
                },
            },
            include: {
                permission: true,
            },
        });
    }

    async getFiles(uploadBy: string, limit: number = 10, offset: number = 1) {
        
        const files = await this.prisma.file.findMany({
            where: {
                uploadedBy: uploadBy,
            },
            select: {
                id: true,
                fileName: true,
                fileSize: true,
                fileType: true,
                uploadedAt: true
            },
            skip: offset,
            take: limit,
            orderBy: {
                uploadedAt: 'desc',
            },
        });

        return files;
    }
    async fileExists(fileId: string) {
        return await this.prisma.file.findFirst({
            where: {
                id: fileId
            },
            include: {
                permission: true,
            },
        });
    }

    async getFilePermissions(fileId: string) {
        return this.prisma.filePermission.findMany({
            where: { fileId },
            orderBy: { id: 'asc' },
        });
    }

    async updateFilePermission(fileId: string, accessedBy: string) {
        const existingPermission = await this.prisma.filePermission.findFirst({
            where: { fileId },
        });

        if (!existingPermission) {
            return this.prisma.filePermission.create({
                data: {
                    fileId,
                    accessedBy: this.normalizeAccessedBy(accessedBy),
                },
            });
        }

        return this.prisma.filePermission.update({
            where: { id: existingPermission.id },
            data: {
                accessedBy: this.normalizeAccessedBy(accessedBy),
            },
        });
    }

    async updateFile(updateFileDto: UpdateFileDto, fileId: string) {
        const { accessedBy, ...fileData } = updateFileDto;

        const updatedFile = await this.prisma.file.update({
            where: {
                id: fileId
            },
            data: {
                ...fileData
            },
            include: {
                permission: true,
            },
        });

        if (accessedBy) {
            await this.updateFilePermission(fileId, accessedBy);
        }

        return updatedFile;
    }

    async deleteFile(fileId: string) {
        await this.prisma.filePermission.deleteMany({
            where: { fileId },
        });

        return await this.prisma.file.delete({
            where: {
                id: fileId
            }
        });
    }

    async getFilesLatest(uploadedBy: string) {
        return await this.prisma.file.findMany({
            where: {
                uploadedBy: uploadedBy
            },
            orderBy: {
                uploadedAt: "desc"
            },
            take: 7
        })
    }
}

export default FileRepository;