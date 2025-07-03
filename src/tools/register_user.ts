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
  logo: z.string(),
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

// Helper function to extract values from MCP parameter objects
function extractMcpValue(value: any): any {
  if (value && typeof value === 'object' && 'value' in value) {
    return value.value;
  }
  return value;
}

// Default values based on your provided template
const DEFAULT_VALUES = {
  admin_id: 67,
  organization_id: 76,
  superadmin_id: 1,
  associate_id: 1,
  exam_id: 2,
  set_id: 16,
  logo: "https://tm-uat-resources.s3.ap-south-1.amazonaws.com/brand-logo/blank-logo-main.png",
  name: "",
  primary_color: "",
  background_color: "",
  cta_color: "",
  cta_text_color: "",
  cta_text: "",
  copyright_text: "",
  test_name: "",
  backtodashboard: "",
  testlink: "",
  reportlink: "",
  client_id: "",
  client_log: "",
};

export function registerUserRegisterTool(server: McpServer) {
  server.tool(
    "register_user",
    {
      // Only required fields
      username: z.string().describe("Username/Full Name"),
      emailid: z.string().email().describe("Email address"),
      contact_no: z.string().describe("Contact number"),
      
      // Optional fields with defaults
      admin_id: z.number().optional().describe("Admin ID (default: 67)"),
      organization_id: z.number().optional().describe("Organization ID (default: 76)"),
      superadmin_id: z.number().optional().describe("Superadmin ID (default: 1)"),
      associate_id: z.number().optional().describe("Associate ID (default: 1)"),
      exam_id: z.number().optional().describe("Exam ID (default: 2)"),
      set_id: z.number().optional().describe("Set ID (default: 16)"),
      logo: z.string().optional().describe("Logo URL"),
      name: z.string().optional().describe("Organization name"),
      primary_color: z.string().optional().describe("Primary color (hex)"),
      background_color: z.string().optional().describe("Background color (hex)"),
      cta_color: z.string().optional().describe("CTA button color (hex)"),
      cta_text_color: z.string().optional().describe("CTA text color (hex)"),
      cta_text: z.string().optional().describe("CTA button text"),
      copyright_text: z.string().optional().describe("Copyright text"),
      test_name: z.string().optional().describe("Test name"),
      backtodashboard: z.string().optional().describe("Back to dashboard URL"),
      testlink: z.string().optional().describe("Test link URL"),
      reportlink: z.string().optional().describe("Report link URL"),
      client_id: z.string().optional().describe("Client ID"),
      client_log: z.string().optional().describe("Client log"),
    },
    async (rawParams) => {
      try {
        // Extract actual values from MCP parameter objects
        const params = Object.fromEntries(
          Object.entries(rawParams).map(([key, value]) => [
            key,
            extractMcpValue(value)
          ])
        );

        console.log("Extracted parameters:", params);

        // Validate required parameters only
        const requiredSchema = z.object({
          username: z.string().min(1, "Username is required"),
          emailid: z.string().email("Valid email is required"),
          contact_no: z.string().min(1, "Contact number is required"),
        });

        const requiredParams = requiredSchema.parse({
          username: params.username,
          emailid: params.emailid,
          contact_no: params.contact_no,
        });

        // Merge with defaults
        const finalParams = {
          admin_id: params.admin_id ?? DEFAULT_VALUES.admin_id,
          organization_id: params.organization_id ?? DEFAULT_VALUES.organization_id,
          superadmin_id: params.superadmin_id ?? DEFAULT_VALUES.superadmin_id,
          associate_id: params.associate_id ?? DEFAULT_VALUES.associate_id,
          exam_id: params.exam_id ?? DEFAULT_VALUES.exam_id,
          set_id: params.set_id ?? DEFAULT_VALUES.set_id,
          logo: params.logo ?? DEFAULT_VALUES.logo,
          name: params.name ?? DEFAULT_VALUES.name,
          primary_color: params.primary_color ?? DEFAULT_VALUES.primary_color,
          background_color: params.background_color ?? DEFAULT_VALUES.background_color,
          cta_color: params.cta_color ?? DEFAULT_VALUES.cta_color,
          cta_text_color: params.cta_text_color ?? DEFAULT_VALUES.cta_text_color,
          cta_text: params.cta_text ?? DEFAULT_VALUES.cta_text,
          copyright_text: params.copyright_text ?? DEFAULT_VALUES.copyright_text,
          test_name: params.test_name ?? DEFAULT_VALUES.test_name,
          backtodashboard: params.backtodashboard ?? DEFAULT_VALUES.backtodashboard,
          testlink: params.testlink ?? DEFAULT_VALUES.testlink,
          reportlink: params.reportlink ?? DEFAULT_VALUES.reportlink,
          client_id: params.client_id ?? DEFAULT_VALUES.client_id,
          client_log: params.client_log ?? DEFAULT_VALUES.client_log,
          ...requiredParams, // Override with validated required params
        };

        const requestData: UserRegisterRequest = {
          admin: {
            admin_id: finalParams.admin_id,
            organization_id: finalParams.organization_id,
            superadmin_id: finalParams.superadmin_id,
            associate_id: finalParams.associate_id,
          },
          exam: {
            exam_id: finalParams.exam_id,
            set_id: finalParams.set_id,
          },
          oem: {
            header: {
              logo: finalParams.logo,
              name: finalParams.name,
              color: {
                primary: finalParams.primary_color,
                background: finalParams.background_color,
                cta: finalParams.cta_color,
                cta_text_color: finalParams.cta_text_color,
                cta_text: finalParams.cta_text,
              },
            },
            footer: {
              copyright_text: finalParams.copyright_text,
              test_name: finalParams.test_name,
            },
            links: {
              backtodashboard: finalParams.backtodashboard,
              testlink: finalParams.testlink,
              reportlink: finalParams.reportlink,
            },
          },
          user: {
            username: finalParams.username,
            emailid: finalParams.emailid,
            contact_no: finalParams.contact_no,
          },
          client_id: finalParams.client_id,
          client_log: finalParams.client_log,
        };

        console.log("Transformed request data:", JSON.stringify(requestData, null, 2));

        const result = await registerUser(requestData);
        
        return {
          content: [{ 
            type: "text", 
            text: `User registered successfully: ${JSON.stringify(result, null, 2)}` 
          }],
        };
      } catch (error) {
        console.error("Error in register_user tool:", error);
        
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
