import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

class LoginDto {
    @IsEmail({}, { message: 'Invalid email address format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "password is required." })
    @MinLength(8, { message: "Password must be 8 characters long." })
    password: string
}

export default LoginDto;