// src/module/hash-service/hash.module.ts
import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { BcryptHashService } from './bcrypt-hash.service';

@Module({
  providers: [
    {
      provide: HashService,
      useClass: BcryptHashService,
    },
  ],
  exports: [HashService],
})
export class HashModule {}
