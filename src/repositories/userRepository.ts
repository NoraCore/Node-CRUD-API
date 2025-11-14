import type { User } from "../models/userModel";
import { InMemoryRepository } from "./repository";

export class UserRepository extends InMemoryRepository<User> {}
