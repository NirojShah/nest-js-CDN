import { Injectable } from '@nestjs/common';
import type { ResponseApi } from '../response/response.interface.js';
import DashboardRepository from './dashboard.repository.js';

interface DashboardserviceI {
    fetchDashboardTiles(userId: string): Promise<ResponseApi>
}

@Injectable()
export class DashboardService implements DashboardserviceI {

    constructor(private readonly dashboardRepository: DashboardRepository) { }

    async fetchDashboardTiles(userId: string): Promise<ResponseApi> {
        const totalFileSizeByUser = await this.dashboardRepository.totalFileSizeByUserId(userId);
        const totalFiles = await this.dashboardRepository.totalFiles(userId);
        const lastUploadedFile = await this.dashboardRepository.lastUploadedFile(userId)

        return {
            statusCode: 200,
            message: "successfully fetched dashboard tiles.",
            data: {
                size: totalFileSizeByUser,
                totalFiles,
                lastUploadedFile
            }
        }
    }
}
