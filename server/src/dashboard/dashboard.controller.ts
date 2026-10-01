import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import type { ResponseApi } from '../response/response.interface.js';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get("tiles")
    getDashboardTiles(): Promise<ResponseApi> {
        throw new Error("Not implemented.")
    }
}
