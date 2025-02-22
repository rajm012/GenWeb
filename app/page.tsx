"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Code2, Copy, ExternalLink, Loader2, Play, Send } from "lucide-react"

export default function Page() {
  const [loading, setLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<{ role: "user" | "assistant"; content: string; code?: boolean }[]>([
    {
      role: "assistant",
      content:
        '👋 Welcome to GenWeb! I\'m your AI website builder. Describe your dream website, and I\'ll generate the code for you. For example, try:\n\n"Create a modern portfolio website with a dark theme"\n"Build an e-commerce landing page with product grid"\n"Design a restaurant website with menu and booking form"',
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.elements.namedItem("message") as HTMLTextAreaElement
    const message = input.value.trim()

    if (message) {
      setLoading(true)
      setMessages((prev) => [...prev, { role: "user", content: message }])
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I've generated your website based on your description. Here's the code:",
            code: true,
          },
        ])
        setLoading(false)
      }, 2000)
      input.value = ""
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-4xl space-y-8">
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

                {message.code && (
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
                          <code>{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Generated Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="logo">Brand</div>
        <div class="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
        </div>
    </nav>
    <main>
        <h1>Welcome to my website</h1>
        <p>This is a generated template.</p>
    </main>
    <script src="script.js"></script>
</body>
</html>`}</code>
                        </pre>
                      </TabsContent>
                      <TabsContent value="css" className="mt-0">
                        <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                          <code>{`/* Your CSS code will appear here */`}</code>
                        </pre>
                      </TabsContent>
                      <TabsContent value="js" className="mt-0">
                        <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4">
                          <code>{`/* Your JavaScript code will appear here */`}</code>
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

