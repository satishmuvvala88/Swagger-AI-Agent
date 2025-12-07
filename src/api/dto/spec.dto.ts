/**
 * DTOs for Spec API endpoints
 *
 * These are request/response shapes used by controllers and routes. They are
 * intentionally simple and serializable (no methods). Controllers and
 * validators may import these types to keep signatures consistent.
 */

export type SpecSourceUrl = { type: 'url'; url: string };
export type SpecSourceFile = { type: 'file'; path: string };
export type SpecSourceGit = { type: 'git'; repo: string; ref?: string; filePath?: string };

export type SpecSourceDto = SpecSourceUrl | SpecSourceFile | SpecSourceGit;

export interface SpecImportRequestDto {
  source: SpecSourceDto;
}

export interface SpecValidateRequestDto {
  specId?: string;
  rawSpec?: string;
}

export interface SpecSummaryDto {
  specId: string;
  title: string;
  version?: string;
  operationCount: number;
}

export interface OperationSummaryDto {
  operationId: string;
  method: string;
  path: string;
  tags?: string[];
  summary?: string;
}

export interface SpecDetailsDto extends SpecSummaryDto {
  servers?: string[];
  tags?: string[];
}

export default {
  SpecImportRequestDto,
  SpecValidateRequestDto,
  SpecSummaryDto,
  OperationSummaryDto,
  SpecDetailsDto,
};
