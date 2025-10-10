"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { Mail, Loader2Icon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import InputPassword from "@/components/ui/input-password";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface InputFieldProps {
  control: Control<FormSchemaType>;
  name: "email" | "password";
  type: string;
  placeholder: string;
  disabled: boolean;
}

interface PasswordFieldProps {
  control: Control<FormSchemaType>;
  name: "password";
  disabled: boolean;
}

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isPending: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function SubmitButton({
  label,
  isPending,
  disabled,
  onClick,
}: SubmitButtonProps) {
  return (
    <Button
      className="h-14 w-32 sm:w-36 md:w-40 rounded-full flex items-center justify-center bg-gradient-to-r from-[#45BF55] to-[#008D80] text-black font-poppins font-bold text-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-102 hover:brightness-110"
      type="submit"
      disabled={disabled || isPending}
      onClick={onClick}
    >
      {isPending ? <Loader2Icon className="animate-spin" /> : label}
    </Button>
  );
}

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

export default function LoginPage() {
  const [error] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-0 flex flex-col w-full h-[37%] bg-gradient-to-b from-[#45BF55] to-[#008D80] justify-start items-center">
        <Link href="/">
          <Image
            className="mt-10 w-14 h-14 cursor-pointer sm:w-20 sm:h-20 md:w-30 md:h-30"
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
      <div className="absolute top-[24%] flex flex-col items-center justify-center w-[94%] mx-auto bg-[#0d0d0d] rounded-sm p-4 sm:p-6 gap-4 sm:gap-6 sm:top-[30%] md:w-1/2 md:max-w-[800px] ">
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
            <Header text="Confirmar e-mail" />
            <p className="text-sm text-center font-nunito font-thin text-white pt-2 sm:text-base">
              Verifique seu e-mail
            </p>
          </div>
          <Form {...form}>
            <form className="space-y-6 w-full relative z-10 flex flex-col items-center justify-center">
              <div className="flex flex-row justify-center items-center gap-2 sm:gap-3 w-full max-w-lg">
                <Mail
                  strokeWidth={1}
                  className="text-white w-12 h-12 sm:w-24 sm:h-24"
                />
              </div>
              <div>
                <p className="font-nunito text-lg text-center text-white text-wrap">
                  Um link de confirmação foi enviado para o seu e-mail.
                </p>
              </div>

              {error && (
                <div className="text-[#F22742] text-sm text-center sm:text-base">
                  {error}
                </div>
              )}
              <div className="flex mt-6 sm:mt-8 md:mt-10 gap-4 justify-center"></div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
