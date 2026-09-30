import type { File } from "@prisma/client";

interface DashboardRepositoryI {
    totalFileSizeByUserId(userId: string): Promise<number>;
    totalFiles(userId: string): Promise<number>;
    lastUploadedFile(userId: string): Promise<File>
}

export default DashboardRepositoryI;