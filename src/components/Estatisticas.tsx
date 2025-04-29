'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AvaliacaoStats } from '@/lib/types';
import { getAvaliacoesStats } from '@/lib/api';
import { TiStarFullOutline } from "react-icons/ti";
const perguntasTraduzidas: Record<string, string> = {
  velocidadeCarregamento: 'Velocidade de Carregamento',
  facilidadeNavegacao: 'Facilidade de Navegação',
  clarezaInformacoes: 'Clareza das Informações',
  qualidadeConteudo: 'Qualidade do Conteúdo',
  atualizacaoDados: 'Atualização dos Dados',
  designVisual: 'Design Visual',
  experienciaMobile: 'Experiência Mobile',
  satisfacaoGeral: 'Satisfação Geral',
  probabilidadeRecomendar: 'Probabilidade de Recomendar',
  funcionalidadesUteis: 'Funcionalidades Úteis',
};

export function Estatisticas() {
  const [tipoUsuario, setTipoUsuario] = useState<'atleta' | 'clube' | 'arbitro' | 'todos'>('todos');

  const { data: estatisticas, isLoading, isFetching } = useQuery<AvaliacaoStats[]>({
    queryKey: ['avaliacoes-stats', tipoUsuario],
    queryFn: () => getAvaliacoesStats(tipoUsuario),
  });

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 pt-4">
        <h2 className="text-2xl font-bold">Estatísticas das Avaliações</h2>
        <Select 
          value={tipoUsuario} 
          onValueChange={(value: 'atleta' | 'clube' | 'arbitro' | 'todos') => setTipoUsuario(value)}
          disabled={isFetching}
        >
          <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
            <SelectValue placeholder="Selecione o tipo"  className='text-gray-900 dark:text-gray-100'/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos" className='text-gray-900 dark:text-gray-100' >Todos</SelectItem>
            <SelectItem value="atleta" className='text-gray-900 dark:text-gray-100'>Atletas</SelectItem>
            <SelectItem value="clube" className='text-gray-900 dark:text-gray-100'>Clubes</SelectItem>
            <SelectItem value="arbitro" className='text-gray-900 dark:text-gray-100'>Árbitros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative min-h-[400px]">
        {isFetching ? (
          <div className="absolute inset-0 flex justify-center items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Carregando estatísticas...</p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {estatisticas?.map((estatistica) => (
            <Card key={estatistica.pergunta}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {perguntasTraduzidas[estatistica.pergunta]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-lg font-semibold flex flex-row items-center gap-2">
                        {estatistica.media.toFixed(1)}
                        <TiStarFullOutline color="#eab308"/>
                    </span>
                    <span className="text-muted-foreground">{estatistica.totalAvaliacoes} avaliações</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 