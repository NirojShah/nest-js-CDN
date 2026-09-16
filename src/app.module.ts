import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { FileController } from './file/file.controller.js';
import { FileModule } from './file/file.module.js';

@Module({
  imports: [UserModule, PrismaModule, FileModule],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule {}
