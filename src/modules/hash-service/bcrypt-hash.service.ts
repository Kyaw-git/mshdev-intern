import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { HashService } from './hash.service';

@Injectable()
export class BcryptHashService implements HashService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}