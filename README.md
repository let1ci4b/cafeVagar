<div align="center">

<img src="docs/capa.jpg" alt="Café Vagar: xícara de café preto vista de cima numa mesa escura, ao lado da frase O tempo passa. O café fica." width="100%">

# Café Vagar

**Site cinematográfico de uma cafeteria de bairro, que abre com uma xícara-relógio: ao rolar, o tempo cai e o café fica**

[**Ver o site**](https://cafevagar.pages.dev/) &nbsp;·&nbsp; [Declaração de acessibilidade](https://cafevagar.pages.dev/acessibilidade.html)

![Status](https://img.shields.io/badge/status-demonstrativo-E3A857?style=flat-square)
![WCAG 2.2 AA](https://img.shields.io/badge/WCAG_2.2-AA-15110E?style=flat-square)
![Acessibilidade](https://img.shields.io/badge/Lighthouse_acessibilidade-100-15110E?style=flat-square)
![Desempenho](https://img.shields.io/badge/Lighthouse_desempenho-95-15110E?style=flat-square)
![HTML, CSS e JS](https://img.shields.io/badge/HTML_CSS_JS-sem_framework-9A5234?style=flat-square)

</div>

> [!NOTE]
> **Projeto de portfólio.** O Café Vagar é uma marca fictícia. Endereço, horários, preços e depoimentos são inventados, e as imagens e o vídeo foram gerados por IA para a demonstração.

<br>

<p align="center">
  <img src="docs/vitrine.webp" alt="O site no computador e no celular: no computador, a xícara de café vista de cima com o pires marcado como relógio, números de 1 a 12 em volta; no celular, a xícara e o título O tempo passa. O café fica." width="100%">
</p>

## Sobre o projeto

| | |
|---|---|
| **Cliente** | Café Vagar (fictício) |
| **Tipo** | Site cinematográfico de página única |
| **Público** | Quem procura um café de bairro para ficar sem pressa, sozinho ou com amigos |
| **Versão** | 3 · novembro de 2026 |
| **Feito por** | [Letícia Beatriz](https://github.com/let1ci4b) |

## Destaques

- **Xícara-relógio na abertura.** A página começa no escuro, com os créditos. Surge uma xícara de café vista de cima, com o pires marcado como um relógio. Ao rolar, os ponteiros correm, os números caem um a um, os ponteiros afundam no café deixando ondinhas, e fica só o café: "O tempo passa. O café fica." A foto é uma imagem só; o relógio é desenho em código por cima, alinhado ao pires, nítido em qualquer tela.
- **O ritual em vídeo.** A rolagem "toca" o leite sendo servido até formar o coração na xícara, com um relógio marcando 00:00, 00:20 e 00:45.
- **Tira de filme.** Três fotos do salão deslizam de lado com a rolagem, e uma régua marca cada momento.
- **Cardápio com foto que acompanha o olhar.** No computador, a foto do item segue o mouse numa coluna ao lado da lista, sem cobrir o texto. No celular, cada item tem uma miniatura.
- **Menu de acessibilidade.** Tamanho do texto, alto contraste, parar animações, fonte mais legível, mais espaço entre linhas e destaque de links. As escolhas ficam salvas no navegador.
- **Funciona sem JavaScript e com movimento reduzido.** O conteúdo inteiro está no HTML. Sem animação, a página fica parada e completa, e os vídeos nem são baixados.
- **Card de compartilhamento e favicon.** O link aparece com imagem, título e descrição no WhatsApp e nas redes. O ícone funciona nos navegadores e na tela inicial do celular.

<table>
  <tr>
    <td width="50%"><img src="docs/salao.webp" alt="Salão pequeno com paredes verde-oliva, balcão de madeira e a frase 'Há dias que pedem pressa. Outros pedem café.'"></td>
    <td width="50%"><img src="docs/ritual.webp" alt="Leite sendo servido numa xícara de espresso, com a legenda '00:20 O leite entra devagar, rente à borda.'"></td>
  </tr>
  <tr>
    <td align="center"><sub>Dentro do café</sub></td>
    <td align="center"><sub>O ritual</sub></td>
  </tr>
</table>

## Qualidade

| Teste | Resultado |
|---|---|
| Acessibilidade automática (axe-core, WCAG 2.2 AA), em 360, 390 e 1440 px, com e sem movimento reduzido | 0 violações |
| Validador de HTML (html-validate e validador do W3C) | 0 erros |
| Lighthouse no celular (medido no computador de testes, que oscila) | Desempenho 93 a 96 · Acessibilidade 100 · Boas práticas 100 |
| Peso da primeira tela | cerca de 0,4 MB (a foto da abertura tem 70 KB). O vídeo do ritual carrega aos poucos, depois |
| Texto aumentado para 160% no celular | sem rolagem para o lado |
| Teclado e leitor de tela | tudo funciona sem mouse, com foco visível e link para pular a abertura |
| Movimento reduzido | página parada e completa, sem o relógio e sem baixar o vídeo |

## Tecnologias

| | |
|---|---|
| **Base** | HTML, CSS e JavaScript puros, sem framework e sem build |
| **Animações** | código próprio: o relógio da abertura em SVG e o vídeo do ritual em quadros num `<canvas>`, conduzidos pela rolagem |
| **Conteúdo** | direto no `index.html` |
| **Hospedagem** | [Cloudflare Pages](https://pages.cloudflare.com), publicado a cada envio para a branch `main` |
| **Métricas** | Cloudflare Web Analytics, sem cookies |

## Rodar no computador

1. Instale o [Node.js 22](https://nodejs.org).
2. Na pasta do projeto, rode:

   ```sh
   npm install
   npm run dev
   ```

3. Abra http://localhost:5173.

Como não há build, o que você vê no computador é exatamente o que vai para o ar.

## O que muda e onde

| O quê | Arquivo |
|---|---|
| Textos, cardápio, preços, endereço e horários | `index.html` |
| Cores e fontes | `estilo.css` (bloco `:root`) |
| Fotos do salão, do cardápio e da seção "Quem fica" | `assets/img/` |
| Foto da abertura | `assets/img/abertura-cafe-2000.webp` (o relógio é o `svg.xicara` no `index.html`, alinhado ao pires da foto) |
| Vídeo do ritual (120 quadros, computador e celular) | `assets/ritual/` |
| Momentos da abertura e das falas | `app.js` (função `desenharChegada`) e os `data-de` / `data-ate` no `index.html` |
| Texto e imagem do card de compartilhamento | `index.html` (`og:`) e `assets/img/compartilhar.jpg` (1200 × 630) |
| Ícones do site (favicon) | `assets/icone/` |
| Declaração de acessibilidade | `acessibilidade.html` |
| Aparecer ou não no Google | `index.html` (`meta robots`) e `robots.txt` |

## Estrutura

```
├── index.html, acessibilidade.html   páginas
├── estilo.css                        cores, fontes e layout
├── app.js                            movimento, menu de acessibilidade e cardápio
├── assets/
│   ├── ritual/       quadros do vídeo do leite sendo servido
│   ├── img/          fotos e card de compartilhamento
│   ├── fontes/       Fraunces e Instrument Sans
│   └── icone/        favicon e ícone do celular
├── _headers, robots.txt, sitemap.xml   configuração do Cloudflare e do Google
└── docs/             imagens deste README
```

## Publicar

- **Cloudflare Pages (oficial):** cada envio para a branch `main` publica o site em https://cafevagar.pages.dev/. Configuração: sem comando de build, pasta de saída `/` (a raiz).
- **Versões anteriores:** a primeira, com fotos de banco de imagens, está no branch [`versao-1-pexels`](https://github.com/let1ci4b/cafeVagar/tree/versao-1-pexels). A segunda, com a caminhada pela rua até a porta, está no branch [`versao-2-caminhada`](https://github.com/let1ci4b/cafeVagar/tree/versao-2-caminhada).

## Créditos

Design, código e conteúdo: **[Letícia Beatriz](https://github.com/let1ci4b)**, que faz sites simples e acessíveis para pequenos negócios.
Fontes: Fraunces e Instrument Sans (SIL Open Font License). Imagens e vídeos gerados por IA (Google Flow e Gemini), para esta demonstração.

<div align="center">
<sub>Feito com cuidado para funcionar para todo mundo.</sub>
</div>
