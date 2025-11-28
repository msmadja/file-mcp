import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { FileService } from '../services/file.service.js';
import { validateInput } from '../core/validate.js';
import { SearchFilesDto } from '../dto/search-files.dto.js';

export function registerSearchFilesTool(server: McpServer, fileService: FileService): void {
  server.registerTool(
    'search_files',
    {
      description: 'Search for files matching a glob pattern',
      inputSchema: {
        pattern: z.string().describe('Glob pattern to match (e.g., "**/*.ts", "*.json")'),
        path: z.string().optional().describe('Starting directory (defaults to sandbox root)'),
      },
    },
    async ({ pattern, path }) => {
      try {
        const dto = validateInput(SearchFilesDto, { pattern, path });
        const matches = await fileService.searchFiles(dto);

        if (matches.length === 0) {
          return {
            content: [
              { type: 'text' as const, text: `No files found matching pattern: ${pattern}` },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: `Found ${matches.length} match(es):\n${matches.join('\n')}`,
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          isError: true,
          content: [{ type: 'text' as const, text: `Error searching files: ${message}` }],
        };
      }
    }
  );
}
