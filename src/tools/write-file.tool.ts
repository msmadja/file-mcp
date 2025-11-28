import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { FileService } from '../services/file.service.js';
import { validateInput } from '../core/validate.js';
import { WriteFileDto } from '../dto/write-file.dto.js';

export function registerWriteFileTool(server: McpServer, fileService: FileService): void {
  server.registerTool(
    'write_file',
    {
      description: 'Write content to a file at the specified path (creates or overwrites)',
      inputSchema: {
        path: z.string().describe('The path to the file to write'),
        content: z.string().describe('The content to write to the file'),
      },
    },
    async ({ path, content }) => {
      try {
        const dto = validateInput(WriteFileDto, { path, content });
        await fileService.writeFile(dto);
        return {
          content: [{ type: 'text' as const, text: `Successfully wrote to ${path}` }],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          isError: true,
          content: [{ type: 'text' as const, text: `Error writing file: ${message}` }],
        };
      }
    }
  );
}
