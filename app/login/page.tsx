"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import Image from "next/image";
import { Mail, Lock, Loader2Icon } from "lucide-react";
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

interface InputFieldProps {
  control: any;
  name: string;
  type: string;
  placeholder: string;
  disabled: boolean;
}

interface PasswordFieldProps {
  control: any;
  name: string;
  disabled: boolean;
}

function InputField({
  control,
  name,
  type,
  placeholder,
  disabled,
}: InputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <Input
              className="h-12 w-full rounded-sm"
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function InputPasswordField({ control, name, disabled }: PasswordFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <InputPassword
              className="h-12 w-full rounded-sm"
              id={name}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SubmitButtonProps {
  label: string;
  loadingLabel: string;
  isPending: boolean;
  disabled: boolean;
  onClick: () => void;
}

function SubmitButton({
  label,
  loadingLabel,
  isPending,
  disabled,
  onClick,
}: SubmitButtonProps) {
  return (
    <Button
      className="h-14 w-40 rounded-full bg-gradient-to-r from-[#45BF55] to-[#008D80] text-black font-poppins font-bold text-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-102 hover:brightness-110"
      type="submit"
      disabled={disabled}
      onClick={onClick}
    >
      {isPending ? <Loader2Icon className="animate-spin " /> : label}
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
  const [error, setError] = useState<string | null>(null);
  const [isLoginPending, startLoginTransition] = useTransition();
  const [isSignupPending, startSignupTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (
    action: (formData: FormData) => Promise<void | { error: string | null }>,
    values: z.infer<typeof formSchema>,
    startTransition: (callback: () => Promise<void>) => void
  ) => {
    setError(null);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    startTransition(async () => {
      try {
        const result = await action(formData);

        if (result && result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const isAnyPending = isLoginPending || isSignupPending;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d0d0d]">
      <div className="absolute top-0 flex flex-col w-full h-[37%] bg-gradient-to-b from-[#45BF55] to-[#008D80] justify-start items-center">
        <Image
          className="mt-10"
          src="/logo_text.svg"
          alt="Logo"
          width={120}
          height={120}
        />
        <h1 className="text-3xl font-bold font-poppins text-[#0d0d0d] sm:text-4xl">
          Vetiver
        </h1>
      </div>
      <div className="absolute top-[24%] flex flex-col items-center justify-center w-[94%] mx-auto bg-[#0d0d0d] rounded-sm p-4 sm:p-6 gap-4 sm:gap-6 sm:top-[28%] md:w-1/2 md:max-w-[800px]">
        <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#45BF55] to-[#008D80] p-[2px]">
          <div className="h-full w-full bg-[#0d0d0d] rounded-sm"></div>
        </div>
        <div className="flex flex-col items-center justify-evenly z-10 w-full py-16 gap-y-16">
          <div>
            <Header text="Bem vindo!" />
            <p className="text-sm text-center font-nunito font-thin text-white pt-2 sm:text-base">
              Entre ou crie uma conta para continuar
            </p>
          </div>
          <Form {...form}>
            <form className="space-y-6 w-full relative z-10 flex flex-col items-center justify-center">
              <div className="flex flex-row justify-center items-center gap-2 sm:gap-3 w-full max-w-lg">
                <Mail className="text-[#A6A6A6] w-5 h-5 sm:w-6 sm:h-6" />
                <InputField
                  control={form.control}
                  name="email"
                  type="email"
                  placeholder="Email"
                  disabled={isAnyPending}
                />
              </div>
              <div className="flex flex-row justify-center items-center gap-2 sm:gap-3 w-full max-w-lg">
                <Lock className="text-[#A6A6A6] w-5 h-5 sm:w-6 sm:h-6" />
                <InputPasswordField
                  control={form.control}
                  name="password"
                  disabled={isAnyPending}
                />
              </div>
              <div className="flex justify-end w-full max-w-lg">
                <Link
                  href="/forgot-password"
                  className="font-nunito text-sm bg-linear-to-r from-[#45BF55] to-[#008D80] inline-block text-transparent bg-clip-text antialiased hover:opacity-80"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              {error && (
                <div className="text-[#F22742] text-sm text-center sm:text-base">
                  {error}
                </div>
              )}
              <div className="flex mt-10 gap-4 justify-center">
                <SubmitButton
                  label="Entrar"
                  loadingLabel="Fazendo login..."
                  isPending={isLoginPending}
                  disabled={isAnyPending}
                  onClick={() =>
                    form.handleSubmit((values) =>
                      handleSubmit(login, values, startLoginTransition)
                    )()
                  }
                />
                <SubmitButton
                  label="Criar conta"
                  loadingLabel="Criando conta..."
                  isPending={isSignupPending}
                  disabled={isAnyPending}
                  onClick={() =>
                    form.handleSubmit((values) =>
                      handleSubmit(signup, values, startSignupTransition)
                    )()
                  }
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
