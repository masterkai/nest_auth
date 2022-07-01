import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { TokenService } from './token.service';
export declare class UserController {
    private userService;
    private tokenService;
    private jwtService;
    constructor(userService: UserService, tokenService: TokenService, jwtService: JwtService);
    register(body: any): Promise<any>;
    login(email: string, password: string, response: Response): Promise<{
        token: string;
    }>;
    user(request: Request): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    }>;
    refresh(request: Request, response: Response): Promise<{
        token: string;
    }>;
    logout(request: Request, response: Response): Promise<{
        message: string;
    }>;
}
