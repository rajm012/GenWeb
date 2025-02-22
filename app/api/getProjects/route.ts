// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuth(req);
    console.log("User ID:", auth.userId);

    if (!auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch projects using admin client
    const { data: projects, error } = await supabaseAdmin
      .from("projects")
      .select("*")  // Select all columns for debugging
      .eq("user_id", auth.userId);

    console.log("Query result:", { projects, error });

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!projects || projects.length === 0) {
      console.log("No projects found for user:", auth.userId);
      // Check what data exists in the table
      const { data: allProjects } = await supabaseAdmin
        .from("projects")
        .select("user_id");
      console.log("All user_ids in projects:", allProjects);
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}