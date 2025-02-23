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
  repoName: string;
  previewUrl: string;
  repoUrl: string;
  input: string;
  files: any;
  structureDescription: string;
  created_at: string;
}

interface SidebarProps {
  loadProject: (project: Project) => void;
  handleNewProject: () => void;
}

export function Sidebar({ loadProject, handleNewProject }: SidebarProps) {

  const { user, isSignedIn } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("projects");
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage:", error);
      setError("Failed to load projects.");
    }
  }, []);

  const handleProjectClick = (project: Project) => {
    loadProject(project);
  };

  return (
    <SidebarContainer>
      <SidebarHeader className="border-b p-4">
        <div className="mb-2 px-2 text-xl font-semibold">GenWeb</div>
        <div className="mb-4 px-2 text-sm text-muted-foreground">AI-powered website generator</div>
        <Button className="w-full gap-2" onClick={handleNewProject}>
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
          ) : isSignedIn ? (
            projects.map((project, index) => (
              <SidebarMenuItem key={project.input || index}>
                <SidebarMenuButton
                  className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="font-medium">{project.input}</div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ): (
            <p className="px-4 text-muted-foreground text-sm">No projects yet.</p>
          )}
        </SidebarMenu>
      </SidebarContent>
    </SidebarContainer>
  );
}
