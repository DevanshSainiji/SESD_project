export type UserRole = 'ADMIN' | 'STAFF';

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export class User implements IUser {
  constructor(
    public name: string,
    public email: string,
    public role: UserRole,
    public id?: number,
    public password?: string
  ) {}

  public login() {
    // Logic for login (would involve password verification in a real scenario)
    console.log(`${this.name} logged in as ${this.role}`);
  }
}
