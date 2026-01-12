
# 🌌 Zenith Pro Digital Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build with: Gemini AI](https://img.shields.io/badge/AI-Gemini%20Flash-blue)](https://deepmind.google/technologies/gemini/)
[![React: 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)

**Zenith Pro** é uma suíte digital de alta performance com design **Glassmorphism**, focada em produtividade e precisão. Desenvolvido para oferecer uma experiência de usuário premium diretamente no navegador.

## ✨ Funcionalidades

- **🕒 Relógio Digital**: Sincronização em tempo real com localização e data formatada.
- **⏰ Gestão de Alarmes**: Sistema interativo para adicionar e gerenciar lembretes (sessão local).
- **⏱️ Cronômetro de Precisão**: Marcação de voltas (laps) com precisão de milissegundos.
- **⌛ Timer Regressivo**: Interface circular visual intuitiva.
- **🍅 Pomodoro Master**: Ciclos de foco e descanso com rastreador de progresso.
- **💡 Smart Advice (AI)**: Dicas de produtividade contextuais geradas pela API Gemini 3 Flash.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19 (Hooks, Context)
- **Estilização**: Tailwind CSS (Utility-first)
- **Inteligência Artificial**: Google Gemini SDK (@google/genai)
- **Design System**: Glassmorphism com animações customizadas em CSS.

## 🚀 Como Executar

Este projeto utiliza **ESModules** nativos e **Import Maps**, eliminando a necessidade de complexos processos de build (Webpack/Vite) para execução básica.

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/zenith-suite.git
   ```
2. **Servidor Local**:
   Abra o arquivo `index.html` usando uma extensão como **Live Server** (VS Code) ou execute:
   ```bash
   npx serve .
   ```
3. **API Key**:
   Para as dicas de IA funcionarem, a aplicação espera que a variável `process.env.API_KEY` esteja disponível no ambiente de execução.

## 🤝 Contribuição

Contribuições são o que fazem a comunidade open source um lugar incrível!
1. Faça um **Fork** do projeto.
2. Crie uma **Branch** para sua feature (`git checkout -b feature/AmazingFeature`).
3. Faça o **Commit** de suas mudanças (`git commit -m 'Add AmazingFeature'`).
4. Faça o **Push** para a Branch (`git push origin feature/AmazingFeature`).
5. Abra um **Pull Request**.

---
Desenvolvido por **D2ZTIME** com foco em UI/UX de alto nível.
