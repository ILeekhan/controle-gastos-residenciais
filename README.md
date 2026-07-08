## 🛠️ Tecnologias e Ferramentas Utilizadas

<div style="display: flex; gap: 8px; flex-wrap: wrap; margin: 16px 0;">
  <!-- Backend -->
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white" alt="C#">
  <img src="https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/Entity%20Framework-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt="EF Core">

  <!-- Frontend -->
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios">

  <!-- Ferramentas -->
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  <img src="https://img.shields.io/badge/VS%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="VS Code">
</div>

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

