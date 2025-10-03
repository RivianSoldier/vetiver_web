import { updatePassword } from "../update-password-actions";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
      <div className="bg-gray-500 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Nova Senha
          </h1>
          <p className="text-gray-600 text-sm">Digite sua nova senha abaixo</p>
        </div>

        <form
          action={updatePassword}
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        >
          <label className="text-md" htmlFor="password">
            Nova Senha
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-4"
            name="password"
            type="password"
            placeholder="Digite sua nova senha"
            required
            minLength={6}
          />

          <label className="text-md" htmlFor="confirmPassword">
            Confirmar Nova Senha
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="confirmPassword"
            type="password"
            placeholder="Confirme sua nova senha"
            required
            minLength={6}
          />

          {searchParams?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {searchParams.error}
            </div>
          )}

          {searchParams?.message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {searchParams.message}
            </div>
          )}

          <button
            type="submit"
            className="bg-green-700 rounded-md px-4 py-2 text-white mb-2 hover:bg-green-800 transition-colors"
          >
            Atualizar Senha
          </button>

          <div className="text-center mt-4">
            <a
              href="/login"
              className="text-green-700 hover:text-green-800 text-sm underline"
            >
              Voltar para Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
