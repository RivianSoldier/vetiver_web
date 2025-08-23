import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">
          Welcome to the Home Page
        </h1>
        <p className="mt-4 text-lg text-white">
          This is a sample Next.js application with a protected dashboard.
        </p>
      </div>
      <Button
        asChild
        className="h-14 w-32 sm:w-36 md:w-40 rounded-full flex items-center justify-center bg-gradient-to-r from-[#45BF55] to-[#008D80] text-black font-poppins font-bold text-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-102 hover:brightness-110"
        type="submit"
      >
        <Link href="/login">Entrar</Link>
      </Button>
    </div>
  );
}
