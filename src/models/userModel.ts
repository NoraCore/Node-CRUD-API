import type { UUID } from "node:crypto";

export class User {
  constructor(
    public id: UUID | null,
    public name: string,
    public age: number,
    public hobbies: string[],
  ) {}

  static validate(data: unknown): data is User {
    if (typeof data !== "object" || data === null) return false;
    const obj = data as Record<string, unknown>;
    if (typeof obj.name !== "string" || obj.name.trim() === "") return false;
    if (typeof obj.age !== "number" || obj.age <= 0 || !Number.isInteger(obj.age) || obj.age > 110) return false;
    return !(!Array.isArray(obj.hobbies) || !obj.hobbies.every(h => typeof h === "string"));
  }

  static fromJSON(body: string): User {
    const data = JSON.parse(body);
    if (!User.validate(data)) throw new Error(`Invalid user data: ${data}`);

    return new User(data.id, data.name, data.age, data.hobbies);
  }
}
