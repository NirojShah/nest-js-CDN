import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { FileController } from './file/file.controller.js';
import { FileModule } from './file/file.module.js';
import { AuthGuard } from './auth/auth.guard.js';
import { DashboardController } from './dashboard/dashboard.controller.js';
import { DashboardService } from './dashboard/dashboard.service.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
@Module({
  imports: [UserModule, PrismaModule, FileModule, DashboardModule
  ],
  controllers: [AppController, FileController, DashboardController,
  ],
  providers: [AppService, AuthGuard, DashboardService
  ],
})
export class AppModule { }