import { resolve, relative, normalize } from 'path';

const SANDBOX_ROOT = process.env.FMCP_SANDBOX_DIR || process.cwd();

export function validatePath(requestedPath: string): string {
  const normalizedPath = normalize(requestedPath);
  const resolvedPath = resolve(SANDBOX_ROOT, normalizedPath);

  const relativePath = relative(SANDBOX_ROOT, resolvedPath);

  if (relativePath.startsWith('..') || resolve(relativePath) === relativePath) {
    throw new Error(
      `Access denied: Path "${requestedPath}" is outside the allowed directory. ` +
        `Sandbox root: ${SANDBOX_ROOT}`
    );
  }

  return resolvedPath;
}

export function getSandboxRoot(): string {
  return SANDBOX_ROOT;
}
