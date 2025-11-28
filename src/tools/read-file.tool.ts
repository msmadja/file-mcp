import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { FileService } from '../services/file.service.js';
import { validateInput } from '../core/validate.js';
import { ReadFileDto } from '../dto/read-file.dto.js';

export function registerReadFileTool(server: McpServer, fileService: FileService): void {
  server.registerTool(
    'read_file',
    {
      description: 'Read the contents of a file at the specified path',
      inputSchema: {
        path: z.string().describe('The path to the file to read (relative to sandbox)'),
      },
    },
    async ({ path }) => {
      try {
        const dto = validateInput(ReadFileDto, { path });
        const content = await fileService.readFile(dto);
        return {
          content: [{ type: 'text' as const, text: content }],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          isError: true,
          content: [{ type: 'text' as const, text: `Error reading file: ${message}` }],
        };
      }
    }
  );
}
