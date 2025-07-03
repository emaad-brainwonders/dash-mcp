import { z } from "zod";

export async function registerUser(
  userData: {
    username: string;
    emailid: string;
    contact_no: string;
  },
  env: {
    REGISTER_API_URL: string;
    REGISTER_API_TOKEN: string;
  }
) {
  const url = `${env.REGISTER_API_URL}?authtoken=${env.REGISTER_API_TOKEN}&Content-Type=application/json`;
  
  const body = {
    "admin": {
      "admin_id": 67,
      "organization_id": 76,
      "superadmin_id": 1,
      "associate_id": 1
    },
    "exam": {
      "exam_id": 2,
      "set_id": 16
    },
    "oem": {
      "header": {
        "logo": "https://tm-uat-resources.s3.ap-south-1.amazonaws.com/brand-logo/blank-logo-main.png",
        "name": "",
        "color": {
          "primary": "",
          "background": "",
          "cta": "",
          "cta_text_color": "",
          "cta_text": ""
        }
      },
      "footer": {
        "copyright_text": "",
        "test_name": ""
      },
      "links": {
        "backtodashboard": "",
        "testlink": "",
        "reportlink": ""
      }
    },
    "user": userData,
    "client_id": "",
    "client_log": ""
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  return response.json();
}

// MCP Tool registration - add this to your index.ts init() method
export const createRegisterUserTool = (env: { REGISTER_API_URL: string; REGISTER_API_TOKEN: string }) => ({
  name: "register_user",
  schema: {
    username: z.string().describe("User's full name"),
    emailid: z.string().email().describe("User's email address"), 
    contact_no: z.string().describe("User's contact number")
  },
  handler: async (params: { username: string; emailid: string; contact_no: string }) => {
    try {
      const result = await registerUser(params, env);
      return {
        content: [{ 
          type: "text", 
          text: `User registration successful: ${JSON.stringify(result, null, 2)}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `User registration failed: ${error instanceof Error ? error.message : "Unknown error"}` 
        }]
      };
    }
  }
});
