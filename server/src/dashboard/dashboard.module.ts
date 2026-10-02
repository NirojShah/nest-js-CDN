import { Module } from "@nestjs/common";
import FileRepository from "../file/file.repository.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { UserRepository } from "../user/user.repository.js";
import { DashboardController } from "./dashboard.controller.js";
import DashboardRepository from "./dashboard.repository.js";
import { DashboardService } from "./dashboard.service.js";

@Module({
    imports: [],
    controllers: [DashboardController],
    providers: [
        UserRepository,
        FileRepository,
        DashboardService,
        DashboardRepository,
        PrismaService
    ],
})
export class DashboardModule { }