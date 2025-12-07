import http from 'http';
import https from 'https';
import { URL } from 'url';
import fs from 'fs/promises';

/**
 * Load raw spec content from a URL. Returns the response body as string.
 */
export async function loadFromUrl(urlStr: string, timeoutMs = 10000): Promise<string> {
  const url = new URL(urlStr);
  const client = url.protocol === 'http:' ? http : https;

  return new Promise<string>((resolve, reject) => {
    const req = client.get(url, { timeout: timeoutMs }, (res) => {
      const { statusCode = 0 } = res;
      if (statusCode < 200 || statusCode >= 300) {
        reject(new Error(`Request failed. Status code: ${statusCode}`));
        res.resume();
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve(body);
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy(new Error('Request timed out'));
    });
  });
}

/**
 * Load raw spec content from a local file path. Returns file contents as string.
 */
export async function loadFromFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath, { encoding: 'utf8' });
  return content;
}

/**
 * Stub: load a spec file from a Git repository.
 *
 * For Phase 1/2 we provide a stub. Implementations can later use `simple-git`
 * or `nodegit` to clone/fetch a specific ref and read the file.
 */
export async function loadFromGit(options: { repo: string; ref?: string; filePath?: string }): Promise<string> {
  throw new Error('loadFromGit not implemented in this in-memory/stub loader');
}

export default { loadFromUrl, loadFromFile, loadFromGit };
