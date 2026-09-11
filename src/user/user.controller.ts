// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { ResponseApi } from '../response/response.interface.js';
import type { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseApi<User>> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAllUsers(): Promise<ResponseApi<User[]>> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async findUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseApi<User>> {
    return this.userService.findUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseApi<User>> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseApi<null>> {
    return this.userService.deleteUser(id);
  }
}