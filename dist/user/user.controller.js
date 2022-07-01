"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const bcryptjs = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const token_service_1 = require("./token.service");
const typeorm_1 = require("typeorm");
let UserController = class UserController {
    constructor(userService, tokenService, jwtService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.jwtService = jwtService;
    }
    async register(body) {
        if (body.password !== body.password_confirm) {
            throw new common_1.BadRequestException('Password do not match!');
        }
        const user = await this.userService.findOne({ email: body.email });
        if (user) {
            throw new common_1.BadRequestException('user existed, login please!!');
        }
        return this.userService.save({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: await bcryptjs.hash(body.password, 12),
        });
    }
    async login(email, password, response) {
        const user = await this.userService.findOne({
            email,
        });
        if (!user) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        if (!(await bcryptjs.compare(password, user.password))) {
            throw new common_1.BadRequestException('invalid credentials');
        }
        const accessToken = await this.jwtService.signAsync({
            id: user.id,
        }, { expiresIn: '30s' });
        const refreshToken = await this.jwtService.signAsync({
            id: user.id,
        }, { expiresIn: '30s' });
        const expired_at = new Date();
        expired_at.setDate(expired_at.getDate() + 7);
        await this.tokenService.save({
            user_id: user.id,
            token: refreshToken,
            created_at: new Date(),
            expired_at,
        });
        response.status(200);
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
            token: accessToken,
        };
    }
    async user(request) {
        try {
            const accessToken = request.headers.authorization.replace('Bearer ', '');
            const { id } = await this.jwtService.verifyAsync(accessToken);
            const _a = await this.userService.findOne({ id }), { password } = _a, data = __rest(_a, ["password"]);
            return data;
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
    async refresh(request, response) {
        try {
            const refreshToken = request.cookies['refresh_token'];
            const { id } = await this.jwtService.verifyAsync(refreshToken);
            const tokenEntity = await this.tokenService.findOne({
                user_id: id,
                expired_at: (0, typeorm_1.MoreThanOrEqual)(new Date()),
            });
            if (!tokenEntity) {
                throw new common_1.UnauthorizedException();
            }
            const accessToken = await this.jwtService.signAsync({
                id,
            }, { expiresIn: '30s' });
            response.status(200);
            return { token: accessToken };
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
    async logout(request, response) {
        await this.tokenService.delete({ token: request.cookies['refresh_token'] });
        response.clearCookie('refresh_token');
        return {
            message: 'success',
        };
    }
};
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "user", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        token_service_1.TokenService,
        jwt_1.JwtService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map