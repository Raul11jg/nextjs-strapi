"use client";

import { useFormStatus } from "react-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { actions } from "@/app/actions";

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="ghost" size="sm" disabled={pending} type="submit">
      {pending ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span>Signing out...</span>
        </div>
      ) : (
        "Sign out"
      )}
    </Button>
  );
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-neutral-950">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="text-muted-foreground hover:text-foreground lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <form action={actions.auth.signOut} aria-label="Sign out form">
          <SignOutButton />
        </form>
        <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </header>
  );
}
