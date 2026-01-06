MIGRAÇÃO TAILWIND PARA PRODUÇÃO (VITE + REACT)

PASSOS:
1) npm install -D tailwindcss postcss autoprefixer
2) Copie os arquivos desta pasta para a raiz do projeto:
   - tailwind.config.js
   - postcss.config.js
3) Copie index.css para src/index.css
4) Importe em src/main.tsx ou index.tsx:
   import './index.css'
5) Remova o script CDN do index.html
6) npm run dev / npm run build

Resultado:
- Tailwind otimizado
- Sem CDN
- CSS minificado em produção
