import { NormalizedSpec } from '../models/NormalizedSpec';

/**
 * Repository interface for NormalizedSpec persistence.
 *
 * Implementations (in-memory, DB adapters) should adhere to this contract.
 */
export interface SpecRepository {
  /**
   * Persist a new spec.
   */
  save(spec: NormalizedSpec): Promise<void>;

  /**
   * Update an existing spec. Throw or return false if not found depending on implementation.
   */
  update(spec: NormalizedSpec): Promise<void>;

  /**
   * Retrieve a spec by id, or undefined if not found.
   */
  getById(specId: string): Promise<NormalizedSpec | undefined>;

  /**
   * Delete (logical or physical) a spec by id.
   */
  delete(specId: string): Promise<void>;

  /**
   * List specs with optional pagination and filter by title substring.
   */
  list(options?: { offset?: number; limit?: number; titleContains?: string }): Promise<NormalizedSpec[]>;

  /**
   * Find specs by tag name.
   */
  findByTag(tag: string): Promise<NormalizedSpec[]>;

  /**
   * Count total specs.
   */
  count(): Promise<number>;
}

export type SpecRepositoryFactory = () => SpecRepository;
