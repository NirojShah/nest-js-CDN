import { Module } from '@nestjs/common';
import { FileController } from './file.controller.js';
import FileServiceImpl from './file.service.js';
import { UserService } from '../user/user.service.js';
import FileRepository from './file.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
    imports: [PrismaModule],
    controllers: [FileController],
    providers: [FileServiceImpl, FileRepository],
    exports: [FileServiceImpl],
})
export class FileModule { }
