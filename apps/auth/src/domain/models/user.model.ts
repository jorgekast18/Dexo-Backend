export class User {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly age: number,
    public readonly gender: string,
    public readonly password: string,
    public readonly id?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static createUser(
    name: string,
    email: string,
    age: number,
    gender: string,
    password: string
  ): User {
    return new User(
      name,
      email,
      age,
      gender,
      password
    );
  }
}
