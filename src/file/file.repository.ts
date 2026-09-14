import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import type UploadFileDto from "./file-dto/upload-file.dto.js";
import type UpdateFileDto from "./file-dto/update-file.dto.js";

@Injectable()
class FileRepository {
    constructor(private readonly prisma: PrismaService) { }

    async uploadFile(
        uploadFileDto: UploadFileDto,
        fileBuffer: Buffer,
    ) {
        const arrayBuffer = new ArrayBuffer(fileBuffer.byteLength);
        const uint8Array = new Uint8Array(arrayBuffer);

        uint8Array.set(fileBuffer);

        return this.prisma.file.create({
            data: {
                fileName: uploadFileDto.fileName,
                fileSize: uploadFileDto.fileSize,
                fileType: uploadFileDto.fileType,
                buffer: uint8Array,
                uploadedBy: uploadFileDto.uploadedBy,
            },
        });
    }

    async fileExists(fileId: string) {
        return await this.prisma.file.findFirst({
            where: {
                id: fileId
            }
        });
    }

    async updateFile(updateFileDto: UpdateFileDto, fileId: string) {
        return await this.prisma.file.update({
            where: {
                id: fileId
            },
            data: {
                ...updateFileDto
            }
        })
    }

    async deleteFile(fileId: string) {
        return await this.prisma.file.delete({
            where: {
                id: fileId
            }
        });
    }
}

export default FileRepository;