import { UUID } from 'node:crypto';

export class User {
  id: UUID;
  name: string;
  email: string;
  age: number;
  hobbies: string[];

  static fromJSON(body) {
    return new User();
  }
}
