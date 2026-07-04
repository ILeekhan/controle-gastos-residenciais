# 📋 Desafio Técnico – Controle de Gastos Residenciais

## 🎯 Objetivo
Desenvolver um sistema para gerenciar pessoas e transações financeiras, seguindo todos os requisitos especificados no desafio técnico.

---

## 🚀 Funcionalidades Implementadas

### 👤 Cadastro de Pessoas
- Criar, listar e excluir pessoas
- Dados: `Id` (automático), `Nome`, `Idade`
- Regra: ao excluir uma pessoa, todas as suas transações são removidas automaticamente

### 💸 Cadastro de Transações
- Criar e listar transações
- Dados: `Id` (automático), `Descrição`, `Valor`, `Tipo` (Receita/Despesa), `Pessoa`
- Regra de negócio:
  - A pessoa vinculada deve existir no cadastro
  - Pessoas menores de 18 anos **apenas podem registrar despesas**

### 📊 Consulta de Totais
- Exibe para cada pessoa: total de receitas, total de despesas e saldo
- Exibe o total geral consolidado de todas as pessoas

---

## 🛠️ Tecnologias Utilizadas
- **Back-end**: .NET 8, C#, ASP.NET Core Web API, Entity Framework Core
- **Banco de dados**: SQLite (desenvolvimento) / PostgreSQL ou SQL Server (preparado para produção)
- **Front-end**: React 18, TypeScript, Axios
- **Arquitetura**: Separação em camadas (Controllers → Services → Models → Banco)

---

## 📁 Estrutura do Projeto
controle-gastos-residenciais/
├── Backend/ # API e regras de negócio

│ ├── Data/ # Contexto e configuração do banco

│ ├── Models/ # Entidades

│ ├── Services/ # Regras de negócio

│ ├── Controllers/ # Endpoints da API

│ └── Program.cs

├── Frontend/ # Interface do usuário

│ ├── src/

│ │ ├── App.tsx

│ │ └── api.ts

│ └── package.json

└── README.md


---

## ▶️ Como Executar

### 1. Backend
```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run

A API estará disponível em: http://localhost:5273

---

cd Frontend
npm install
npm start

Acesse em: http://localhost:3000

---

📌 Observações
Todas as regras de negócio foram validadas e implementadas
Código comentado e organizado para facilitar a leitura
Persistência dos dados garantida após fechar a aplicação
Estrutura preparada para expansão e troca de banco de dados



---

