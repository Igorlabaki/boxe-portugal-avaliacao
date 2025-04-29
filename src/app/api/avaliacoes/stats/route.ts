import { NextResponse } from 'next/server';

// Dados simulados para diferentes tipos de usuário
const dadosSimulados = {
  atleta: [
    { pergunta: "velocidadeCarregamento", media: 4.5, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "facilidadeNavegacao", media: 4.2, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "clarezaInformacoes", media: 4.7, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "qualidadeConteudo", media: 4.8, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "atualizacaoDados", media: 4.1, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "designVisual", media: 4.4, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "experienciaMobile", media: 4.3, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "satisfacaoGeral", media: 4.6, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "probabilidadeRecomendar", media: 4.7, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
    { pergunta: "funcionalidadesUteis", media: 4.2, totalAvaliacoes: 20, tipoUsuario: 'atleta' },
  ],
  clube: [
    { pergunta: "velocidadeCarregamento", media: 3.8, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "facilidadeNavegacao", media: 3.5, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "clarezaInformacoes", media: 4.0, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "qualidadeConteudo", media: 4.2, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "atualizacaoDados", media: 3.7, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "designVisual", media: 3.9, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "experienciaMobile", media: 3.6, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "satisfacaoGeral", media: 3.8, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "probabilidadeRecomendar", media: 4.0, totalAvaliacoes: 15, tipoUsuario: 'clube' },
    { pergunta: "funcionalidadesUteis", media: 3.7, totalAvaliacoes: 15, tipoUsuario: 'clube' },
  ],
  arbitro: [
    { pergunta: "velocidadeCarregamento", media: 4.0, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "facilidadeNavegacao", media: 3.8, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "clarezaInformacoes", media: 4.2, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "qualidadeConteudo", media: 4.3, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "atualizacaoDados", media: 3.9, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "designVisual", media: 4.1, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "experienciaMobile", media: 3.7, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "satisfacaoGeral", media: 4.0, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "probabilidadeRecomendar", media: 4.1, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
    { pergunta: "funcionalidadesUteis", media: 3.8, totalAvaliacoes: 10, tipoUsuario: 'arbitro' },
  ],
  todos: [
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
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tipoUsuario = searchParams.get('tipoUsuario') as 'atleta' | 'clube' | 'arbitro' | 'todos' | null;

  // Simular um pequeno atraso para simular uma chamada de API real
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (tipoUsuario && tipoUsuario !== 'todos') {
    return NextResponse.json(dadosSimulados[tipoUsuario]);
  }

  return NextResponse.json(dadosSimulados.todos);
} 