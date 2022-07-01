import { User } from './user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    protected readonly userRepository: Repository<User>;
    constructor(userRepository: Repository<User>);
    save(body: any): Promise<any>;
    findOne(options: any): Promise<User>;
    update(id: number, options: any): Promise<import("typeorm").UpdateResult>;
}
