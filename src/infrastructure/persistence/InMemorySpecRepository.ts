import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { NormalizedSpec } from '../../domain/models/NormalizedSpec';

export class InMemorySpecRepository implements SpecRepository {
  private store: Map<string, NormalizedSpec> = new Map();

  async save(spec: NormalizedSpec): Promise<void> {
    if (this.store.has(spec.id)) {
      throw new Error(`Spec with id ${spec.id} already exists`);
    }
    this.store.set(spec.id, spec);
  }

  async update(spec: NormalizedSpec): Promise<void> {
    if (!this.store.has(spec.id)) {
      throw new Error(`Spec with id ${spec.id} not found`);
    }
    this.store.set(spec.id, spec);
  }

  async getById(specId: string): Promise<NormalizedSpec | undefined> {
    return this.store.get(specId);
  }

  async delete(specId: string): Promise<void> {
    this.store.delete(specId);
  }

  async list(options?: { offset?: number; limit?: number; titleContains?: string }): Promise<NormalizedSpec[]> {
    const all = Array.from(this.store.values());
    let filtered = all;
    if (options?.titleContains) {
      const substr = options.titleContains.toLowerCase();
      filtered = filtered.filter((s) => s.title.toLowerCase().includes(substr));
    }
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? filtered.length;
    return filtered.slice(offset, offset + limit);
  }

  async findByTag(tag: string): Promise<NormalizedSpec[]> {
    const tagLower = tag.toLowerCase();
    return Array.from(this.store.values()).filter((s) => (s.tags || []).some((t) => t.toLowerCase() === tagLower));
  }

  async count(): Promise<number> {
    return this.store.size;
  }
}

export default InMemorySpecRepository;
