"use client";
import { actions } from "../actions";

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-200">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="text-muted-foreground mt-2">
        Welcome to your dashboard. You can manage your account and settings
        here.
      </p>
      <button
        className="bg-primary text-primary-foreground mt-4 rounded-md px-4 py-2"
        onClick={() => actions.auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
