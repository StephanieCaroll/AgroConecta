# 🌱 AgroConecta

Plataforma web que conecta a **agricultura familiar** aos mercados: o produtor cadastra o que produz, descobre quem está comprando, planeja a colheita, organiza as entregas e acompanha o clima.

> **Aluno(a):** _escreva aqui o seu nome_ · **Disciplina:** _nome da disciplina_ · **Professor(a):** _nome_

## 1. Problema escolhido (Banco de BOs)

Pequenos produtores da agricultura familiar têm dificuldade para **vender com regularidade e a bom preço**. Faltam informações sobre quem compra, quanto procura e por qual preço; a produção e a colheita quase sempre não são planejadas; o clima causa perdas; e a entrega é desorganizada. Resultado: sobra de alguns produtos, falta de outros e muito desperdício.

## 2. Solução proposta

O AgroConecta reúne em um só lugar tudo o que o produtor precisa:

| Área | O que resolve |
| --- | --- |
| **Produtores, propriedades e produtos** | Cadastro da rede de produtores e da capacidade produtiva de cada um |
| **Calendário** | Linha do tempo de plantio e colheita |
| **Produção** | Previsto x realizado por mês e controle de perdas |
| **Mercados** | Ofertas (com divulgação por WhatsApp), preços de referência e chamadas públicas |
| **Demandas** | O que os compradores procuram e o **cruzamento oferta x demanda** (excedente, falta, oportunidade) |
| **Canais** | Sugestão do melhor canal de venda para cada produto e registro das vendas |
| **Logística** | Agenda de entregas, veículos, destinos e custo de frete |
| **Clima e riscos** | Previsão do tempo (Open-Meteo) e alertas de risco para os plantios |
| **Relatórios** | Indicadores de produção, perdas, vendas e participação (com CSV e impressão) |

Os dados ficam salvos na nuvem, no **Firebase** (login + banco Firestore), e cada pessoa só enxerga os próprios registros.

## 3. Tecnologias

- **React 18** + **Vite** (componentes reutilizáveis, `useState`, `useEffect`, `useMemo`, props, contexto e eventos)
- **React Router** (arquivo `src/routes.jsx`)
- **Firebase Authentication** (login com e-mail e senha) e **Cloud Firestore** (banco de dados em tempo real)
- **Recharts** (gráficos) e **Lucide** (ícones)
- HTML, CSS (responsivo) e JavaScript

## 4. Estrutura de pastas

```
agroconecta/
├── index.html
├── package.json
├── vite.config.js
├── firebase.json          # configuração de publicação (opcional)
├── firestore.rules        # regras de segurança do banco
├── .env.example           # modelo das chaves do Firebase
└── src/
    ├── main.jsx           # ponto de entrada
    ├── App.jsx            # liga login + rotas
    ├── routes.jsx         # ⭐ TODAS AS ROTAS do sistema
    ├── index.css          # estilos
    ├── firebase/
    │   ├── config.js      # conexão com o Firebase (lê o .env)
    │   └── banco.js       # funções que leem/gravam no Firestore
    ├── context/
    │   ├── AuthContext.jsx    # quem está logado (entrar, criar conta, sair)
    │   └── DadosContext.jsx   # dados do sistema em tempo real
    ├── components/
    │   ├── Layout.jsx             # topo, menu lateral e área da página
    │   ├── ui.jsx                 # Card, Modal, Tabs, Badge, CrudSection...
    │   ├── Carregando.jsx
    │   └── ConfiguracaoPendente.jsx
    ├── pages/             # uma página por arquivo (Login, Dashboard, Produção...)
    ├── lib/               # utils, metrics (cálculos), weather (clima), navegacao
    └── data/seed.js       # dados de exemplo
```

## 5. Passo a passo no Firebase

### Passo 1 — Criar o projeto
1. Acesse <https://console.firebase.google.com> e entre com sua conta Google.
2. Clique em **Criar um projeto** (ou **Adicionar projeto**) e dê o nome `agroconecta`.
3. O Google Analytics pode ficar **desativado**. Clique em **Criar projeto**.

### Passo 2 — Registrar o app Web
1. Na tela inicial do projeto, clique no ícone **Web** (`</>`).
2. Apelido do app: `agroconecta-web`. **Não** marque o Hosting agora. Clique em **Registrar app**.
3. Vai aparecer um bloco `firebaseConfig` com `apiKey`, `authDomain`, `projectId` etc. **Deixe essa página aberta** (você usará no passo 5). Depois, é só clicar em **Continuar no console**.
   - Para ver de novo: ⚙️ **Configurações do projeto → Geral → Seus apps**.

### Passo 3 — Criar o banco Firestore
1. No menu lateral: **Criação → Firestore Database → Criar banco de dados**.
2. Escolha o local (por exemplo `southamerica-east1`, São Paulo) e a edição **Standard**.
3. Escolha **Iniciar no modo de produção** e clique em **Criar**.

### Passo 4 — Ativar o login por e-mail e senha
1. **Criação → Authentication → Vamos começar**.
2. Aba **Método de login → E-mail/senha**, ative a primeira opção e clique em **Salvar**.

### Passo 5 — Ligar o projeto ao Firebase (arquivo .env)
1. Na raiz do projeto, copie `.env.example` e renomeie a cópia para `.env`.
2. Preencha com os valores do `firebaseConfig`:

| No Firebase | No `.env` |
| --- | --- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

Sem aspas e sem espaços, por exemplo: `VITE_FIREBASE_PROJECT_ID=agroconecta-1a2b3`.
O arquivo `.env` já está no `.gitignore`, então não vai para o GitHub.

### Passo 6 — Rodar o projeto
```bash
npm install
npm run dev
```
Abra o endereço que aparecer (normalmente <http://localhost:5173>), clique em **Criar conta** e entre. No primeiro acesso aparece um aviso amarelo: clique em **Carregar dados de exemplo**.

### Passo 7 — Publicar as regras de segurança
Sem isso o banco bloqueia tudo (modo de produção).
1. **Firestore Database → aba Regras**.
2. Apague o que estiver lá e cole o conteúdo do arquivo `firestore.rules`.
3. Clique em **Publicar**.

Essa regra garante que cada pessoa só acessa os dados da própria pasta `usuarios/{seu-uid}`.

### Como os dados ficam no Firestore
```
usuarios
 └── {uid da pessoa}
      ├── produtores     → um documento por produtor
      ├── propriedades
      ├── produtos
      ├── capacidades
      ├── calendario
      ├── producao
      ├── ofertas
      ├── demandas
      ├── precos
      ├── notas
      ├── oportunidades
      ├── canais
      ├── vendas
      ├── entregas
      ├── alertas
      └── configuracoes  → documento "geral" (nome, perfil, cidade do clima)
```
Para conferir: **Firestore Database → Dados**.

### Passo 8 (opcional) — Publicar na internet com o Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase use --add      # escolha o projeto agroconecta
npm run build
firebase deploy
```
O endereço final aparece no terminal. Se der erro de login em um domínio novo, vá em **Authentication → Configurações → Domínios autorizados** e adicione o domínio.

## 6. Entrega no GitHub

```bash
git init
git add .
git commit -m "AgroConecta com React e Firebase"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/agroconecta.git
git push -u origin main
```
1. Crie o repositório em <https://github.com/new> (sem README, pois este já existe) e marque **Public**.
2. Copie o link do repositório e envie na pasta da atividade no **Microsoft Teams**.

## 7. Problemas comuns

| Mensagem / sintoma | O que fazer |
| --- | --- |
| Tela "Falta conectar ao Firebase" | Crie e preencha o `.env`, depois reinicie o `npm run dev` |
| "O login por e-mail e senha ainda não foi ativado" | Refaça o passo 4 |
| "Sem permissão para acessar o banco" | Refaça o passo 7 (publicar as regras) |
| "O Firestore ainda não foi criado" | Refaça o passo 3 |
| A previsão do tempo não carrega | Verifique a internet (a Open-Meteo é gratuita e não usa chave) |
