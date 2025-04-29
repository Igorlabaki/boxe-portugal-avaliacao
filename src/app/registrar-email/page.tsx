"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { signOut } from "next-auth/react";

// Esquema de validação com Zod
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "O email é obrigatório")
    .email("Por favor, insira um email válido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

// Mock de emails registrados (substitua por dados reais)
const mockEmails = [
  "usuario1@exemplo.com",
  "usuario2@exemplo.com",
  "usuario3@exemplo.com",
];

export default function EmailPage() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emails, setEmails] = useState<string[]>(mockEmails);
  const [filter, setFilter] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

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
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
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

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmails(prev => [...prev, data.email]);
      reset();
    } catch (error) {
      console.error("Erro ao registrar email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-[18px] md:text-2xl font-bold text-gray-900 dark:text-white">
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
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-8">
            {/* Formulário de email */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Registrar Email
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full px-3 py-2 border rounded-xl border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Digite o email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 rounded-xl border border-transparent  shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Registrar Email
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Lista de emails registrados */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Emails Registrados
              </h2>
              <div className="space-y-2">
              <div className="mb-4">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Filtrar emails..."
                />
              </div>
                {emails
                  .filter(email => 
                    email.toLowerCase().includes(filter.toLowerCase())
                  )
                  .map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <span className="text-gray-900 dark:text-white">{email}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
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
