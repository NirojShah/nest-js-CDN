import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { DashboardController } from "./dashboard.controller.js";
import DashboardRepository from "./dashboard.repository.js";
import { DashboardService } from "./dashboard.service.js";

@Module({
    imports: [PrismaModule],
    controllers: [DashboardController],
    providers: [
        DashboardService,
        DashboardRepository,
    ],
})
export class DashboardModule { }



{/**
// @Module({
//   imports: [
//     // 🧱 Other Modules this feature needs to function
//   ],
//   controllers: [
//     // 🚦 The Controllers that define this feature's HTTP routes
//   ],
//   providers: [
//     // ⚙️ The Services/Repositories that do the work for THIS module
//   ],
//   exports: [
//     // 🔓 The Services you want to let OTHER modules use
//   ]
// })
// export class FeatureModule {}
     
*/}