#!/usr/bin/env node
import 'dotenv/config';
import 'reflect-metadata';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerAllTools } from './tools/index.js';
import { FileService } from './services/file.service.js';

const server = new McpServer({
  name: 'fmcp',
  version: '1.0.0',
});

const fileService = new FileService();

console.error(`FMCP Server starting...`);
console.error(`Sandbox directory: ${fileService.getSandboxRoot()}`);

registerAllTools(server, fileService);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('FMCP Server connected and ready');
}

main().catch((error) => {
  console.error('Failed to start FMCP server:', error);
  process.exit(1);
});
