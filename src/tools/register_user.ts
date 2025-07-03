import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Zod schemas for validation
const AdminSchema = z.object({
  admin_id: z.number(),
  organization_id: z.number(),
  superadmin_id: z.number(),
  associate_id: z.number(),
});

const ExamSchema = z.object({
  exam_id: z.number(),
  set_id: z.number(),
});

const ColorSchema = z.object({
  primary: z.string(),
  background: z.string(),
  cta: z.string(),
  cta_text_color: z.string(),
  cta_text: z.string(),
});

const HeaderSchema = z.object({
  logo: z.string().url(),
  name: z.string(),
  color: ColorSchema,
});

const FooterSchema = z.object({
  copyright_text: z.string(),
  test_name: z.string(),
});

const LinksSchema = z.object({
  backtodashboard: z.string(),
  testlink: z.string(),
  reportlink: z.string(),
});

const OemSchema = z.object({
  header: HeaderSchema,
  footer: FooterSchema,
  links: LinksSchema,
});

const UserSchema = z.object({
  username: z.string(),
  emailid: z.string().email(),
  contact_no: z.string(),
});

const UserRegisterSchema = z.object({
  admin: AdminSchema,
  exam: ExamSchema,
  oem: OemSchema,
  user: UserSchema,
  client_id: z.string(),
  client_log: z.string(),
});

type UserRegisterRequest = z.infer<typeof UserRegisterSchema>;

async function registerUser(data: UserRegisterRequest): Promise<any> {
  const validatedData = UserRegisterSchema.parse(data);
  
  const response = await fetch(
    "https://9exf96z4n3.execute-api.ap-south-1.amazonaws.com/prod/user/register",
    {
      method: "POST",
      headers: {
        "authtoken": "e4a8f994646cd630e14d27bed8762957",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    }
  );

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export function registerUserRegisterTool(server: McpServer) {
  server.tool(
    "register_user",
    {
      admin_id: z.number(),
      organization_id: z.number(),
      superadmin_id: z.number(),
      associate_id: z.number(),
      exam_id: z.number(),
      set_id: z.number(),
      logo: z.string().url(),
      name: z.string(),
      primary_color: z.string(),
      background_color: z.string(),
      cta_color: z.string(),
      cta_text_color: z.string(),
      cta_text: z.string(),
      copyright_text: z.string(),
      test_name: z.string(),
      backtodashboard: z.string(),
      testlink: z.string(),
      reportlink: z.string(),
      username: z.string(),
      emailid: z.string().email(),
      contact_no: z.string(),
      client_id: z.string(),
      client_log: z.string(),
    },
    async (params) => {
      try {
        const requestData: UserRegisterRequest = {
          admin: {
            admin_id: params.admin_id,
            organization_id: params.organization_id,
            superadmin_id: params.superadmin_id,
            associate_id: params.associate_id,
          },
          exam: {
            exam_id: params.exam_id,
            set_id: params.set_id,
          },
          oem: {
            header: {
              logo: params.logo,
              name: params.name,
              color: {
                primary: params.primary_color,
                background: params.background_color,
                cta: params.cta_color,
                cta_text_color: params.cta_text_color,
                cta_text: params.cta_text,
              },
            },
            footer: {
              copyright_text: params.copyright_text,
              test_name: params.test_name,
            },
            links: {
              backtodashboard: params.backtodashboard,
              testlink: params.testlink,
              reportlink: params.reportlink,
            },
          },
          user: {
            username: params.username,
            emailid: params.emailid,
            contact_no: params.contact_no,
          },
          client_id: params.client_id,
          client_log: params.client_log,
        };

        const result = await registerUser(requestData);
        
        return {
          content: [{ 
            type: "text", 
            text: `User registered successfully: ${JSON.stringify(result)}` 
          }],
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Error registering user: ${error instanceof Error ? error.message : 'Unknown error'}` 
          }],
        };
      }
    }
  );
}
