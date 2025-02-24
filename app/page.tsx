"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, Code2, Copy, Github, Loader2, Play, Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/sidebar";
import { LandingPage } from "@/components/landing-page";
import Lottie from "lottie-react";
import loadingAnimation from "@/public/ai.json";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/components/sidebar";

interface Files {
  html: Record<string, string>;
  css: Record<string, string>;
  js: Record<string, string>;
  py: Record<string, string>;
}

interface Message {
  role: "assistant" | "user";
  content: string;
  code?: boolean;
  files?: Files;
  repoUrl?: string;
  previewUrl?: string;
  structureDescription?: string;
}

interface ResponseData {
  files: string[];
  repoName: string;
  previewUrl: string;
  categorizedFiles: Files;
  structureDescription?: string;
  repoUrl: string;
}

export default function Page() {
  const { isSignedIn, user } = useUser();
  const [initialLoading, setInitialLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [processingSubmit, setProcessingSubmit] = useState(false);
  const [text, setText] = useState("");
  const [selectedTab, setSelectedTab] = useState<keyof Files>("html");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: '👋 Welcome to GenWeb! Paste your ideas to generate website.',
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
      if (isSignedIn) {
        setShowLanding(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isSignedIn]);

  const handleStart = () => {
    setShowLanding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !isSignedIn) return;
  
    setProcessingSubmit(true);
    setMessages(prev => [...prev, { role: "user", content: text }]);
  
    try {
      const agentResponse = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
  
      if (!agentResponse.ok) {
        throw new Error("Failed to process code with AI");
      }
  
      const agentData = await agentResponse.json();
      const fileNames = agentData.response.response
        .split("\n")
        .map((line: string) => line.split(": ")[1]?.trim())
        .filter(Boolean);
  
      const uploadResponse = await fetch("/api/upload-frontend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileNames,
          githubUsername: user?.username || "GenWeb-ai",
        }),
      });
  
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload files");
      }
  
      const data: ResponseData = await uploadResponse.json();
      
       // Create new project object
      const newProject: Project = {
        repoName: data.repoName,
        previewUrl: data.previewUrl,
        repoUrl: data.repoUrl,
        input: text,
        files: {
          html: {},
          css: {},
          js: {},
          py: {}
        },        
        
        structureDescription: data.structureDescription || "",
        created_at: new Date().toISOString()
      };
  
      // Save to localStorage
      try {
        const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]") as Project[];
        const updatedProjects = [newProject, ...existingProjects];
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      } catch (error) {
        console.error("Failed to save project to localStorage:", error);
      }
  
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Your project has been generated!",
          code: true,
          files: data.categorizedFiles,
          repoUrl: data.repoUrl,
          previewUrl: data.previewUrl,
          structureDescription: data.structureDescription,
        },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `❌ Error: ${error instanceof Error ? error.message : String(error)}` },
      ]);
    } finally {
      setProcessingSubmit(false);
      setText("");
    }
  };

  const loadProject = (project: Project) => {
    setMessages([
      { role: "user", content: project.input },
      {
        role: "assistant",
        content: "Your project has been generated!",
        code: true,
        files: {
          html: project.files?.html || {},
          css: project.files?.css || {},
          js: project.files?.js || {},
          py: project.files?.py || {},
        },
        repoUrl: project.repoUrl,
        previewUrl: project.previewUrl,
        structureDescription: project.structureDescription,
      },
    ]);
  };  

  const handleCopy = async (files: Files, type: keyof Files) => {
    try {
      const content = Object.values(files[type] || {}).join('\n');
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getFileCount = (files: Files, type: keyof Files): number => {
    return Object.keys(files[type] || {}).length;
  };

  const renderFileContent = (files: Files, type: keyof Files): string => {
    return Object.entries(files[type] || {})
      .map(([filename, content]) => `// ${filename}\n${content}`)
      .join('\n\n');
  };

  const handleNewProject = () => {
    setMessages([
      {
        role: "assistant",
        content: '👋 Welcome to GenWeb! Paste your ideas to generate website.',
      },
    ]);
  };  

  return (
    <div className="h-screen w-full">
      <AnimatePresence mode="wait">
        {initialLoading && (
          <motion.div
            key="initial-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-background"
          >
            <div className="w-64 h-64">
              <Lottie animationData={loadingAnimation} />
            </div>
          </motion.div>
        )}

        {!initialLoading && showLanding && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStart={handleStart} />
          </motion.div>
        )}

        {!initialLoading && !showLanding && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex h-full"
          >
            <Sidebar loadProject={loadProject} handleNewProject={handleNewProject} />
            <div className="flex flex-1 flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-6xl mx-auto space-y-8">
                  {messages.map((message, i) => (
                    <div key={i} className="space-y-4">
                      <div className={`flex gap-3 ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
                        {message.role === "assistant" ? (
                          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border bg-background">
                            <Code2 className="h-4 w-4" />
                          </div>
                        )}
                        <div className={`rounded-lg px-4 py-2 ${
                          message.role === "assistant"
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}>
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </div>

                      {message.code && message.files && (
                        <div className="ml-11">
                          {message.structureDescription && (
                            <Alert className="mb-4">
                              <AlertDescription className="whitespace-pre-wrap">
                                {message.structureDescription}
                              </AlertDescription>
                            </Alert>
                          )}

                          <Tabs
                            value={selectedTab}
                            className="rounded-lg border bg-background/50 p-4 backdrop-blur-sm"
                            onValueChange={(value) => setSelectedTab(value as keyof Files)}
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <TabsList>
                                {getFileCount(message.files, 'html') > 0 && <TabsTrigger value="html">HTML</TabsTrigger>}
                                {getFileCount(message.files, 'css') > 0 && <TabsTrigger value="css">CSS</TabsTrigger>}
                                {getFileCount(message.files, 'js') > 0 && <TabsTrigger value="js">JavaScript</TabsTrigger>}
                                {getFileCount(message.files, 'py') > 0 && <TabsTrigger value="py">Python</TabsTrigger>}
                              </TabsList>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopy(message.files!, selectedTab)}
                                >
                                  <Copy className="mr-2 h-4 w-4" /> Copy
                                </Button>

                                {message.previewUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(message.previewUrl, '_blank')}
                                  >
                                    <Play className="mr-2 h-4 w-4" /> Preview
                                  </Button>
                                )}

                                {message.repoUrl && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => window.open(message.repoUrl, '_blank')}
                                  >
                                    <Github className="mr-2 h-4 w-4" /> Repository
                                  </Button>
                                )}
                              </div>
                            </div>

                            <TabsContent value="html" className="mt-0">
                              <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                                <code>{renderFileContent(message.files, 'html')}</code>
                              </pre>
                            </TabsContent>
                            <TabsContent value="css" className="mt-0">
                              <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                                <code>{renderFileContent(message.files, 'css')}</code>
                              </pre>
                            </TabsContent>
                            <TabsContent value="js" className="mt-0">
                              <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                                <code>{renderFileContent(message.files, 'js')}</code>
                              </pre>
                            </TabsContent>
                            <TabsContent value="py" className="mt-0">
                              <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                                <code>{renderFileContent(message.files, 'py')}</code>
                              </pre>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t bg-background p-4">
                <div className="mx-auto max-w-6xl">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste your idea here..."
                      className="min-h-[60px]"
                      rows={1}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="h-[60px] w-[60px]"
                      disabled={processingSubmit || !isSignedIn}
                    >
                      {processingSubmit ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}