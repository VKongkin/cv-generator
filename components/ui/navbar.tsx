"use client";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b bg-white">
      <div className="font-bold text-lg">CV Builder</div>
      <div>
        {session?.user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{session.user.email}</span>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button asChild variant="outline">
            <a href="/login">Login</a>
          </Button>
        )}
      </div>
    </nav>
  );
}
