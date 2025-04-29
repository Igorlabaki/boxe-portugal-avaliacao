import axios from "axios";
import { AvaliacaoFormData, AvaliacaoStats } from "./types";

// Função para enviar os dados do formulário para a API
export const submitAvaliacao = async (data: AvaliacaoFormData) => {
  try {
    // Simulação de endpoint de API
    // Em um ambiente real, substituiria por uma URL real
    const response = await axios.post("/api/avaliacoes", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
    throw error;
  }
};

// Função para simular uma resposta de API sem fazer uma requisição real
export const mockSubmitAvaliacao = async (data: AvaliacaoFormData) => {
  // Simula o tempo de resposta de uma API real
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simula uma resposta bem-sucedida
  return {
    success: true,
    message: "Avaliação enviada com sucesso",
    data: {
      id: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      ...data
    }
  };
};

// Função para obter estatísticas das avaliações
export async function getAvaliacoesStats(tipoUsuario?: 'atleta' | 'clube' | 'arbitro' | 'todos') {
  const response = await fetch('/api/avaliacoes/stats' + (tipoUsuario && tipoUsuario !== 'todos' ? `?tipoUsuario=${tipoUsuario}` : ''));
  if (!response.ok) {
    throw new Error('Erro ao buscar estatísticas');
  }
  return response.json();
}
