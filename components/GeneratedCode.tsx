"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { File, Download } from "lucide-react"

const files = [
  { name: "index.html", content: "<h1>Hello, World!</h1>" },
  { name: "style.css", content: "body { font-family: sans-serif; }" },
  { name: "script.js", content: 'console.log("Hello from GenWeb!");' },
]

export default function GeneratedCode() {
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string } | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Generated Files</h2>
      <div className="space-y-2 mb-4">
        {files.map((file) => (
          <div key={file.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  onClick={() => setSelectedFile(file)}
                >
                  View Code
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <DialogHeader>
                  <DialogTitle>{selectedFile?.name}</DialogTitle>
                </DialogHeader>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                  <code>{selectedFile?.content}</code>
                </pre>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        <Download className="w-4 h-4 mr-2" />
        Download All Files
      </Button>
    </div>
  )
}

