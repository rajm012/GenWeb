"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Code2, Copy, ExternalLink, Loader2, Play, Send } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { useUser } from "@clerk/nextjs"

// Type definitions
interface GeneratedFiles {
  html: string;
  css: string;
  js: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  code?: boolean;
  files?: GeneratedFiles;
}

interface ProjectData {
  projectName: string;
  files: {
    "index.html": string;
    "style.css": string;
    "script.js": string;
  };
}

interface AIResponse {
  response: string;
  status: number;
}

export default function Page() {
  const { user, isSignedIn } = useUser()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        '👋 Welcome to GenWeb! I\'m your AI website builder. Describe your dream website, and I\'ll generate the code for you. For example, try:\n\n"Create a modern portfolio website with a dark theme"\n"Build an e-commerce landing page with product grid"\n"Design a restaurant website with menu and booking form"',
    },
  ])

  const saveProject = async (prompt: string, files: GeneratedFiles): Promise<void> => {
    try {
      const projectData: ProjectData = {
        projectName: prompt,
        files: {
          "index.html": files.html || "",
          "style.css": files.css || "",
          "script.js": files.js || "",
        },
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error("Failed to save project")
      }
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  // Updated code extraction function with better error handling and type checking
  const extractCode = (response: string, type: 'html' | 'css' | 'javascript'): string => {
    if (!response || typeof response !== 'string') {
      console.error(`Invalid response for ${type} code extraction:`, response);
      return `/* No ${type} code available */`;
    }
  
    try {
      let responseText: string;
  
      // Try parsing JSON if response is a JSON string
      try {
        const parsedResponse = JSON.parse(response);
        responseText = typeof parsedResponse.response === 'string' ? parsedResponse.response : response;
      } catch {
        responseText = response;
      }
  
      // Language mappings for easier identification
      const languageMap: Record<typeof type, string[]> = {
        html: ['html'],
        css: ['css'],
        javascript: ['javascript', 'js']
      };
  
      const languages = languageMap[type] || [type];
      const languagePattern = languages.join('|');
  
      // Match fenced code blocks with the correct language
      const codeBlockPattern = new RegExp(`\`\`\`(?:${languagePattern})\\s*\\n([\\s\\S]*?)\\n\`\`\``, 'gi');
      const matches = [...responseText.matchAll(codeBlockPattern)].map(match => match[1].trim());
  
      if (matches.length > 0) {
        return matches.join('\n\n');
      }
  
      // Match generic code blocks without a specified language
      const fallbackPattern = /\`\`\`\s*\n([\s\S]*?)\n\`\`\`/g;
      const fallbackMatches = [...responseText.matchAll(fallbackPattern)].map(match => match[1].trim());
  
      if (fallbackMatches.length > 0) {
        return fallbackMatches.join('\n\n');
      }
  
      // Last resort: Attempt inline code extraction based on structure
      if (type === 'html') {
        const htmlMatches = [...responseText.matchAll(/<[^>]+>[\s\S]*?<\/[^>]+>/gm)].map(match => match[0].trim());
        if (htmlMatches.length > 0) return htmlMatches.join('\n\n');
      }
  
      if (type === 'css') {
        const cssMatches = [...responseText.matchAll(/[.#]?[\w-]+\s*{[\s\S]*?}/gm)].map(match => match[0].trim());
        if (cssMatches.length > 0) return cssMatches.join('\n\n');
      }
  
      if (type === 'javascript') {
        const jsMatches = [...responseText.matchAll(/(?:function|const|let|var|class)\s+[\w$]+\s*.*?{[\s\S]*?}/gm)].map(match => match[0].trim());
        if (jsMatches.length > 0) return jsMatches.join('\n\n');
      }
  
      console.warn(`No ${type} code block found in response`);
      return `/* No ${type} code block found */`;
    } catch (error) {
      console.error(`Error extracting ${type} code:`, error);
      return `/* Error extracting ${type} code: ${String(error)} */`;
    }
  };
  

// Update handleSubmit function to handle the response format
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault()
  const form = e.target as HTMLFormElement
  const input = form.elements.namedItem("message") as HTMLTextAreaElement
  const message = input.value.trim()

  if (message && isSignedIn) {
    setLoading(true)
    setMessages((prev) => [...prev, { role: "user", content: message }])

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: message }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch response")
      }

      const data: AIResponse = await response.json()
      
      // Extract code snippets with the updated function
      const generatedFiles: GeneratedFiles = {
        html: extractCode(JSON.stringify(data), "html"),
        css: extractCode(JSON.stringify(data), "css"),
        js: extractCode(JSON.stringify(data), "javascript")
      }

      // Save the project
      await saveProject(message, generatedFiles)

      // Add the AI response to messages with both the explanation and code
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: typeof data.response === 'string' ? data.response.split('```')[0] : "Here's the generated code:",
          code: true,
          files: generatedFiles
        },
      ])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I encountered an error while generating your website: ${error}. Please try again.`,
        },
      ])
    } finally {
      setLoading(false)
      input.value = ""
    }
  }
}

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-8">
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
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === "assistant"
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>

                {message.code && message.files && (
                  <div className="ml-11">
                    <Tabs defaultValue="html" className="rounded-lg border bg-background/50 p-4 backdrop-blur-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <TabsList>
                          <TabsTrigger value="html">index.html</TabsTrigger>
                          <TabsTrigger value="css">style.css</TabsTrigger>
                          <TabsTrigger value="js">script.js</TabsTrigger>
                        </TabsList>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                          <Button variant="default" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Deploy
                          </Button>
                        </div>
                      </div>
                      <TabsContent value="html" className="mt-0">
                        <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                          <code>{message.files.html}</code>
                        </pre>
                      </TabsContent>
                      <TabsContent value="css" className="mt-0">
                        <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                          <code>{message.files.css}</code>
                        </pre>
                      </TabsContent>
                      <TabsContent value="js" className="mt-0">
                        <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                          <code>{message.files.js}</code>
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
          <div className="mx-auto max-w-4xl">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                name="message"
                placeholder="Describe your website... (e.g., A modern portfolio with a blog and contact form)"
                className="min-h-[60px]"
                rows={1}
              />
              <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}