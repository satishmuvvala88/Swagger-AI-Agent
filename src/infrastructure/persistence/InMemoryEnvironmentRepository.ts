/**
 * In-memory repository for environment configurations.
 *
 * Note: The domain `EnvironmentConfig` model is not yet implemented in
 * `src/domain/models`. To keep this change isolated to a single file, this
 * repository defines a local `EnvironmentConfig` type that mirrors the
 * expected domain shape. When the domain model is added, this implementation
 * should import and use that type instead.
 */

export interface EnvironmentConfig {
  id: string;
  specId: string; // which spec this environment belongs to
  name: string; // e.g., 'qa', 'prod'
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  authConfig?: Record<string, any>;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class InMemoryEnvironmentRepository {
  private store: Map<string, EnvironmentConfig> = new Map();

  async save(env: EnvironmentConfig): Promise<void> {
    if (this.store.has(env.id)) {
      throw new Error(`Environment with id ${env.id} already exists`);
    }
    const now = new Date().toISOString();
    this.store.set(env.id, { ...env, createdAt: now, updatedAt: now });
  }

  async update(env: EnvironmentConfig): Promise<void> {
    if (!this.store.has(env.id)) {
      throw new Error(`Environment with id ${env.id} not found`);
    }
    const exists = this.store.get(env.id)!;
    const now = new Date().toISOString();
    this.store.set(env.id, { ...exists, ...env, updatedAt: now });
  }

  async getById(envId: string): Promise<EnvironmentConfig | undefined> {
    const env = this.store.get(envId);
    if (!env || env.deleted) return undefined;
    return env;
  }

  async delete(envId: string): Promise<void> {
    const env = this.store.get(envId);
    if (!env) return;
    // logical delete
    this.store.set(envId, { ...env, deleted: true, updatedAt: new Date().toISOString() });
  }

  async listBySpecId(specId: string): Promise<EnvironmentConfig[]> {
    return Array.from(this.store.values()).filter((e) => !e.deleted && e.specId === specId);
  }

  async findByName(specId: string, name: string): Promise<EnvironmentConfig | undefined> {
    const lowerName = name.toLowerCase();
    return Array.from(this.store.values()).find((e) => !e.deleted && e.specId === specId && e.name.toLowerCase() === lowerName);
  }

  async listAll(): Promise<EnvironmentConfig[]> {
    return Array.from(this.store.values()).filter((e) => !e.deleted);
  }

  async count(): Promise<number> {
    return Array.from(this.store.values()).filter((e) => !e.deleted).length;
  }
}

export default InMemoryEnvironmentRepository;
