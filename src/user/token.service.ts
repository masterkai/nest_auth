import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    protected readonly userRepository: Repository<Token>,
  ) {}

  async save(body) {
    return this.userRepository.save(body);
  }

  async findOne(options) {
    return this.userRepository.findOne({ where: options });
  }
}
