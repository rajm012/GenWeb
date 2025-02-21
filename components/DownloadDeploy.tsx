import { Button } from "@/components/ui/button"
import { Download, Rocket } from "lucide-react"

export default function DownloadDeploy() {
  return (
    <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
      <Button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100">
        <Download className="w-4 h-4 mr-2" />
        Download get_code.sh
      </Button>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
        <Rocket className="w-4 h-4 mr-2" />
        Deploy with Vercel
      </Button>
    </div>
  )
}

