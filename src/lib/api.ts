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
export const getAvaliacoesStats = async (): Promise<AvaliacaoStats[]> => {
  try {
    // Em um ambiente real, faria uma requisição para a API
    // const response = await axios.get("/api/avaliacoes/stats");
    // return response.data;
    
    // Simulação de dados de estatísticas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      { pergunta: "velocidadeCarregamento", media: 4.2, totalAvaliacoes: 45 },
      { pergunta: "facilidadeNavegacao", media: 3.8, totalAvaliacoes: 45 },
      { pergunta: "clarezaInformacoes", media: 4.5, totalAvaliacoes: 45 },
      { pergunta: "qualidadeConteudo", media: 4.7, totalAvaliacoes: 45 },
      { pergunta: "atualizacaoDados", media: 3.9, totalAvaliacoes: 45 },
      { pergunta: "designVisual", media: 4.3, totalAvaliacoes: 45 },
      { pergunta: "experienciaMobile", media: 3.6, totalAvaliacoes: 45 },
      { pergunta: "satisfacaoGeral", media: 4.1, totalAvaliacoes: 45 },
      { pergunta: "probabilidadeRecomendar", media: 4.4, totalAvaliacoes: 45 },
      { pergunta: "funcionalidadesUteis", media: 3.7, totalAvaliacoes: 45 },
    ];
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    throw error;
  }
};
