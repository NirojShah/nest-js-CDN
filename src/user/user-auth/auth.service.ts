import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";
import type LoginDto from "../dto/login-dto.js";
import { UserRepository } from "../user.repository.js";

export type TokenResponse = {
    status: string;
    token?: string;
    statusCode: number;
};

export type GenerateTokenType = {
    email: string;
    name: string;
    id: string;
};

@Injectable()
class AuthenticateUser {

    private readonly secretKey =
        process.env.JWT_SECRET ?? "This is the secret key.";
    async generateToken(
        userDetails: GenerateTokenType
    ): Promise<TokenResponse> {

        const token = jwt.sign(
            userDetails,
            this.secretKey,
            {
                expiresIn: "1d",
                algorithm: "HS256",
            }
        );

        return {
            status: "success",
            token,
            statusCode: 200,
        };
    }
}

export default AuthenticateUser;