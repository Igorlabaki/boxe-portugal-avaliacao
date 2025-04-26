"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AvaliacaoForm from "@/components/forms/AvaliacaoForm";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function AvaliacaoPage() {
  const { data: session, status } = useSession();

  // Verificar se o usuário está autenticado
  if (status === "unauthenticated") {
    redirect("/");
  }

  // Exibir mensagem de carregamento enquanto verifica a sessão
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">Boxe Portugal</div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
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
            &copy; {new Date().getFullYear()} Boxe Portugal. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
