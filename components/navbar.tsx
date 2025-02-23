import { ModeToggle } from "@/components/mode-toggle"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <SidebarTrigger/>
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">GenWeb</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ModeToggle />
          <div className=" top-4 right-4 flex gap-4">
          <SignedOut>
            <Button><SignInButton /></Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        </div>
      </div>
    </header>
  )
}

