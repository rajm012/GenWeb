"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Smartphone, Tablet, Monitor } from "lucide-react"

export default function LivePreview() {
  const [view, setView] = useState("desktop")

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Live Preview</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className={`bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
              view === "mobile" ? "bg-gray-200 dark:bg-gray-600" : ""
            }`}
            onClick={() => setView("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
              view === "tablet" ? "bg-gray-200 dark:bg-gray-600" : ""
            }`}
            onClick={() => setView("tablet")}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 ${
              view === "desktop" ? "bg-gray-200 dark:bg-gray-600" : ""
            }`}
            onClick={() => setView("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        className={`bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden transition-all duration-300 ${
          view === "mobile" ? "w-64 h-128" : view === "tablet" ? "w-96 h-128" : "w-full h-96"
        }`}
      >
        <iframe src="about:blank" className="w-full h-full border-0" title="Live Preview"></iframe>
      </div>
      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Preview
      </Button>
    </div>
  )
}

