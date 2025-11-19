import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen items-center justify-center">
      <Link
        href="/"
        className="bg-primary hover:bg-primary/90 absolute top-8 left-8 rounded-lg px-4 py-2 text-white transition-all"
      >
        ← Home
      </Link>
      {children}
    </div>
  );
}
