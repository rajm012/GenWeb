import { Button } from "@/components/ui/button"
import { Code2, MoveRight, Sparkles, Zap } from "lucide-react"

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="relative">
        <div className="absolute -left-8 -top-8 h-64 w-64 bg-gradient-radial from-primary/20 to-transparent blur-2xl" />
        <div className="absolute -right-8 -bottom-8 h-64 w-64 bg-gradient-radial from-primary/20 to-transparent blur-2xl" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            AI-Powered Website Generation
          </div>

          <h1 className="mb-4 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
            Your website.
            <br />
            In seconds.
          </h1>

          <p className="mb-8 text-xl text-muted-foreground">
            Describe your dream website in plain English,
            <br />
            and watch as GenWeb brings it to life instantly.
          </p>

          <div className="mb-8 flex flex-col items-center gap-4">
            <Button size="lg" className="h-12 gap-2 px-8 text-base" onClick={onStart}>
              Create Your First Website
              <MoveRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Lightning fast</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              <span>Production ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

