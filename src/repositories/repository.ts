import { type UUID, randomUUID } from "node:crypto";

export interface Repository<T extends { id: UUID | null }> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(item: T): Promise<T | null>;
  delete(id: UUID): Promise<T | null>;
}

export class InMemoryRepository<T extends { id: UUID | null }> implements Repository<T> {
  private items: Map<string, T> = new Map();

  async create(item: T): Promise<T> {
    const id = randomUUID()
    this.items.set(id, item)
    return item;
  }

  async delete(id: UUID): Promise<T | null> {
    const item = this.getById(id);
    if (!item){
      return null
    }
    return this.items.delete(id) ? item : null;
  }

  async getAll(): Promise<T[]> {
    return Array.from(this.items.values())
  }

  async update(item: T): Promise<T | null> {
    if (item.id===null || !this.items.has(item.id)){
      return null
    }
    this.items.set(item.id, item);
    return item;
  }

  async getById(id: string): Promise<T | null> {
    return this.items.get(id) || null;
  }
}