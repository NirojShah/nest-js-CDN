import { Module } from '@nestjs/common';
import { FileController } from './file.controller.js';
import FileServiceImpl from './file.service.js';
import FileRepository from './file.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { FilePermissionRepository } from './file-permission.repository.js';
import { FilePermissionService } from './file-permission.service.js';

@Module({
    imports: [PrismaModule],
    controllers: [FileController],
    providers: [FileServiceImpl, FileRepository, FilePermissionRepository, FilePermissionService],
    exports: [FileServiceImpl, FilePermissionService],
})
export class FileModule { }
