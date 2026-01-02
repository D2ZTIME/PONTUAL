# 🌌 PONTUAL | Zenith Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build with: Gemini AI](https://img.shields.io/badge/AI-Gemini%20Flash-blue)](https://deepmind.google/technologies/gemini/)
[![React: 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)

**PONTUAL** é uma suíte digital de alta performance com design **Glassmorphism**, focada em produtividade e precisão. Desenvolvido para oferecer uma experiência de usuário premium diretamente no navegador.

## ✨ Funcionalidades

- **🕒 Relógio Digital**: Sincronização em tempo real com localização e data formatada.
- **⏰ Gestão de Alarmes**: Sistema interativo para adicionar e gerenciar lembretes.
- **⏱️ Cronômetro de Precisão**: Marcação de voltas (laps) com precisão de milissegundos.
- **⌛ Timer Regressivo**: Interface circular visual intuitiva.
- **🍅 Pomodoro Master**: Ciclos de foco e descanso com rastreador de progresso.
- **💡 Smart Advice (AI)**: Dicas de produtividade contextuais geradas pela API Gemini Flash.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Inteligência Artificial**: Google Gemini SDK (@google/genai)

## 🚀 Como Executar Localmente

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/D2ZTIME/PONTUAL.git
   ```
2. **Instale as dependências**:
   ```bash
   npm install
   ```
3. **Configure a API Key**:
   - Copie o arquivo `.env.example` para `.env`
   - Adicione sua chave da API do Gemini em `VITE_GEMINI_API_KEY`. Você pode obter uma chave gratuita em [Google AI Studio](https://aistudio.google.com/app/apikey).
4. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

## 📦 Deploy no GitHub Pages

Este projeto está configurado para deploy automático via **GitHub Actions**.

1. No seu repositório no GitHub, vá em **Settings > Pages**.
2. Em **Build and deployment > Source**, selecione **GitHub Actions**.
3. Para que a IA funcione no site publicado, vá em **Settings > Secrets and variables > Actions** e adicione um "Repository secret" chamado `VITE_GEMINI_API_KEY` com sua chave.
4. O deploy será realizado automaticamente a cada push na branch `main`.

---
Desenvolvido por **D2ZTIME** com foco em UI/UX de alto nível.
