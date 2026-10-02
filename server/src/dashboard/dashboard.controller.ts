import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import type { ResponseApi } from '../response/response.interface.js';
import { UserData } from '../auth/user-data.decorator.js';
import type { GenerateTokenType } from '../user/user-auth/auth.service.js';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get("tiles")
    async getDashboardTiles(@UserData() userData: GenerateTokenType): Promise<ResponseApi> {
        const response = await this.dashboardService.fetchDashboardTiles(userData.id)
        return {
            message: response.message,
            statusCode: response.statusCode,
            data: response.data
        }
    }
}
