"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getAvaliacoesStats } from "@/lib/api";
import { AvaliacaoStats, perguntasMap } from "@/lib/types";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { signOut } from "next-auth/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<AvaliacaoStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resumo' | 'barras' | 'radar' | 'pizza'>('resumo');

  // Verificar se o usuário está autenticado
  if (status === "unauthenticated") {
    redirect("/");
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAvaliacoesStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar estatísticas. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Função para renderizar as barras de progresso das médias
  const renderProgressBar = (media: number) => {
    const percentage = (media / 5) * 100;
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Preparar dados para os gráficos
  const chartData = stats.map(stat => ({
    name: perguntasMap[stat.pergunta].split(' ')[0], // Usar apenas a primeira palavra para o eixo X
    fullName: perguntasMap[stat.pergunta],
    media: stat.media,
    totalAvaliacoes: stat.totalAvaliacoes
  }));

  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  // Exibir mensagem de carregamento enquanto verifica a sessão
  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-lg">Carregando estatísticas...</p>
      </div>
    );
  }

  // Dados para o gráfico de pizza
  const pizzaData = [
    {name: 'Clubes', value: 100},
    {name: 'Árbitros', value: 100},
    {name: 'Atletas', value: 100},
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">Boxe Portugal</div>
          <div className="flex items-center space-x-4">
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard de Avaliações</h1>
            <a 
              href="/avaliacao" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Voltar para Avaliação
            </a>
          </div>

          {error ? (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          ) : (
            <>
              {/* Tabs de navegação */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('resumo')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'resumo'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Resumo
                  </button>
                  <button
                    onClick={() => setActiveTab('barras')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'barras'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Gráfico de Barras
                  </button>
                  <button
                    onClick={() => setActiveTab('radar')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'radar'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Radar
                  </button>
                  <button
                    onClick={() => setActiveTab('pizza')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'pizza'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Pizza
                  </button>
                </nav>
              </div>

              {/* Conteúdo das tabs */}
              {activeTab === 'resumo' && (
                <>
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Resumo</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Total de avaliações: <span className="font-bold">{stats.length > 0 ? stats[0].totalAvaliacoes : 0}</span>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Média geral: <span className="font-bold">
                        {stats.length > 0 
                          ? (stats.reduce((acc, curr) => acc + curr.media, 0) / stats.length).toFixed(1) 
                          : "N/A"}
                      </span> / 5
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.map((stat) => (
                      <div key={stat.pergunta} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          {perguntasMap[stat.pergunta]}
                        </h3>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mr-2">
                            {stat.media.toFixed(1)}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">/ 5</span>
                        </div>
                        {renderProgressBar(stat.media)}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Baseado em {stat.totalAvaliacoes} avaliações
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'barras' && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Médias por Categoria</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip 
                          formatter={(value, name) => [value, 'Média']}
                          labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                              return payload[0].payload.fullName;
                            }
                            return label;
                          }}
                        />
                        <Legend />
                        <Bar dataKey="media" fill="#8884d8" name="Média" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'radar' && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Análise Radar</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} />
                        <Radar name="Média" dataKey="media" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip 
                          formatter={(value, name) => [value, 'Média']}
                          labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                              return payload[0].payload.fullName;
                            }
                            return label;
                          }}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'pizza' && (
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Distribuição por Categoria</h2>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pizzaData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pizzaData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} membros`, 'Total']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
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
