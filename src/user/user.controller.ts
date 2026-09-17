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
import type LoginDto from './dto/login-dto.js';
import AuthenticateUser from './user-auth/auth.service.js';
import type { GenerateTokenType } from './user-auth/auth.service.js';
import { UserData } from '../auth/user-data.decorator.js';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly AuthService: AuthenticateUser
  ) { }

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

  @Post("/login")
  async login(@Body() loginDto: LoginDto): Promise<ResponseApi> {
    const data = await this.userService.loginUser(loginDto);
    const generateToken = await this.AuthService.generateToken(data as GenerateTokenType)

    if (generateToken.status == "success") {
      return {
        message: "successfully logged in.",
        statusCode: 201,
        data: {
          token: generateToken.token
        }
      }
    }

    throw new Error("Failed to login.")
  }

  @Get("/testing")
  async testApi(@UserData() userData: GenerateTokenType) {
    console.log(userData)
  }
}