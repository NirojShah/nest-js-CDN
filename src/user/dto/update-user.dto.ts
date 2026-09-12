// src/user/dto/update-user.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsEmail({}, { message: 'Invalid email address format' })
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    name?: string;
}