import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { FileService } from '../services/file.service.js';
import { validateInput } from '../core/validate.js';
import { ListDirectoryDto } from '../dto/list-directory.dto.js';

export function registerListDirectoryTool(server: McpServer, fileService: FileService): void {
  server.registerTool(
    'list_directory',
    {
      description: 'List all files and directories in the specified path',
      inputSchema: {
        path: z.string().optional().describe('Directory path (defaults to sandbox root)'),
      },
    },
    async ({ path }) => {
      try {
        const dto = validateInput(ListDirectoryDto, { path });
        const entries = await fileService.listDirectory(dto);

        const formatted = entries.map((entry) => {
          const prefix = entry.type === 'directory' ? '[DIR]' : '[FILE]';
          const size = entry.size !== undefined ? ` (${entry.size} bytes)` : '';
          return `${prefix} ${entry.name}${size}`;
        });

        return {
          content: [
            { type: 'text' as const, text: formatted.join('\n') || '(empty directory)' },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          isError: true,
          content: [{ type: 'text' as const, text: `Error listing directory: ${message}` }],
        };
      }
    }
  );
}
