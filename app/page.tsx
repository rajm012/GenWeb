import LandingPage from "@/components/LandingPage"
import GeneratedCode from "@/components/GeneratedCode"
import LivePreview from "@/components/LivePreview"
import DownloadDeploy from "@/components/DownloadDeploy"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <LandingPage />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <GeneratedCode />
          <LivePreview />
        </div>
        <DownloadDeploy />
      </div>
    </main>
  )
}

