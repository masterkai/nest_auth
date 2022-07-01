import { ResetService } from './reset.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../user/user.service';
export declare class ResetController {
    private mailerService;
    private resetService;
    private userService;
    constructor(mailerService: MailerService, resetService: ResetService, userService: UserService);
    forgot(email: string): Promise<{
        message: string;
    }>;
    reset(token: string, password: string, password_confirm: string): Promise<{
        message: string;
    }>;
}
