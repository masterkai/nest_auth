import { Repository } from 'typeorm';
import { Token } from './token.entity';
export declare class TokenService {
    protected readonly tokenRepository: Repository<Token>;
    constructor(tokenRepository: Repository<Token>);
    save(body: any): Promise<any>;
    findOne(options: any): Promise<Token>;
    delete(options: any): Promise<import("typeorm").DeleteResult>;
}
