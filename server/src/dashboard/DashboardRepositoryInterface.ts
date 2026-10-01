export type LastUploadFile = {
    fileName: string;
    uploadedAt: Date
}

interface DashboardRepositoryI {
    totalFileSizeByUserId(userId: string): Promise<number>;
    totalFiles(userId: string): Promise<number>;
    lastUploadedFile(userId: string): Promise<LastUploadFile | null>
}

export default DashboardRepositoryI;