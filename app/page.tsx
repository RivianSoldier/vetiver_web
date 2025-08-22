import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4 text-lg">
          This is a sample Next.js application with a protected dashboard.
        </p>
      </div>
      <Link href="/private/" passHref>
        <Button asChild>
          <span>Entrar</span>
        </Button>
      </Link>
    </div>
  );
}
