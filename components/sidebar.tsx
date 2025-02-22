"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Clock, Plus } from "lucide-react";

interface Project {
  id: string;
  project_name: string;
  created_at: string;
}

export function Sidebar() {
  const { user, isSignedIn } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/getProjects", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        console.log("Fetched projects:", data);

        if (data.projects) {
          setProjects(data.projects);
        } else {
          setError("No projects found.");
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setError("Failed to load projects.");
      }
    };

    if (isSignedIn) {
      fetchProjects();
    }
  }, [isSignedIn, user]);

  return (
    <SidebarContainer>
      <SidebarHeader className="border-b p-4">
        <div className="mb-2 px-2 text-xl font-semibold">GenWeb</div>
        <div className="mb-4 px-2 text-sm text-muted-foreground">AI-powered website generator</div>
        <Button className="w-full gap-2">
          <Plus className="h-4 w-4" />
          New Website
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 py-4 text-xs font-medium text-muted-foreground">PREVIOUS PROJECTS</div>
        <SidebarMenu>
          {error ? (
            <p className="px-4 text-red-500 text-sm">{error}</p>
          ) : projects.length === 0 ? (
            <p className="px-4 text-muted-foreground text-sm">No projects yet.</p>
          ) : (
            projects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton className="flex flex-col items-start gap-1 p-3">
                  <div className="font-medium">{project.project_name}</div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>
    </SidebarContainer>
  );
}
