import { Injectable, Optional } from '@nestjs/common';
import type { FilePermission } from '@prisma/client';
import { createResponse } from '../common/utils/response.util.js';
import type { ResponseApi } from '../response/response.interface.js';
import { FileAccessedBy, FilePermissionRepository } from './file-permission.repository.js';

export { FileAccessedBy };

@Injectable()
export class FilePermissionService {
  constructor(@Optional() private readonly filePermissionRepository?: FilePermissionRepository) { }

  private getRepository(): FilePermissionRepository {
    const repository = this.filePermissionRepository;

    if (!repository) {
      throw new Error('FilePermissionRepository is not available');
    }

    return repository;
  }

  async getByFileId(fileId: string): Promise<ResponseApi<FilePermission[]>> {
    const repository = this.getRepository();
    const permissions = await repository.getByFileId(fileId);

    return createResponse('File permissions retrieved successfully', permissions);
  }

  async getFilePermissions(fileId: string): Promise<ResponseApi<FilePermission[]>> {
    return this.getByFileId(fileId);
  }

  async create(fileId: string, accessedBy: FileAccessedBy | string = FileAccessedBy.ALL): Promise<ResponseApi<FilePermission>> {
    const repository = this.getRepository();
    const permission = await repository.create(fileId, accessedBy);

    return createResponse('File permission created successfully', permission, 201);
  }

  async createPermission(fileId: string, accessedBy: FileAccessedBy | string = FileAccessedBy.ALL): Promise<ResponseApi<FilePermission>> {
    return this.create(fileId, accessedBy);
  }

  async updateByFileId(fileId: string, accessedBy: FileAccessedBy | string): Promise<ResponseApi<FilePermission>> {
    const repository = this.getRepository();
    const permission = await repository.updateByFileId(fileId, accessedBy);

    return createResponse('File permission updated successfully', permission);
  }

  async updatePermission(fileId: string, accessedBy: FileAccessedBy | string): Promise<ResponseApi<FilePermission>> {
    return this.updateByFileId(fileId, accessedBy);
  }

  async deleteByFileId(fileId: string): Promise<ResponseApi<null>> {
    const repository = this.getRepository();
    await repository.deleteByFileId(fileId);

    return createResponse('File permission deleted successfully', null);
  }

  async deletePermission(fileId: string): Promise<ResponseApi<null>> {
    return this.deleteByFileId(fileId);
  }
}

export default FilePermissionService;
