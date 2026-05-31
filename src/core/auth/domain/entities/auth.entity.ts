import { Role } from '@prisma/client';

export interface AuthProps {
  id?: string;
  name: string | null;
  email: string;
  password: string;
  role: Role;
  created_at?: Date;
  updated_at?: Date;
}

export class Auth {
  constructor(
    public readonly id: string,
    public name: string | null,
    public password: string,
    public email: string,
    public role: Role,
    public created_at: Date,
    public updated_at: Date,
  ) {}

  static create(props: Partial<AuthProps>): Auth {
    return new Auth(
      props.id!,
      props.name ?? null,
      props.password!,
      props.email!,
      props.role ?? Role.USER,
      props.created_at ?? new Date(),
      props.updated_at ?? new Date(),
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
