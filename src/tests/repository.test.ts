
import { randomUUID } from "node:crypto";
import { InMemoryRepository } from "../repositories/repository";
import { User } from "../models/userModel";


describe("InMemoryRepository", () => {
  let repo: InMemoryRepository<User>;

  beforeEach(() => {
    repo = new InMemoryRepository<User>();
  });

  it("creates and retrieves an item", async () => {
    const user = { id: null, name: "Alice", age: 25, hobbies: [] };
    const created = await repo.create(user);

    expect(created.id).not.toBeNull();
    const found = await repo.getById(created.id!);
    expect(found).toEqual(created);
  });

  it("updates existing item", async () => {
    const created = await repo.create({ id: null, name: "Bob", age: 25, hobbies: []  });
    const updated = { ...created, name: "Bobby" };
    const result = await repo.update(updated);

    expect(result?.name).toBe("Bobby");
  });

  it("deletes an item", async () => {
    const created = await repo.create({ id: null, name: "Carol", age: 25, hobbies: []  });
    const deleted = await repo.delete(created.id!);
    const found = await repo.getById(created.id!);

    expect(deleted).toEqual(created);
    expect(found).toBeNull();
  });

  it("returns null when updating non-existing item", async () => {
    const result = await repo.update({ id: randomUUID(), name: "Ghost", age: 25, hobbies: []  });
    expect(result).toBeNull();
  });
});
