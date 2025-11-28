import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { FileService } from '../services/file.service.js';
import { registerReadFileTool } from './read-file.tool.js';
import { registerWriteFileTool } from './write-file.tool.js';
import { registerDeleteFileTool } from './delete-file.tool.js';
import { registerListDirectoryTool } from './list-directory.tool.js';
import { registerSearchFilesTool } from './search-files.tool.js';

export function registerAllTools(server: McpServer, fileService: FileService): void {
  registerReadFileTool(server, fileService);
  registerWriteFileTool(server, fileService);
  registerDeleteFileTool(server, fileService);
  registerListDirectoryTool(server, fileService);
  registerSearchFilesTool(server, fileService);
}
