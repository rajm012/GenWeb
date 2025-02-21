"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  const [description, setDescription] = useState("")

  const handleGenerate = () => {
    // TODO: Implement website generation logic
    console.log("Generating website with description:", description)
  }

  return (
    <section className="text-center">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">GenWeb</h1>
      <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
        Describe your idea, and let AI build your website!
      </p>
      <div className="max-w-2xl mx-auto">
        <Input
          type="text"
          placeholder="Enter your website description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
        <Button onClick={handleGenerate} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Generate Website
        </Button>
      </div>
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">Powered by AI – Built for Developers & Creators.</p>
    </section>
  )
}

