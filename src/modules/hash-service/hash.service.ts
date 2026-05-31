export interface HashService {
  hash(value: string): Promise<string>;
  compare(value: string, hashed: string): Promise<boolean>;
}

export const HashService = Symbol('HashService');