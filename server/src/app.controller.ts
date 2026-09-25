// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { ResponseApi } from './response/response.interface.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/status')
  async status(): Promise<ResponseApi<null>> {
    return {
      statusCode: 200,
      message: this.getHello(),
      data: null,
    };
  }
}