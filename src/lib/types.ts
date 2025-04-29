import { z } from "zod";

// Esquema de validação para os dados de avaliação
export const avaliacaoSchema = z.object({
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

export type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>;

// Tipo para os dados de estatísticas
export type AvaliacaoStats = {
  pergunta: string;
  media: number;
  totalAvaliacoes: number;
  tipoUsuario?: 'atleta' | 'clube' | 'arbitro';
};

// Mapeamento de IDs para nomes de perguntas
export const perguntasMap: Record<string, string> = {
  velocidadeCarregamento: "Velocidade de carregamento do site",
  facilidadeNavegacao: "Facilidade de navegação",
  clarezaInformacoes: "Clareza das informações",
  qualidadeConteudo: "Qualidade do conteúdo",
  atualizacaoDados: "Atualização dos dados",
  designVisual: "Design visual",
  experienciaMobile: "Experiência mobile",
  satisfacaoGeral: "Satisfação geral",
  probabilidadeRecomendar: "Probabilidade de recomendar",
  funcionalidadesUteis: "Funcionalidades úteis",
};
