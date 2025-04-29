"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { mockSubmitAvaliacao } from "@/lib/api";
import Confetti from "@/components/ui/Confetti";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { FaCheck } from "react-icons/fa";

// Esquema de validação com Zod
const avaliacaoSchema = z.object({
  tipoUsuario: z.enum(["atleta", "clube", "arbitro"], {
    required_error: "Por favor, selecione seu tipo de usuário",
  }),
  velocidadeCarregamento: z.number().min(1, "Por favor, avalie este item").max(5),
  facilidadeNavegacao: z.number().min(1, "Por favor, avalie este item").max(5),
  clarezaInformacoes: z.number().min(1, "Por favor, avalie este item").max(5),
  qualidadeConteudo: z.number().min(1, "Por favor, avalie este item").max(5),
  atualizacaoDados: z.number().min(1, "Por favor, avalie este item").max(5),
  designVisual: z.number().min(1, "Por favor, avalie este item").max(5),
  experienciaMobile: z.number().min(1, "Por favor, avalie este item").max(5),
  satisfacaoGeral: z.number().min(1, "Por favor, avalie este item").max(5),
  probabilidadeRecomendar: z.number().min(1, "Por favor, avalie este item").max(5),
  funcionalidadesUteis: z.number().min(1, "Por favor, avalie este item").max(5),
  sugestoes: z.string().optional(),
});

type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;

// Componente de estrelas para avaliação
const StarRating = ({
  rating,
  setRating,
  name,
}: {
  rating: number;
  setRating: (value: number) => void;
  name: string;
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <FaStar
              className="transition-colors duration-200 ease-in-out"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              size={24}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default function AvaliacaoForm() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Redirecionar se não estiver autenticado
  if (!session) {
    redirect("/");
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      velocidadeCarregamento: 0,
      facilidadeNavegacao: 0,
      clarezaInformacoes: 0,
      qualidadeConteudo: 0,
      atualizacaoDados: 0,
      designVisual: 0,
      experienciaMobile: 0,
      satisfacaoGeral: 0,
      probabilidadeRecomendar: 0,
      funcionalidadesUteis: 0,
      sugestoes: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: AvaliacaoFormData) => {
    setIsSubmitting(true);

    try {
      // Simulação de envio para API
      await mockSubmitAvaliacao(data);

      console.log("Dados enviados:", data);
      setSubmitSuccess(true);

      // Ativar animação de confetti
      setShowConfetti(true);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Questões para o formulário
  const questions = [
    {
      id: "velocidadeCarregamento",
      label: "Velocidade de carregamento do site",
    },
    { id: "facilidadeNavegacao", label: "Facilidade de navegação" },
    { id: "clarezaInformacoes", label: "Clareza das informações" },
    { id: "qualidadeConteudo", label: "Qualidade do conteúdo" },
    { id: "atualizacaoDados", label: "Atualização dos dados" },
    { id: "designVisual", label: "Design visual" },
    { id: "experienciaMobile", label: "Experiência mobile" },
    { id: "satisfacaoGeral", label: "Satisfação geral" },
    { id: "probabilidadeRecomendar", label: "Probabilidade de recomendar" },
    { id: "funcionalidadesUteis", label: "Funcionalidades úteis" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-sm md:text-2xl font-bold">
          Avalie a sua experiência no nosso site
        </h1>
      
      </div>

      {submitSuccess ? (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Sucesso!</strong>
          <span className="block sm:inline">
            {" "}
            Sua avaliação foi enviada com sucesso. Obrigado por contribuir!
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Campo de tipo de usuário */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Você é:
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label
                className={`
                  relative flex cursor-pointer rounded-xl border bg-white justify-center items-center p-4
                  shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
                  ${
                    watch("tipoUsuario") === "atleta"
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-gray-200"
                  }
                  ${
                    watch("tipoUsuario") !== "atleta"
                      ? "hover:scale-105 active:scale-95"
                      : ""
                  }
                `}
              >
                <input
                  type="radio"
                  {...register("tipoUsuario")}
                  value="atleta"
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Atleta
                  </span>
                  {watch("tipoUsuario") === "atleta" && <FaCheck color="#166534" />}
                </div>
              </label>
              <label
                className={`
                  relative flex cursor-pointer rounded-xl border bg-white justify-center items-center p-4
                  shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
                  ${
                    watch("tipoUsuario") === "clube"
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-gray-200"
                  }
                  ${
                    watch("tipoUsuario") !== "clube"
                      ? "hover:scale-105 active:scale-95"
                      : ""
                  }
                `}
              >
                <input
                  type="radio"
                  {...register("tipoUsuario")}
                  value="clube"
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Clube
                  </span>
                  {watch("tipoUsuario") === "clube" && <FaCheck color="#166534" />}
                </div>
              </label>
              <label
                className={`
                  relative flex cursor-pointer rounded-xl border bg-white justify-center items-center p-4
                  shadow-md hover:shadow-lg transition-all duration-300 ease-in-out
                  ${
                    watch("tipoUsuario") === "arbitro"
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-gray-200"
                  }
                  ${
                    watch("tipoUsuario") !== "arbitro"
                      ? "hover:scale-105 active:scale-95"
                      : ""
                  }
                `}
              >
                <input
                  type="radio"
                  {...register("tipoUsuario")}
                  value="arbitro"
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Árbitro
                  </span>
                  {watch("tipoUsuario") === "arbitro" && <FaCheck color="#166534" />}
                </div>
              </label>
            </div>
            {errors.tipoUsuario && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.tipoUsuario.message}
              </p>
            )}
          </div>

          {/* Perguntas de avaliação */}
          <div className="space-y-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-white dark:bg-gray-800 p-7 rounded-xl shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label
                    htmlFor={question.id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-0"
                  >
                    {question.label}
                  </label>
                  <StarRating
                    rating={watch(question.id as keyof AvaliacaoFormData) as number}
                    setRating={(value) => {
                      setValue(question.id as keyof AvaliacaoFormData, value, {
                        shouldValidate: true,
                      });
                    }}
                    name={question.id}
                  />
                </div>
                {errors[question.id as keyof AvaliacaoFormData] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors[question.id as keyof AvaliacaoFormData]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Campo de sugestões */}
          <div className="bg-white dark:bg-gray-800 p-4  shadow rounded-xl">
            <label
              htmlFor="sugestoes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Deixe sua sugestão para melhorias
            </label>
            <textarea
              id="sugestoes"
              rows={4}
              className="w-full rounded-xl px-3 py-2 border border-gray-300 dark:border-gray-600  shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Suas sugestões são muito importantes para nós..."
              {...register("sugestoes")}
            ></textarea>
          </div>

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`w-full py-3 px-4  text-white font-medium transition-colors rounded-xl ${
              !isValid || isSubmitting
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </button>

          {!isValid && (
            <p className="text-sm text-red-500 dark:text-red-400">
              Por favor, responda todas as perguntas antes de enviar.
            </p>
          )}
        </form>
      )}

      {/* Componente de confetti */}
      <Confetti active={showConfetti} />
    </div>
  );
}
