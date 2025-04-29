"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AvaliacaoForm from "@/components/forms/AvaliacaoForm";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { IoMdLogOut } from "react-icons/io";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AvaliacaoPage() {
  const { data: session, status } = useSession();

  // Verificar se o usuário está autenticado
  if (status === "unauthenticated") {
    redirect("/");
  }

  // Exibir mensagem de carregamento enquanto verifica a sessão
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </header>

        <main className="flex-grow bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="space-y-8">
              {/* Skeleton do tipo de usuário */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Skeleton das perguntas */}
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 sm:mb-0 animate-pulse"></div>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <div key={j} className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skeleton do campo de sugestões */}
              <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-xl">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>

              {/* Skeleton do botão */}
              <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </main>

        <footer className="bg-white dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className=" text-[18px] md:text-2xl font-bold text-gray-900 dark:text-white">
            Boxe Portugal
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bem vindo, {session?.user?.name}
              </span>
              {session?.user?.image && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt="Foto do perfil"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

            </div>
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-medium text-gray-700  dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <AvaliacaoForm />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Boxe Portugal. Todos os direitos
            reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
