import { readFile, writeFile, unlink, readdir, stat, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { glob } from 'glob';
import { validatePath, getSandboxRoot } from '../core/path-validator.js';
import { ReadFileDto } from '../dto/read-file.dto.js';
import { WriteFileDto } from '../dto/write-file.dto.js';
import { DeleteFileDto } from '../dto/delete-file.dto.js';
import { ListDirectoryDto } from '../dto/list-directory.dto.js';
import { SearchFilesDto } from '../dto/search-files.dto.js';
import { FileEntry } from './types.js';

export class FileService {
  async readFile(dto: ReadFileDto): Promise<string> {
    const safePath = validatePath(dto.path);
    return await readFile(safePath, 'utf-8');
  }

  async writeFile(dto: WriteFileDto): Promise<void> {
    const safePath = validatePath(dto.path);
    const dir = dirname(safePath);

    await mkdir(dir, { recursive: true });
    await writeFile(safePath, dto.content, 'utf-8');
  }

  async deleteFile(dto: DeleteFileDto): Promise<void> {
    const safePath = validatePath(dto.path);
    await unlink(safePath);
  }

  async listDirectory(dto: ListDirectoryDto): Promise<FileEntry[]> {
    const safePath = validatePath(dto.path || '.');
    const entries = await readdir(safePath, { withFileTypes: true });

    const result: FileEntry[] = [];

    for (const entry of entries) {
      const fileEntry: FileEntry = {
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
      };

      if (entry.isFile()) {
        try {
          const fullPath = join(safePath, entry.name);
          const stats = await stat(fullPath);
          fileEntry.size = stats.size;
        } catch {
        }
      }

      result.push(fileEntry);
    }

    return result;
  }

  async searchFiles(dto: SearchFilesDto): Promise<string[]> {
    const safePath = validatePath(dto.path || '.');
    const matches = await glob(dto.pattern, {
      cwd: safePath,
      nodir: false,
      dot: false,
    });

    return matches;
  }

  getSandboxRoot(): string {
    return getSandboxRoot();
  }
}
