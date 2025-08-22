"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import Image from "next/image";

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
  label: string;
  type: string;
  placeholder: string;
  description: string;
  disabled: boolean;
}

function InputField({
  control,
  name,
  label,
  type,
  placeholder,
  description,
  disabled,
}: InputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
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
    <Button type="submit" disabled={disabled} onClick={onClick}>
      {isPending ? loadingLabel : label}
    </Button>
  );
}

interface HeaderProps {
  text: string;
}

function Header({ text }: HeaderProps) {
  return (
    <h2 className="text-2xl font-bold text-center text-white font-poppins relative z-10">
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
    action: (formData: FormData) => Promise<void>,
    values: z.infer<typeof formSchema>,
    startTransition: (callback: () => Promise<void>) => void
  ) => {
    setError(null);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const isAnyPending = isLoginPending || isSignupPending;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d0d0d] static">
      <div className="absolute top-0 flex flex-col w-full h-[300px] bg-gradient-to-b from-[#45BF55] to-[#008D80] justify-start items-center">
        <Image
          className="mt-10"
          src="/logo_text.svg"
          alt="Logo"
          width={120}
          height={120}
        />
        <h1 className="text-3xl font-bold font-poppins text-[#0d0d0d]">
          Vetiver
        </h1>
      </div>
      <div className="absolute top-[230px] flex flex-col items-center justify-center h-fit p-6 gap-6 w-[80%] max-w-md mx-auto bg-[#0d0d0d] rounded-sm">
        <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#45BF55] to-[#008D80] p-[2px]">
          <div className="h-full w-full bg-[#0d0d0d] rounded-sm"></div>
        </div>
        <Header text="Bem vindo de volta!" />
        <Form {...form}>
          <form className="space-y-6 w-full relative z-10">
            <InputField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              description="This is the email address you'll use to log in."
              disabled={isAnyPending}
            />
            <InputField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              description="Password must be at least 6 characters long."
              disabled={isAnyPending}
            />
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="flex gap-4">
              <SubmitButton
                label="Log in"
                loadingLabel="Logging in..."
                isPending={isLoginPending}
                disabled={isAnyPending}
                onClick={() =>
                  form.handleSubmit((values) =>
                    handleSubmit(login, values, startLoginTransition)
                  )()
                }
              />
              <SubmitButton
                label="Sign up"
                loadingLabel="Signing up..."
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
  );
}
