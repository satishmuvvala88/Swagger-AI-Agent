import { NormalizedSpec, createNormalizedSpec, Operation as NormalizedOperation } from '../../domain/models/NormalizedSpec';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, '') // Remove all non-word chars
    .replace(/\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function buildServersFromSwagger2(spec: any): string[] {
  const schemes = spec.schemes || ['https'];
  const host = spec.host || '';
  const basePath = spec.basePath || '';
  const servers: string[] = [];
  schemes.forEach((scheme: string) => {
    const url = `${scheme}://${host}${basePath}`;
    servers.push(url);
  });
  return servers;
}

function extractOperations(specObj: any): NormalizedOperation[] {
  const ops: NormalizedOperation[] = [];
  const paths = specObj.paths || {};
  Object.keys(paths).forEach((path) => {
    const pathItem = paths[path] || {};
    // combine possible path-level parameters
    const pathParameters = pathItem.parameters || [];
    Object.keys(pathItem).forEach((methodRaw) => {
      const method = methodRaw.toUpperCase();
      // ignore non-http-method keys
      if (['PARAMETERS', 'SUMMARY', 'DESCRIPTION'].includes(method)) return;
      if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'].includes(method)) return;

      const op = pathItem[methodRaw];
      if (!op) return;

      const operationId = op.operationId || `${method}_${path}`;
      const tags = op.tags || [];
      const summary = op.summary || op.description || '';

      // parameters: combine path-level and operation-level
      const parameters = Array.isArray(pathParameters) ? [...pathParameters] : [];
      if (Array.isArray(op.parameters)) parameters.push(...op.parameters);

      // requestBody: OpenAPI 3 uses requestBody, Swagger 2 uses parameters with in: 'body'
      let requestBody = null;
      if (op.requestBody) {
        requestBody = op.requestBody;
      } else if (Array.isArray(op.parameters)) {
        const bodyParam = op.parameters.find((p: any) => p.in === 'body');
        if (bodyParam) requestBody = bodyParam;
      }

      const responses = op.responses || {};
      const security = op.security || specObj.security || [];

      ops.push({
        operationId,
        method,
        path,
        tags,
        summary,
        description: op.description,
        parameters,
        requestBody,
        responses,
        security,
      });
    });
  });
  return ops;
}

/**
 * Normalize a parsed OpenAPI/Swagger object into the domain NormalizedSpec.
 * Accepts either a parsed object or an adapter result containing `parsed`.
 */
export function normalize(parsedSpecOrAdapterResult: any, options?: { specId?: string }): NormalizedSpec {
  const source = parsedSpecOrAdapterResult && parsedSpecOrAdapterResult.parsed ? parsedSpecOrAdapterResult.parsed : parsedSpecOrAdapterResult;

  const info = source.info || {};
  const title = info.title || source.title || 'Unnamed API';
  const version = info.version || source.version || source.openapi || source.swagger || '0.0.0';

  let servers: string[] = [];
  if (Array.isArray(source.servers) && source.servers.length > 0) {
    servers = source.servers.map((s: any) => (typeof s === 'string' ? s : s.url)).filter(Boolean);
  } else if (source.swagger) {
    servers = buildServersFromSwagger2(source);
  }

  // tags: prefer declared tags, otherwise aggregate from operations
  const declaredTags = Array.isArray(source.tags) ? source.tags.map((t: any) => (typeof t === 'string' ? t : t.name)) : [];
  const operations = extractOperations(source);
  const opTags = Array.from(new Set(operations.flatMap((o) => o.tags || [])));
  const tags = declaredTags.length > 0 ? declaredTags : opTags;

  const id = options?.specId || `${slugify(title)}-${Date.now()}`;

  const normalized = createNormalizedSpec({
    id,
    title,
    version,
    servers,
    tags,
    operations,
    raw: source,
  });

  return normalized;
}

export default { normalize };
