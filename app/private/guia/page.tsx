import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function GuidePage({}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-[#0d0d0d] flex flex-col flex-1">
        <div className="p-6 overflow-y-auto w-full max-w-7xl mx-auto auto-rows-max justify-items-center">
          <h1 className="text-3xl font-poppins font-bold text-white mb-4">
            {" "}
            Guia de uso{" "}
          </h1>
          <p className="text-sm text-[#a6a6a6] font-nunito mb-2">
            Bem-vindo ao guia de uso do Vetiver! Aqui você encontrará todas as
            informações necessárias para utilizar a ferramenta de forma
            eficiente.
          </p>
        </div>
      </div>
    </div>
  );
}
