# Café Vagar

**Site demonstrativo de uma cafeteria fictícia, contado como um filme em cinco atos.**

🔗 **Ver o site:** https://cafevagar.pages.dev/

O Café Vagar não existe: é um projeto de portfólio de [Letícia Beatriz](https://www.linkedin.com/in/leticia-beatriz015). A marca, o endereço, os horários, os preços e os depoimentos foram inventados para mostrar o que um site de pequeno negócio pode ser.

## A ideia

*"O tempo passa. O café fica."* Em vez de começar pelo cardápio, o site começa pela atmosfera. A rolagem conduz o visitante como uma câmera:

1. **A chegada:** na calçada, à noite, com créditos de filme. A rolagem caminha até a vitrine iluminada, atravessa o vidro e entra na cafeteria.
2. **O lugar:** três momentos (o silêncio, a conversa, o ritual) passam como uma tira de filme.
3. **O ritual:** a rolagem controla o leite sendo servido na xícara, quadro a quadro.
4. **As pessoas:** quem fica mais um pouco.
5. **O convite:** endereço, horários e um "fim".

## Acessibilidade

O movimento é um enfeite, nunca uma barreira:

- **Menu de acessibilidade:** tamanho do texto, alto contraste, parar animações, fonte mais legível, mais espaço entre linhas e destaque de links. As escolhas ficam salvas no navegador.
- **Movimento reduzido:** quem ativa "reduzir movimento" no aparelho vê a página parada e completa, sem baixar as sequências de imagens.
- **Navegação:** o site funciona só com o teclado, tem foco visível e um link para pular direto ao conteúdo.
- **Imagens:** todas as fotos têm texto alternativo.
- **Verificação:** o site passa no axe (WCAG 2.2 AA) e no validador de HTML, e tirou 100 em desempenho, acessibilidade e boas práticas no Lighthouse.

## Como foi feito

- **Código:** HTML, CSS e JavaScript puros, sem frameworks nem bibliotecas.
- **Fontes:** Cormorant Garamond, DM Sans e IBM Plex Mono, hospedadas junto com o site (nenhuma chamada a serviços externos).
- **Imagens:** fotos e vídeos do Pexels, com o mesmo tratamento de cor quente aplicado a todos. As cenas de rolagem são sequências de imagens WebP desenhadas num `<canvas>`, carregadas só quando o visitante chega perto delas.
- **Hospedagem:** Cloudflare Pages.

## Créditos das imagens

Todas as fotos e vídeos vêm do [Pexels](https://www.pexels.com/license/) (licença Pexels, uso livre). A lista completa, com autores e links, está no rodapé do site, em "Créditos de fotos e vídeos".

---

Quer um site assim para o seu negócio? Fale com a Letícia pelo [WhatsApp](https://wa.me/5548996862073).
