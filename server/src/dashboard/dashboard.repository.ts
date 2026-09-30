import type { File } from "@prisma/client";
import type { PrismaService } from "../prisma/prisma.service.js";
import type DashboardRepositoryI from "./DashboardRepositoryInterface.js";
import type { LastUploadFile } from "./DashboardRepositoryInterface.js";

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

        return Number(fileSize._sum) || 0;
    }
    async totalFiles(userId: string): Promise<number> {
        throw new Error("Not implemented.")
    }
    async lastUploadedFile(userId: string): Promise<LastUploadFile | null> {
        throw new Error("Not implemented.")
    }
}

export default DashboardRepository;