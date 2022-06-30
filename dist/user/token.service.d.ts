import { Repository } from 'typeorm';
import { Token } from './token.entity';
export declare class TokenService {
    protected readonly userRepository: Repository<Token>;
    constructor(userRepository: Repository<Token>);
    save(body: any): Promise<any>;
    findOne(options: any): Promise<Token>;
}
