# Café Vagar · site demonstrativo

Site de portfólio de Letícia Beatriz. O Café Vagar é uma cafeteria **fictícia**: endereço, horários, preços e depoimentos foram inventados para este projeto.

## Como publicar no Cloudflare Pages
1. No painel do Cloudflare: Workers & Pages › Create › Pages › Connect to Git.
2. Escolha este repositório.
3. Framework preset: **None**. Build command: deixe vazio. Output directory: `/` (a raiz).
4. Save and Deploy. Cada `push` na branch `main` publica de novo sozinho.

## Antes de divulgar
- O `index.html` tem `<meta name="robots" content="noindex">`, para o Google não mostrar o site enquanto é demonstração. Se quiser que apareça nas buscas, apague essa linha.
- Créditos de fotos e vídeos: no rodapé do site (todos do Pexels, licença Pexels).

## Estrutura
- `index.html`, `estilo.css`, `app.js`: o site (HTML/CSS/JS puros, sem dependências).
- `assets/video`: vídeo da abertura (versão larga e vertical).
- `assets/ritual`: quadros da cena do leite (carregam só quando a pessoa chega perto).
- `assets/img`, `assets/fontes`, `assets/icone`: imagens, fontes e ícone.
