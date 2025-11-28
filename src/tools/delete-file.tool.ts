import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { FileService } from '../services/file.service.js';
import { validateInput } from '../core/validate.js';
import { DeleteFileDto } from '../dto/delete-file.dto.js';

export function registerDeleteFileTool(server: McpServer, fileService: FileService): void {
  server.registerTool(
    'delete_file',
    {
      description: 'Delete a file at the specified path',
      inputSchema: {
        path: z.string().describe('The path to the file to delete'),
      },
    },
    async ({ path }) => {
      try {
        const dto = validateInput(DeleteFileDto, { path });
        await fileService.deleteFile(dto);
        return {
          content: [{ type: 'text' as const, text: `Successfully deleted ${path}` }],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          isError: true,
          content: [{ type: 'text' as const, text: `Error deleting file: ${message}` }],
        };
      }
    }
  );
}
