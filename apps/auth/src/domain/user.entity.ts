export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly age: number,
    public readonly gender: string,
    public readonly passwordHash: string,
  ) {}
}
