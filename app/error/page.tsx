"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Ops! Algo deu errado
          </h1>

          <p className="text-gray-600 mb-8">
            Encontramos um problema inesperado. Nossa equipe foi notificada e
            está trabalhando para resolver isso.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.back()}
              className="w-full bg-gradient-to-r from-[#008D80] to-[#45BF55] hover:brightness-110 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Voltar
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Ir para Início
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Precisa de ajuda?</p>
            <a
              href="mailto:support@vetiver.com"
              className="text-[#008D80] hover:text-[#45BF55] text-sm font-medium transition-colors duration-200"
            >
              Entre em contato conosco
            </a>
          </div>
        </div>

        {/* Error Code */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Código do erro: #VET{Date.now().toString().slice(-6)}
          </p>
        </div>
      </div>
    </div>
  );
}

