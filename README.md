# Avalie o Boxe em Portugal

Este projeto é uma aplicação web desenvolvida com React e Next.js 14 (App Router) para avaliação do boxe em Portugal. A aplicação permite que usuários façam login com suas contas Google e preencham um formulário de avaliação com 10 perguntas em formato de rating de estrelas, além de um campo para sugestões de melhorias. Também inclui um dashboard para visualização das estatísticas das avaliações.

## Tecnologias Utilizadas

- **React + Next.js 14 (App Router)**: Framework para desenvolvimento frontend
- **Tailwind CSS**: Framework CSS para estilização responsiva
- **react-hook-form + Zod**: Biblioteca para gerenciamento e validação de formulários
- **next-auth**: Autenticação com Google (Gmail)
- **axios**: Cliente HTTP para requisições à API
- **canvas-confetti**: Biblioteca para efeitos visuais de confetti
- **recharts**: Biblioteca para criação de gráficos e visualizações de dados

## Funcionalidades

### Página de Login/Autenticação
- Header com logo
- Hero section com título "Avalie o Boxe em Portugal"
- Botão de login com Google usando next-auth
- Footer básico

### Página de Avaliação (após login)
- Formulário com 10 perguntas em formato de rating de 0-5 estrelas
- Campo de texto para sugestões de melhorias
- Botão de envio de avaliação

### Dashboard de Estatísticas
- Resumo geral das avaliações
- Visualização detalhada da média de cada pergunta
- Gráficos interativos (barras, radar e pizza)
- Sistema de abas para alternar entre diferentes visualizações
- Compatível com modo escuro

### Funcionalidades Extras
- **Dark mode toggle**: Alternância entre modo claro e escuro
- **Progress bar**: Barra de progresso durante o preenchimento do formulário
- **Confetti animation**: Animação de confetti ao enviar o formulário com sucesso

## Estrutura do Projeto

```
boxe-portugal-avaliacao/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── route.ts         # Configuração do next-auth
│   │   ├── avaliacao/
│   │   │   └── page.tsx         # Página de avaliação (protegida)
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Dashboard de estatísticas (protegido)
│   │   ├── globals.css          # Estilos globais
│   │   ├── layout.tsx           # Layout principal com providers
│   │   └── page.tsx             # Página inicial (login)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx # Provider de autenticação
│   │   │   └── LoginButton.tsx  # Botão de login com Google
│   │   ├── forms/
│   │   │   └── AvaliacaoForm.tsx # Formulário de avaliação
│   │   ├── layout/              # Componentes de layout
│   │   └── ui/
│   │       ├── Confetti.tsx     # Componente de animação confetti
│   │       ├── ThemeProvider.tsx # Provider de tema (dark/light)
│   │       └── ThemeToggle.tsx  # Botão de alternância de tema
│   ├── hooks/                   # Custom hooks
│   └── lib/
│       ├── api.ts               # Funções de API
│       └── types.ts             # Tipos e esquemas de validação
├── public/                      # Arquivos estáticos
├── tailwind.config.ts          # Configuração do Tailwind CSS
├── next.config.ts              # Configuração do Next.js
└── package.json                # Dependências do projeto
```

## Como Executar Localmente

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd boxe-portugal-avaliacao
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```
GOOGLE_CLIENT_ID=seu-client-id-do-google
GOOGLE_CLIENT_SECRET=seu-client-secret-do-google
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=uma-string-secreta-aleatoria
```

4. Execute o servidor de desenvolvimento:
```bash
pnpm dev
```

5. Acesse a aplicação em seu navegador:
```
http://localhost:3000
```

## Fluxo de Uso

1. O usuário acessa a página inicial e faz login com sua conta Google
2. Após autenticação, é redirecionado para a página de avaliação
3. Preenche o formulário com ratings para as 10 perguntas e opcionalmente adiciona sugestões
4. Ao enviar o formulário, recebe uma confirmação visual com animação de confetti
5. Pode acessar o dashboard em `/dashboard` para visualizar estatísticas de todas as avaliações

## Dashboard de Estatísticas

O dashboard oferece quatro visualizações diferentes:

1. **Resumo**: Exibe a média geral e detalhes de cada pergunta com barras de progresso
2. **Gráfico de Barras**: Apresenta as médias de cada categoria em formato de barras
3. **Radar**: Mostra a distribuição das médias em formato de radar, permitindo identificar áreas fortes e fracas
4. **Pizza**: Visualiza a proporção relativa das médias entre as diferentes categorias

Todas as visualizações são interativas e responsivas, adaptando-se a diferentes tamanhos de tela.

## Considerações sobre Produção

Para deploy em produção:

1. Configure as variáveis de ambiente no seu provedor de hospedagem
2. Execute o build da aplicação:
```bash
pnpm build
```

3. Inicie o servidor de produção:
```bash
pnpm start
```

## Validação de Formulários

Todos os campos de avaliação (estrelas) são obrigatórios. O botão de envio só é habilitado quando todos os campos são preenchidos. A validação é feita usando Zod em conjunto com react-hook-form.

## Responsividade

A aplicação foi desenvolvida seguindo o princípio de mobile-first e é totalmente responsiva, adaptando-se a diferentes tamanhos de tela.

## Melhorias Futuras

- Implementação de um backend real para armazenar as avaliações
- Filtros avançados no dashboard (por período, região, etc.)
- Exportação de dados em formatos como CSV ou PDF
- Suporte a múltiplos idiomas
- Testes automatizados
