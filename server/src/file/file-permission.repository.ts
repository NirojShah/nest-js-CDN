import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export enum FileAccessedBy {
  ALL = 'ALL',
  UPLOADER = 'UPLOADER',
}

@Injectable()
export class FilePermissionRepository {
  constructor(private readonly prisma: PrismaService) { }

  private normalizeAccessedBy(accessedBy?: string | FileAccessedBy): FileAccessedBy {
    const value = (accessedBy ?? FileAccessedBy.ALL).toString().toUpperCase();

    if (value === FileAccessedBy.UPLOADER) {
      return FileAccessedBy.UPLOADER;
    }

    return FileAccessedBy.ALL;
  }

  async getByFileId(fileId: string) {
    return this.prisma.filePermission.findMany({
      where: { fileId },
      orderBy: { id: 'asc' },
    });
  }

  async getByFileIdAndAccess(fileId: string, accessedBy: string | FileAccessedBy) {
    return this.prisma.filePermission.findFirst({
      where: {
        fileId,
        accessedBy: this.normalizeAccessedBy(accessedBy),
      },
    });
  }

  async create(fileId: string, accessedBy: string | FileAccessedBy = FileAccessedBy.ALL) {
    return this.prisma.filePermission.create({
      data: {
        fileId,
        accessedBy: this.normalizeAccessedBy(accessedBy),
      },
    });
  }

  async updateByFileId(fileId: string, accessedBy: string | FileAccessedBy) {
    const existingPermission = await this.prisma.filePermission.findFirst({
      where: { fileId },
    });

    if (!existingPermission) {
      return this.create(fileId, accessedBy);
    }

    return this.prisma.filePermission.update({
      where: { id: existingPermission.id },
      data: {
        accessedBy: this.normalizeAccessedBy(accessedBy),
      },
    });
  }

  async deleteByFileId(fileId: string) {
    const permissions = await this.getByFileId(fileId);

    if (!permissions.length) {
      return null;
    }

    await this.prisma.filePermission.deleteMany({
      where: { fileId },
    });

    return permissions;
  }
}

export default FilePermissionRepository;
