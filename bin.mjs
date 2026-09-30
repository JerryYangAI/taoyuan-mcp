#!/usr/bin/env node
/**
 * 桃源 MCP stdio 代理：把本地 stdio 客户端（Claude Desktop 等）转发到远程 Streamable HTTP。
 * 工具/资源/提示定义全部来自远程，本地不维护第二份。
 *
 *   TAOYUAN_API_KEY=ty_live_… npx taoyuan-mcp
 *   可选：TAOYUAN_MCP_URL（默认 https://api.musicsforyou.com/mcp）
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema, GetPromptRequestSchema, ListPromptsRequestSchema, ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema, ListToolsRequestSchema, ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const url = process.env.TAOYUAN_MCP_URL || "https://api.musicsforyou.com/mcp";
const key = process.env.TAOYUAN_API_KEY;
if (!key) {
  console.error("TAOYUAN_API_KEY is required. Create one at https://www.musicsforyou.com/developers");
  process.exit(1);
}

const remote = new Client({ name: "taoyuan-mcp-stdio", version: "1.0.0" });
await remote.connect(new StreamableHTTPClientTransport(new URL(url), { requestInit: { headers: { Authorization: `Bearer ${key}` } } }));

const local = new Server({ name: "taoyuan-music", version: "1.0.0" }, { capabilities: { tools: {}, resources: {}, prompts: {} } });
local.setRequestHandler(ListToolsRequestSchema, () => remote.listTools());
local.setRequestHandler(CallToolRequestSchema, (r) => remote.callTool(r.params));
local.setRequestHandler(ListResourcesRequestSchema, () => remote.listResources());
local.setRequestHandler(ListResourceTemplatesRequestSchema, () => remote.listResourceTemplates());
local.setRequestHandler(ReadResourceRequestSchema, (r) => remote.readResource(r.params));
local.setRequestHandler(ListPromptsRequestSchema, () => remote.listPrompts());
local.setRequestHandler(GetPromptRequestSchema, (r) => remote.getPrompt(r.params));

await local.connect(new StdioServerTransport());
