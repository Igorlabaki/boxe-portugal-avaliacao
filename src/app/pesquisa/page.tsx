"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import AvaliacaoForm from "@/components/forms/AvaliacaoForm";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function PesquisaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    // Verificar se o email está presente na URL
    if (!email) {
      router.push("/registrar-email");
    }
    
    // Aqui seria o lugar para verificar no banco de dados se o email existe
    // Como não estamos usando banco de dados real, apenas simulamos a verificação
    
    // Se o usuário não estiver autenticado, redirecionamos para a página inicial
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [email, router, status]);

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
            <ThemeToggle />
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
          {email ? (
            <>
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-4 py-3 rounded relative mb-6">
                <p className="font-bold">Bem-vindo à pesquisa!</p>
                <p className="text-sm">Você está acessando com o email: {email}</p>
              </div>
              <AvaliacaoForm />
            </>
          ) : (
            <div className="bg-red-50 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6">
              <p className="font-bold">Email não encontrado</p>
              <p className="text-sm">
                Você precisa fornecer um email válido para acessar a pesquisa.
                <Link href="/registrar-email" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">
                  Registrar email
                </Link>
              </p>
            </div>
          )}
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
