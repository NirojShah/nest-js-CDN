// src/user/user.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import type { ResponseApi } from '../response/response.interface.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js'; 
import type { User } from '@prisma/client';
import { UserRepository } from './user.repository.js';
import { createResponse } from '../common/utils/response.util.js';

export interface UserServiceInterface {
    createUser(createUserDto: CreateUserDto): Promise<ResponseApi<User>>;
    findAllUsers(): Promise<ResponseApi<User[]>>;
    findUserById(id: string): Promise<ResponseApi<User>>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ResponseApi<User>>;
    deleteUser(id: string): Promise<ResponseApi<null>>;
}

@Injectable()
export class UserService implements UserServiceInterface {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto): Promise<ResponseApi<User>> {
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const user = await this.userRepository.create(createUserDto);
        return createResponse('User created successfully', user, 201);
    }

    async findAllUsers(): Promise<ResponseApi<User[]>> {
        const users = await this.userRepository.findAll();
        return createResponse('Users retrieved successfully', users);
    }

    async findUserById(id: string): Promise<ResponseApi<User>> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return createResponse('User retrieved successfully', user);
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<ResponseApi<User>> {
        await this.findUserById(id); // Throws 404 if user doesn't exist
        
        if (updateUserDto.email) {
            const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email is already in use by another account');
            }
        }

        const updatedUser = await this.userRepository.update(id, updateUserDto);
        return createResponse('User updated successfully', updatedUser);
    }

    async deleteUser(id: string): Promise<ResponseApi<null>> {
        await this.findUserById(id); // Throws 404 if user doesn't exist
        await this.userRepository.delete(id);
        return createResponse('User deleted successfully', null);
    }
}