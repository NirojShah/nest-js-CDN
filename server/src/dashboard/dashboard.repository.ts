import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import type DashboardRepositoryI from "./DashboardRepositoryInterface.js";
import type { LastUploadFile } from "./DashboardRepositoryInterface.js";

@Injectable()
class DashboardRepository implements DashboardRepositoryI {
    constructor(private readonly prisma: PrismaService) {

    }
    async totalFileSizeByUserId(userId: string): Promise<number> {
        const fileSize = await this.prisma.file.aggregate({
            where: {
                uploadedBy: userId
            },
            _sum: {
                fileSize: true
            }
        })

        return Number(fileSize._sum?.fileSize ?? 0);
    }
    async totalFiles(userId: string): Promise<number> {
        const countFiles = await this.prisma.file.count({
            where: {
                uploadedBy: userId
            }
        })

        return Number(countFiles ?? 0);
    }
    async lastUploadedFile(userId: string): Promise<LastUploadFile | null> {
        const latestFile = await this.prisma.file.findFirst({
            where: {
                uploadedBy: userId
            },
            orderBy: {
                uploadedAt: "desc"
            },
            select: {
                fileName: true,
                uploadedAt: true
            }
        })

        return latestFile;
    }
}

export default DashboardRepository;