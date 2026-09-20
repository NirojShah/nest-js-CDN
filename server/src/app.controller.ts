// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { ResponseApi } from './response/response.interface.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/status')
  async status(): Promise<ResponseApi<null>> {
    return {
      statusCode: 200,
      message: this.appService.getHello(), // "Server is running smoothly!"
      data: null,
    };
  }
}