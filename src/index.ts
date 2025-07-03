import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AuthkitHandler } from "./authkit-handler";
import type { Props } from "./props";
import { createRegisterUserTool } from "./tools/register_user";


export class MyMCP extends McpAgent<Env, unknown, Props> {
	server = new McpServer({
		name: "MCP server demo using AuthKit",
		version: "1.0.0",
	});

	async init() {
    const registerUserTool = createRegisterUserTool({
    REGISTER_API_URL: this.env.REGISTER_API_URL,
    REGISTER_API_TOKEN: this.env.REGISTER_API_TOKEN
  });
  
  this.server.tool(
    registerUserTool.name,
    registerUserTool.schema,
    registerUserTool.handler
  );
	}
}

export default new OAuthProvider({
	apiRoute: "/sse",
	apiHandler: MyMCP.mount("/sse") as any, // Use 'any' for maximum flexibility
	defaultHandler: AuthkitHandler as any,  // Use 'any' for maximum flexibility 
	authorizeEndpoint: "/authorize",
	tokenEndpoint: "/token",
	clientRegistrationEndpoint: "/register",
});
