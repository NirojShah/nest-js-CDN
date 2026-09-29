import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { UserRepository } from '../user/user.repository.js';
import FileRepository from '../file/file.repository.js';
import { DashboardService } from './dashboard.service.js';

@Module({
    controllers: [DashboardController],
    providers: [UserRepository, FileRepository, DashboardService],
})
export class DashboardModule { }
