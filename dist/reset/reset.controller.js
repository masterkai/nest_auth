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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetController = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs = require("bcryptjs");
const reset_service_1 = require("./reset.service");
const mailer_1 = require("@nestjs-modules/mailer");
const user_service_1 = require("../user/user.service");
let ResetController = class ResetController {
    constructor(mailerService, resetService, userService) {
        this.mailerService = mailerService;
        this.resetService = resetService;
        this.userService = userService;
    }
    async forgot(email) {
        const token = Math.random().toString(20).substring(2, 12);
        await this.resetService.save({
            email,
            token,
        });
        const url = `http://localhost:3000/reset/${token}`;
        await this.mailerService.sendMail({
            to: email,
            subject: 'Reset your password',
            html: `Click <a href="${url}">here</a> to reset your password!`,
        });
        return {
            message: 'Check your email',
        };
    }
    async reset(token, password, password_confirm) {
        if (password !== password_confirm) {
            throw new common_1.BadRequestException('Password do not match!');
        }
        const reset = await this.resetService.findOne({ token });
        const user = await this.userService.findOne({ email: reset.email });
        if (!user) {
            throw new common_1.NotFoundException('user not found!');
        }
        await this.userService.update(user.id, {
            password: await bcryptjs.hash(password, 12),
        });
        return {
            message: 'success',
        };
    }
};
__decorate([
    (0, common_1.Post)('forgot'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResetController.prototype, "forgot", null);
__decorate([
    (0, common_1.Post)('reset'),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Body)('password_confirm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ResetController.prototype, "reset", null);
ResetController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [mailer_1.MailerService,
        reset_service_1.ResetService,
        user_service_1.UserService])
], ResetController);
exports.ResetController = ResetController;
//# sourceMappingURL=reset.controller.js.map