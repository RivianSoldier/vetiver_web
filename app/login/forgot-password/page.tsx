import { resetPassword } from "../reset-password-actions";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  text: string;
}

function Header({ text }: HeaderProps) {
  return (
    <h2 className="text-2xl font-bold text-center text-white font-poppins relative z-10 sm:text-3xl">
      {text}
    </h2>
  );
}

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-0 flex flex-col w-full h-[37%] bg-gradient-to-b from-[#45BF55] to-[#008D80] justify-start items-center">
        <Link href="/">
          <Image
            className="mt-10 w-14 h-14 cursor-pointer sm:w-20 sm:h-20 md:w-32 md:h-32"
            src="/logo_text.svg"
            alt="Logo"
            width={120}
            height={120}
            priority
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins text-[#0d0d0d]">
          Vetiver
        </h1>
      </div>
      <div className="absolute top-[24%] flex flex-col items-center justify-center w-[94%] mx-auto bg-[#0d0d0d] rounded-sm p-4 sm:p-6 gap-4 sm:gap-6 sm:top-[30%] md:w-1/2 md:max-w-[800px]">
        <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#45BF55] to-[#008D80] p-[2px] mb-4 sm:mb-6 md:mb-8">
          <Link
            className="absolute top-4 left-4 w-7 h-7 text-white cursor-pointer"
            href="/login"
          >
            <ChevronLeft className="w-full h-full" />
          </Link>
          <div className="h-full w-full bg-[#0d0d0d] rounded-sm"></div>
        </div>
        <div className="flex flex-col items-center justify-evenly z-10 w-full py-16 gap-y-16">
          <div>
            <Header text="Esqueceu a senha?" />
            <p className="text-sm text-center font-nunito font-thin text-white pt-2 sm:text-base">
              Digite seu email para receber instruções de recuperação
            </p>
          </div>

          <form
            action={resetPassword}
            className="space-y-6 w-full relative z-10 flex flex-col items-center justify-center"
          >
            <div className="flex flex-row justify-center items-center gap-2 sm:gap-3 w-full max-w-lg">
              <Mail className="text-[#A6A6A6] w-5 h-5 sm:w-6 sm:h-6" />
              <Input
                className="h-12 w-full rounded-sm"
                name="email"
                type="email"
                placeholder="Digite seu email"
                required
              />
            </div>

            {searchParams?.error && (
              <div className="text-[#F22742] text-sm text-center sm:text-base w-full max-w-xl">
                {searchParams.error}
              </div>
            )}

            {searchParams?.message && (
              <div className="text-[#45BF55] text-sm text-center sm:text-base w-full max-w-xl">
                {searchParams.message}
              </div>
            )}

            <div className="flex mt-6 sm:mt-8 md:mt-10 gap-4 justify-center">
              <button
                type="submit"
                className="h-14 w-48 sm:w-52 md:w-56 rounded-full flex items-center justify-center bg-gradient-to-r from-[#45BF55] to-[#008D80] text-black font-poppins font-bold text-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-102 hover:brightness-110"
              >
                ENVIAR EMAIL
              </button>
            </div>

            <div className="flex justify-center w-full max-w-xl mt-4">
              <Link
                href="/login"
                className="font-nunito text-sm bg-linear-to-r from-[#45BF55] to-[#008D80] inline-block text-transparent bg-clip-text antialiased hover:opacity-80"
              >
                Voltar para Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
