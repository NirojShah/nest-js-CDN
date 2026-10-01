import { Controller, Get } from '@nestjs/common';
import { UserData } from '../auth/user-data.decorator.js';
import type { ResponseApi } from '../response/response.interface.js';
import type { GenerateTokenType } from '../user/user-auth/auth.service.js';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get("tiles")
    async getDashboardTiles(@UserData() userData: GenerateTokenType): Promise<ResponseApi> {
        return this.dashboardService.fetchDashboardTiles(userData.id);
    }
}
