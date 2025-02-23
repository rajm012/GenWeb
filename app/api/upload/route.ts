import { supabaseAdmin } from "@/lib/supabase";
import { uploadFile } from "@/lib/uploadFile";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectName, files } = await req.json();
    const userId = auth.userId;

    const fileUrls: Record<string, string> = {};
    for (const [fileName, content] of Object.entries(files)) {
      fileUrls[fileName] = await uploadFile(userId, fileName, String(content));
    }
    console.log(fileUrls)
    const { error } = await supabaseAdmin
      .from("projects")
      .insert([{ 
        user_id: userId, 
        project_name: projectName, 
        file_urls: fileUrls 
      }]);

    if (error) {
      console.error("Database insertion error:", error);
      throw error;
    }

    return NextResponse.json({ message: "Project saved successfully", fileUrls }, { status: 200 });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal Server Error",
      details: error
    }, { status: 500 });
  }
}