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
      admin_id: z.number().describe("Admin ID"),
      organization_id: z.number().describe("Organization ID"),
      superadmin_id: z.number().describe("Superadmin ID"),
      associate_id: z.number().describe("Associate ID"),
      exam_id: z.number().describe("Exam ID"),
      set_id: z.number().describe("Set ID"),
      logo: z.string().url().describe("Logo URL"),
      name: z.string().describe("Organization name"),
      primary_color: z.string().describe("Primary color (hex)"),
      background_color: z.string().describe("Background color (hex)"),
      cta_color: z.string().describe("CTA button color (hex)"),
      cta_text_color: z.string().describe("CTA text color (hex)"),
      cta_text: z.string().describe("CTA button text"),
      copyright_text: z.string().describe("Copyright text"),
      test_name: z.string().describe("Test name"),
      backtodashboard: z.string().describe("Back to dashboard URL"),
      testlink: z.string().describe("Test link URL"),
      reportlink: z.string().describe("Report link URL"),
      username: z.string().describe("Username"),
      emailid: z.string().email().describe("Email address"),
      contact_no: z.string().describe("Contact number"),
      client_id: z.string().describe("Client ID"),
      client_log: z.string().describe("Client log"),
    },
    async (rawParams) => {
      try {
        // Extract actual values from MCP parameter objects with proper typing
        const params = Object.fromEntries(
          Object.entries(rawParams).map(([key, value]) => [
            key,
            typeof value === 'object' && value !== null && 'value' in value 
              ? (value as { value: any }).value 
              : value
          ])
        );

        // Validate extracted parameters
        const validationSchema = z.object({
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
        });

        const validatedParams = validationSchema.parse(params);

        const requestData: UserRegisterRequest = {
          admin: {
            admin_id: validatedParams.admin_id,
            organization_id: validatedParams.organization_id,
            superadmin_id: validatedParams.superadmin_id,
            associate_id: validatedParams.associate_id,
          },
          exam: {
            exam_id: validatedParams.exam_id,
            set_id: validatedParams.set_id,
          },
          oem: {
            header: {
              logo: validatedParams.logo,
              name: validatedParams.name,
              color: {
                primary: validatedParams.primary_color,
                background: validatedParams.background_color,
                cta: validatedParams.cta_color,
                cta_text_color: validatedParams.cta_text_color,
                cta_text: validatedParams.cta_text,
              },
            },
            footer: {
              copyright_text: validatedParams.copyright_text,
              test_name: validatedParams.test_name,
            },
            links: {
              backtodashboard: validatedParams.backtodashboard,
              testlink: validatedParams.testlink,
              reportlink: validatedParams.reportlink,
            },
          },
          user: {
            username: validatedParams.username,
            emailid: validatedParams.emailid,
            contact_no: validatedParams.contact_no,
          },
          client_id: validatedParams.client_id,
          client_log: validatedParams.client_log,
        };

        const result = await registerUser(requestData);
        
        return {
          content: [{ 
            type: "text", 
            text: `User registered successfully: ${JSON.stringify(result, null, 2)}` 
          }],
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            content: [{ 
              type: "text", 
              text: `Validation error: ${JSON.stringify(error.errors, null, 2)}` 
            }],
          };
        }
        
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
