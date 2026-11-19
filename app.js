// Café Vagar · movimento e acessibilidade
// Sem JavaScript, com "reduzir movimento" no aparelho ou com "Parar animações" no menu,
// a página fica completa e parada. O movimento só liga com a classe "com-movimento".
(() => {
  "use strict";
  const raiz = document.documentElement;
  const reduzirSistema = matchMedia("(prefers-reduced-motion: reduce)");
  const largo = matchMedia("(min-width: 768px)");
  const mouseLargo = matchMedia("(min-width: 1024px) and (pointer: fine)");
  const limita = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const faixa = (p, a, b) => limita((p - a) / (b - a));
  const mistura = (a, b, t) => a + (b - a) * t;
  // Easings com os nomes do GSAP (sem a biblioteca)
  const ease = {
    sineInOut: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    sineIn: (t) => 1 - Math.cos((t * Math.PI) / 2),
    expoIn: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
    expoOut: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  };

  /* ================= Menu de acessibilidade ================= */
  const CHAVE = "vagar-acessibilidade";
  const PADRAO = { escala: 100, contraste: false, parado: false, legivel: false, espaco: false, links: false };
  let pref = { ...PADRAO };
  try { Object.assign(pref, JSON.parse(localStorage.getItem(CHAVE) || "{}")); } catch (e) {}
  const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(pref)); } catch (e) {} };

  const botaoMenu = document.querySelector(".acess-botao");
  const painel = document.getElementById("acess-painel");
  const valor = painel.querySelector(".acess-valor");

  function aplicarPreferencias() {
    raiz.style.fontSize = pref.escala === 100 ? "" : pref.escala + "%";
    valor.textContent = pref.escala + "%";
    for (const nome of ["contraste", "legivel", "espaco", "links"]) raiz.classList.toggle(nome, !!pref[nome]);
    painel.querySelectorAll(".acess-opcao").forEach((b) => b.setAttribute("aria-pressed", String(!!pref[b.dataset.opcao])));
    atualizarMovimento();
  }
  function abrirMenu(abrir) {
    painel.hidden = !abrir;
    botaoMenu.setAttribute("aria-expanded", String(abrir));
    if (abrir) painel.querySelector("button").focus();
  }
  botaoMenu.addEventListener("click", () => abrirMenu(painel.hidden));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !painel.hidden) { abrirMenu(false); botaoMenu.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (!painel.hidden && !e.target.closest(".acess")) abrirMenu(false);
  });
  painel.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.acao === "maior") pref.escala = Math.min(160, pref.escala + 10);
    else if (b.dataset.acao === "menor") pref.escala = Math.max(90, pref.escala - 10);
    else if (b.dataset.acao === "zerar") pref = { ...PADRAO };
    else if (b.dataset.opcao) pref[b.dataset.opcao] = !pref[b.dataset.opcao];
    salvar();
    aplicarPreferencias();
  });

  /* ================= Elementos ================= */
  const topo = document.getElementById("cabecalho");
  const chegada = document.getElementById("topo");
  const cena = chegada.querySelector(".cena");
  const salao = chegada.querySelector(".salao");
  const tarjas = chegada.querySelectorAll(".tarja");
  const creditos = chegada.querySelector(".creditos");
  const dica = chegada.querySelector(".dica");
  const titulo = chegada.querySelector(".chegada-titulo");
  const fim = chegada.querySelector(".chegada-fim");
  let fundo = null, fachada = null;

  const lugarTrilha = document.querySelector(".lugar-trilha");
  const lugarFaixa = document.querySelector(".lugar-faixa");
  const lugarQuadros = [...document.querySelectorAll(".lugar-lista > li")];
  const reguaLinha = document.querySelector(".regua-linha");
  const reguaMarcas = [...document.querySelectorAll(".regua i")];

  const ritualTrilha = document.querySelector(".ritual-trilha");
  const ritualQuadro = document.querySelector(".ritual-quadro");
  const ritualFotos = document.querySelector(".ritual-fotos");
  const ritualCanvas = ritualFotos.querySelector(".ritual-canvas");
  const ctx = ritualCanvas.getContext("2d");
  const TOTAL_QUADROS = 120;
  const quadros = { l: [], a: [] };
  let pedidoQuadros = false, quadroDesenhado = -1, versaoDesenhada = "", indiceDesejado = -1;
  const versao = () => (innerWidth / innerHeight < 1 ? "a" : "l");
  // Carrega os quadros aos poucos: primeiro 1 a cada 8, depois o resto.
  function carregarQuadros() {
    if (pedidoQuadros) return;
    pedidoQuadros = true;
    const v = versao();
    const ordem = [];
    for (let passo of [8, 4, 2, 1]) for (let i = 1; i <= TOTAL_QUADROS; i += passo) if (!ordem.includes(i)) ordem.push(i);
    let k = 0;
    const proximo = () => {
      if (k >= ordem.length) return;
      const n = ordem[k++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => { quadros[v][n] = img; if (indiceDesejado >= 0 && Math.abs(n - 1 - indiceDesejado) < 10 && movimento) desenharQuadro(indiceDesejado); proximo(); };
      img.onerror = proximo;
      img.src = `assets/ritual/${v}_${String(n).padStart(3, "0")}.webp`;
    };
    for (let i = 0; i < 4; i++) proximo();
  }
  function desenharQuadro(indice) {
    const v = versao();
    let img = null;
    for (let d = 0; d < TOTAL_QUADROS && !img; d++) img = quadros[v][indice + 1 - d] || quadros[v][indice + 1 + d] || null;
    if (!img) return;
    const r = ritualCanvas.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (ritualCanvas.width !== w || ritualCanvas.height !== h) { ritualCanvas.width = w; ritualCanvas.height = h; }
    const esc = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * esc, dh = img.naturalHeight * esc;
    ctx.drawImage(img, (w - dw) * (v === "a" ? 0.62 : 0.5), (h - dh) * 0.6, dw, dh);
    quadroDesenhado = indice; versaoDesenhada = v;
  }
  const ritualPainel = document.querySelector(".ritual-painel");
  const ritualTempo = document.querySelector(".ritual-tempo");
  const ritualFrase = document.querySelector(".ritual-frase");
  const ritualLegenda = document.querySelector(".ritual-legenda");
  const ETAPAS = [
    ["00:00", "O espresso descansa na xícara."],
    ["00:20", "O leite entra devagar, rente à borda."],
    ["00:45", "Pronto. Agora é com você."],
  ];
  let etapaAtual = 0, trocaEtapa = 0;

  /* ================= Liga e desliga o movimento ================= */
  let movimento = false;
  function atualizarMovimento() {
    const quer = !reduzirSistema.matches && !pref.parado;
    if (quer === movimento && raiz.classList.contains(quer ? "com-movimento" : "parado")) return;
    movimento = quer;
    raiz.classList.toggle("com-movimento", quer);
    raiz.classList.toggle("parado", !quer);
    if (quer && !fundo) {
      cena.append(document.getElementById("modelo-cena").content.cloneNode(true));
      fundo = cena.querySelector(".cena-fundo");
      fachada = cena.querySelector(".cena-fachada");
    }
    limparEstilos();
    trilhas.forEach((t) => { t.atual = -1; });
    pedirQuadro();
  }
  function limparEstilos() {
    for (const el of [salao, titulo, fim, creditos, dica, fundo, fachada, lugarFaixa, reguaLinha, ritualFotos, ritualQuadro, ritualPainel, ritualLegenda, ...tarjas]) {
      if (el) { el.style.transform = ""; el.style.opacity = ""; el.style.clipPath = ""; el.style.visibility = ""; }
    }
  }

  /* ================= Trilhas de rolagem ================= */
  function progresso(el) {
    const r = el.getBoundingClientRect();
    const total = r.height - innerHeight;
    if (r.bottom < -innerHeight || r.top > innerHeight * 2) return null; // longe da tela
    return total > 0 ? limita(-r.top / total) : 0;
  }

  function desenharChegada(p) {
    const t1 = faixa(p, 0, 0.40), t2 = faixa(p, 0.40, 0.68);
    const escFundo = p < 0.40 ? mistura(1, 1.30, ease.sineInOut(t1)) : mistura(1.30, 1.55, t2);
    const escFach = p < 0.40 ? mistura(1, 2.4, ease.sineIn(t1)) : mistura(2.4, largo.matches ? 18 : 14, ease.expoIn(t2));
    if (fundo) {
      fundo.style.transform = `scale(${escFundo.toFixed(4)})`;
      fundo.style.opacity = p > 0.7 ? "0" : "1";
    }
    if (fachada) {
      fachada.style.transform = `scale(${escFach.toFixed(4)})`;
      fachada.style.opacity = (1 - faixa(p, 0.60, 0.70)).toFixed(3);
    }
    const salaoOp = faixa(p, 0.52, 0.66);
    const salaoEsc = p < 0.68 ? mistura(1.14, 1.04, faixa(p, 0.40, 0.68)) : mistura(1.04, 1, faixa(p, 0.70, 1));
    salao.style.opacity = salaoOp.toFixed(3);
    salao.style.transform = `scale(${salaoEsc.toFixed(4)})`;
    const tTarja = 1 - ease.sineInOut(faixa(p, 0, 0.12));
    tarjas.forEach((t) => { t.style.transform = `scaleY(${tTarja.toFixed(4)})`; });
    creditos.style.opacity = (1 - faixa(p, 0, 0.12)).toFixed(3);
    dica.style.opacity = (1 - faixa(p, 0, 0.04)).toFixed(3);
    const tTit = faixa(p, 0.22, 0.36);
    titulo.style.opacity = (1 - tTit).toFixed(3);
    titulo.style.transform = `translate(-50%, ${(-48 * tTit).toFixed(1)}px)`;
    const tFim = ease.expoOut(faixa(p, 0.74, 0.84));
    fim.style.opacity = tFim.toFixed(3);
    fim.style.transform = `translateY(${(24 * (1 - tFim)).toFixed(1)}px)`;
    fim.style.visibility = tFim < 0.01 ? "hidden" : "";
  }

  function desenharLugar(p) {
    if (!largo.matches) { lugarFaixa.style.transform = ""; return; }
    const fim = Math.max(0, lugarFaixa.scrollWidth - innerWidth);
    lugarFaixa.style.transform = `translate3d(${(-fim * p).toFixed(1)}px,0,0)`;
    reguaLinha.style.transform = `scaleX(${p.toFixed(4)})`;
    // marca do quadro mais perto do centro da tela
    const centro = innerWidth / 2;
    let melhor = 0, dist = Infinity;
    lugarQuadros.forEach((q, i) => {
      const r = q.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - centro);
      if (d < dist) { dist = d; melhor = i; }
    });
    reguaMarcas.forEach((m, i) => m.classList.toggle("ativa", i === melhor));
  }

  function desenharRitual(p) {
    ritualFotos.style.transform = `scale(${mistura(1.12, 1, faixa(p, 0, 0.85)).toFixed(4)})`;
    carregarQuadros();
    const indice = Math.round(faixa(p, 0.02, 0.80) * (TOTAL_QUADROS - 1));
    indiceDesejado = indice;
    if (indice !== quadroDesenhado || versao() !== versaoDesenhada) desenharQuadro(indice);
    const etapa = p < 0.30 ? 0 : p < 0.60 ? 1 : 2;
    if (etapa !== etapaAtual) {
      etapaAtual = etapa;
      ritualFrase.style.opacity = "0";
      clearTimeout(trocaEtapa);
      trocaEtapa = setTimeout(() => {
        ritualTempo.textContent = ETAPAS[etapaAtual][0];
        ritualFrase.textContent = ETAPAS[etapaAtual][1];
        ritualFrase.style.opacity = "";
      }, 150);
    }
    ritualPainel.style.opacity = (1 - faixa(p, 0.82, 0.86)).toFixed(3);
    const q = ease.sineInOut(faixa(p, 0.82, 1));
    const [vy, vx] = largo.matches ? [12, 22] : [14, 8];
    ritualQuadro.style.clipPath = q > 0 ? `inset(${(vy * q).toFixed(2)}svh ${(vx * q).toFixed(2)}vw round 2px)` : "";
    ritualLegenda.style.opacity = faixa(p, 0.92, 1).toFixed(3);
  }

  const trilhas = [
    { el: chegada, desenhar: desenharChegada, atual: -1, alvo: 0 },
    { el: lugarTrilha, desenhar: desenharLugar, atual: -1, alvo: 0 },
    { el: ritualTrilha, desenhar: desenharRitual, atual: -1, alvo: 0 },
  ];

  let pedido = 0;
  function pedirQuadro() { if (!pedido) pedido = requestAnimationFrame(quadro); }
  function quadro() {
    pedido = 0;
    ajustarTopo();
    if (!movimento) return;
    let continuar = false;
    for (const t of trilhas) {
      const alvo = progresso(t.el);
      if (alvo === null) continue;
      if (t.atual < 0) t.atual = alvo;
      else t.atual += (alvo - t.atual) * 0.12;
      if (Math.abs(alvo - t.atual) < 0.0004) t.atual = alvo; else continuar = true;
      if (t.atual !== t.ultimo) { t.desenhar(t.atual); t.ultimo = t.atual; }
    }
    if (continuar) pedirQuadro();
  }

  /* ================= Cabeçalho ================= */
  let ultimaRolagem = scrollY;
  function ajustarTopo() {
    const y = scrollY;
    const fimChegada = chegada.offsetTop + chegada.offsetHeight - innerHeight;
    topo.classList.toggle("com-fundo", y > Math.max(40, fimChegada - 64));
    if (Math.abs(y - ultimaRolagem) > 4) {
      topo.classList.toggle("escondido", y > ultimaRolagem && y > 120);
      ultimaRolagem = y;
    }
  }

  /* ================= Fios da margem ================= */
  const semRelogio = document.getElementById("sem-relogio");
  const fios = semRelogio.querySelector(".fios");
  function desenharFios() {
    if (!matchMedia("(min-width: 1024px)").matches) { fios.innerHTML = ""; return; }
    const base = semRelogio.getBoundingClientRect();
    fios.setAttribute("viewBox", `0 0 ${base.width} ${base.height}`);
    let html = "";
    semRelogio.querySelectorAll("[data-nota]").forEach((nota) => {
      const ancora = semRelogio.querySelector(`[data-ancora="${nota.dataset.nota}"]`);
      if (!ancora) return;
      const n = nota.getBoundingClientRect(), a = ancora.getBoundingClientRect();
      const x1 = n.left - base.left - 16, y1 = n.top - base.top + 11;
      const x2 = a.left - base.left + a.width / 2, y2 = a.bottom - base.top + 4;
      const cx = (x1 + x2) / 2;
      html += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} C ${cx.toFixed(1)} ${y1.toFixed(1)}, ${cx.toFixed(1)} ${(y2 + 40).toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}"/><circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="2.5"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="2.5"/>`;
    });
    fios.innerHTML = html;
  }

  /* ================= Cardápio: foto que segue o cursor ================= */
  const itens = [...document.querySelectorAll(".item")];
  const previa = document.querySelector(".previa");
  const previaImg = previa.querySelector("img");
  let px = -999, py = -999, ax = -999, ay = -999, seguindo = false, quadroPrevia = 0;
  function mostrarPrevia(item) {
    itens.forEach((i) => i.classList.toggle("ativo", i === item));
    if (!item) { previa.classList.remove("visivel"); return; }
    const src = item.dataset.foto;
    if (!previaImg.src.endsWith(src)) previaImg.src = src;
    previa.classList.add("visivel");
  }
  function moverPrevia() {
    quadroPrevia = 0;
    ax += (px - ax) * 0.15; ay += (py - ay) * 0.15;
    const cheg = Math.abs(px - ax) < 0.5 && Math.abs(py - ay) < 0.5;
    if (cheg) { ax = px; ay = py; }
    previa.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0) scale(${previa.classList.contains("visivel") ? 1 : 0.92})`;
    if (!cheg) quadroPrevia = requestAnimationFrame(moverPrevia);
  }
  function alvoPrevia(x, y, pular) {
    px = Math.min(x, innerWidth - 300); py = Math.min(Math.max(y, 8), innerHeight - 358);
    if (pular || ax < -900) { ax = px; ay = py; }
    if (!quadroPrevia) quadroPrevia = requestAnimationFrame(moverPrevia);
  }
  // A foto fica numa coluna à direita da lista e acompanha o cursor na vertical: não cobre o texto.
  const lista = document.querySelector(".itens");
  const xPrevia = () => lista.getBoundingClientRect().right + 48;
  function prepararCardapio() {
    const ativo = mouseLargo.matches;
    itens.forEach((i) => { if (ativo) i.tabIndex = 0; else i.removeAttribute("tabindex"); });
  }
  itens.forEach((item) => {
    item.addEventListener("pointerenter", (e) => {
      if (!movimento || !mouseLargo.matches || e.pointerType !== "mouse") return;
      seguindo = true; mostrarPrevia(item); alvoPrevia(xPrevia(), e.clientY - 175, ax < -900);
    });
    item.addEventListener("focus", () => {
      if (!movimento || !mouseLargo.matches) return;
      seguindo = false; mostrarPrevia(item);
      const r = item.getBoundingClientRect();
      alvoPrevia(xPrevia(), r.top + r.height / 2 - 175, true);
    });
    item.addEventListener("blur", () => mostrarPrevia(null));
  });
  document.querySelector(".itens").addEventListener("pointermove", (e) => {
    if (seguindo && e.pointerType === "mouse") alvoPrevia(xPrevia(), e.clientY - 175);
  });
  document.querySelector(".itens").addEventListener("pointerleave", () => { seguindo = false; mostrarPrevia(null); });

  /* ================= Eventos ================= */
  addEventListener("scroll", pedirQuadro, { passive: true });
  let tempoResize = 0;
  addEventListener("resize", () => {
    clearTimeout(tempoResize);
    tempoResize = setTimeout(() => { trilhas.forEach((t) => { t.ultimo = -1; }); quadroDesenhado = -1; if (pedidoQuadros && !quadros[versao()].length) { pedidoQuadros = false; } desenharFios(); prepararCardapio(); pedirQuadro(); }, 120);
  });
  reduzirSistema.addEventListener("change", atualizarMovimento);
  document.fonts && document.fonts.ready.then(desenharFios);

  aplicarPreferencias();
  prepararCardapio();
  desenharFios();
})();
