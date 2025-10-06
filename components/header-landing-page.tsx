import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
export function LandingPageHeader() {
  return (
    <div className="flex flex-row items-center justify-between min-h-16 md:min-h-24 bg-[#0d0d0d] border-b-[1px] border-[#404040] w-full px-3 md:px-6">
      <div className="flex flex-row items-center">
        <div>
          <Image src="/logo_lp.svg" alt="Logo" width={68} height={68} />
        </div>
        <h1 className="text-white text-md sm:text-lg md:text-2xl font-bold font-poppins">
          Vetiver
        </h1>
      </div>
      <div>
        <Button
          asChild
          className="h-9 md:h-10 w-32 md:w-40 rounded-full flex items-center justify-center bg-white text-black font-poppins font-bold text-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-102 hover:brightness-110"
          type="submit"
        >
          <Link href="/login">Lançar APP</Link>
        </Button>
      </div>
    </div>
  );
}
