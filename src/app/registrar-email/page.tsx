"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaSpinner, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";

// Esquema de validação com Zod mais completo
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "O email é obrigatório")
    .email("Por favor, insira um email válido")
    .refine(
      (email) => !email.endsWith("@test.com"),
      "Domínios de teste não são permitidos"
    )
    .refine(
      (email) => !email.endsWith("@example.com"),
      "Domínios de exemplo não são permitidos"
    )
    .refine(
      (email) => {
        const domain = email.split('@')[1];
        return domain && domain.includes('.');
      },
      "O domínio do email deve ser válido"
    ),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "Você deve aceitar os termos de uso")
});

type EmailFormData = z.infer<typeof emailSchema>;

// Componente Toast para feedback
const Toast = ({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: 'success' | 'error'; 
  onClose: () => void;
}) => {
  return (
    <div className={`fixed top-4 right-4 flex items-center p-4 mb-4 rounded-lg shadow-lg ${
      type === 'success' 
        ? 'text-green-800 bg-green-50 dark:bg-green-900 dark:text-green-200' 
        : 'text-red-800 bg-red-50 dark:bg-red-900 dark:text-red-200'
    }`} role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        {type === 'success' ? (
          <FaCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
        ) : (
          <FaExclamationTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
        )}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button 
        type="button" 
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700" 
        aria-label="Close"
      >
        <span className="sr-only">Fechar</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

export default function EmailPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
      termsAccepted: true,
    },
  });

  const termsAccepted = watch("termsAccepted");

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Simular rate limiting
    if (rateLimitCount >= 3) {
      setSubmitError("Limite de tentativas excedido. Tente novamente mais tarde.");
      setToast({
        message: "Limite de tentativas excedido. Tente novamente mais tarde.",
        type: 'error'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Envio real para API
      const response = await fetch("/api/register-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao enviar email");
      }

      setSubmitSuccess(true);
      setToast({
        message: "Email enviado com sucesso! Verifique sua caixa de entrada.",
        type: 'success'
      });
      reset();
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : "Ocorreu um erro ao enviar o email. Tente novamente.";
      
      setSubmitError(errorMessage);
      setToast({
        message: errorMessage,
        type: 'error'
      });
      setRateLimitCount(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResubmit = () => {
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            Boxe Portugal
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            {/* Indicador de progresso similar ao da imagem de referência */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-3 h-3 rounded-full bg-blue-600 mr-1"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300 mx-1"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300 ml-1"></div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Profile info
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
              Fill in the data for profile. It will take a couple of minutes.
              You only need a passport
            </p>

            {/* Checkbox para termos de uso similar ao da imagem */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="termsAccepted"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                {...register("termsAccepted")}
              />
              <label htmlFor="termsAccepted" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I agree with <span className="text-blue-600 dark:text-blue-400">Terms of use</span>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="mt-1 mb-4 text-sm text-red-600 dark:text-red-400">
                {errors.termsAccepted.message}
              </p>
            )}

            {submitSuccess ? (
              <div className="bg-green-50 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative mb-6">
                <div className="flex items-center">
                  <FaCheckCircle className="w-5 h-5 mr-2" />
                  <p className="font-bold">Email enviado com sucesso!</p>
                </div>
                <p className="text-sm mt-2">
                  Verifique sua caixa de entrada para acessar o link da pesquisa.
                </p>
                <button
                  onClick={handleResubmit}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Registrar outro email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Seção de dados pessoais similar à imagem de referência */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Personal data
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Specify exactly as in your passport
                  </p>
                  
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`w-full px-3 py-2 border ${
                        errors.email
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-300 dark:border-gray-600"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                      placeholder="seu-email@exemplo.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="w-5 h-5 mr-2" />
                      <p className="font-bold">Erro</p>
                    </div>
                    <p className="text-sm mt-1">{submitError}</p>
                    
                    {/* Botão de reenviar */}
                    {submitError.includes("enviar email") && (
                      <button
                        type="button"
                        onClick={() => handleSubmit(onSubmit)()}
                        className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Tentar reenviar
                      </button>
                    )}
                  </div>
                )}

                {/* Contador de tentativas para rate limiting */}
                {rateLimitCount > 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
                    Tentativas restantes: {3 - rateLimitCount}/3
                  </p>
                )}

                {/* Botão similar ao "Go Next" da imagem de referência */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !termsAccepted || rateLimitCount >= 3}
                    className={`flex items-center justify-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
                      isSubmitting || !termsAccepted || rateLimitCount >= 3
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Go Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Voltar para página inicial
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}

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
