import type LoginDto from "../dto/login-dto.js";
import { UserRepository } from "../user.repository.js";
import jwt from "jsonwebtoken"

export type TokenResponse = {
    status: string,
    token?: string,
    statusCode: number
}

class AuthenticateUser {
    private readonly secretKey = "This is the secret key."
    constructor(private readonly userRepository: UserRepository) { }

    async generateToken(loginDto: LoginDto): Promise<TokenResponse> {

        const userExists = await this.userRepository.authenticateUser(loginDto.email, loginDto.password);

        if (userExists == null) {
            return {
                status: "NOT AUTHENTICATED",
                statusCode: 401
            }
        }

        const token = jwt.sign(userExists, this.secretKey, {
            expiresIn: "1d",
            algorithm: "HS256"
        })

        return {
            status: "success",
            token: token,
            statusCode: 200
        }
    }
}

export default AuthenticateUser;