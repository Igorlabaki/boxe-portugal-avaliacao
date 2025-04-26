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

// Esquema de validação com Zod
const avaliacaoSchema = z.object({
  velocidadeCarregamento: z.number().min(0).max(5),
  facilidadeNavegacao: z.number().min(0).max(5),
  clarezaInformacoes: z.number().min(0).max(5),
  qualidadeConteudo: z.number().min(0).max(5),
  atualizacaoDados: z.number().min(0).max(5),
  designVisual: z.number().min(0).max(5),
  experienciaMobile: z.number().min(0).max(5),
  satisfacaoGeral: z.number().min(0).max(5),
  probabilidadeRecomendar: z.number().min(0).max(5),
  funcionalidadesUteis: z.number().min(0).max(5),
  sugestoes: z.string().optional(),
});

type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;

// Componente de estrelas para avaliação
const StarRating = ({ 
  rating, 
  setRating, 
  name 
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
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Redirecionar se não estiver autenticado
  if (!session) {
    redirect("/");
  }
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AvaliacaoFormData>({
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
    }
  });
  
  // Observar todos os valores para calcular o progresso
  const formValues = watch();
  
  // Calcular progresso do formulário
  const calculateProgress = () => {
    const totalFields = 10; // Número de campos de avaliação
    let filledFields = 0;
    
    Object.entries(formValues).forEach(([key, value]) => {
      if (key !== 'sugestoes' && value > 0) {
        filledFields++;
      }
    });
    
    const percentage = Math.round((filledFields / totalFields) * 100);
    setProgressPercentage(percentage);
  };
  
  // Atualizar progresso quando os valores mudarem
  useState(() => {
    calculateProgress();
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
    { id: "velocidadeCarregamento", label: "Velocidade de carregamento do site" },
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
        <h1 className="text-sm md:text-2xl font-bold">Avaliação do  Site da Associacao Portuguesa de Boxe</h1>
        <ThemeToggle />
      </div>
      
      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Progresso: {progressPercentage}%</p>
      
      {submitSuccess ? (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Sucesso!</strong>
          <span className="block sm:inline"> Sua avaliação foi enviada com sucesso. Obrigado por contribuir!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Perguntas de avaliação */}
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label htmlFor={question.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-0">
                    {question.label}
                  </label>
                  <StarRating
                    rating={formValues[question.id as keyof AvaliacaoFormData] as number}
                    setRating={(value) => {
                      setValue(question.id as keyof AvaliacaoFormData, value, { shouldValidate: true });
                      calculateProgress();
                    }}
                    name={question.id}
                  />
                </div>
                {errors[question.id as keyof AvaliacaoFormData] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">Este campo é obrigatório</p>
                )}
              </div>
            ))}
          </div>
          
          {/* Campo de sugestões */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <label htmlFor="sugestoes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deixe sua sugestão para melhorias
            </label>
            <textarea
              id="sugestoes"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Suas sugestões são muito importantes para nós..."
              {...register("sugestoes")}
            ></textarea>
          </div>
          
          {/* Botão de envio */}
          <button
            type="submit"
            disabled={isSubmitting || progressPercentage < 100}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              progressPercentage < 100 || isSubmitting
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </button>
          
          {progressPercentage < 100 && (
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
