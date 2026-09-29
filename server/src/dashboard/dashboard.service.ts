import { Injectable } from '@nestjs/common';
import type { ResponseApi } from '../response/response.interface.js';

interface DashboardserviceI {
    fetchDashboardTiles(): Promise<ResponseApi>
}

@Injectable()
export class DashboardService implements DashboardserviceI {

    fetchDashboardTiles(): Promise<ResponseApi> {
        throw new Error("Not implemented.")
    }
}
