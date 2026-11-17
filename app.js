// Café Vagar · movimento e acessibilidade
// Sem JavaScript, com "reduzir movimento" no aparelho ou com "Parar animações" no menu,
// a página continua completa e parada.
(() => {
  const raiz = document.documentElement;
  const reduzirSistema = matchMedia("(prefers-reduced-motion: reduce)");
  const limita = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const suave = (t) => t * t * (3 - 2 * t);
  const retrato = matchMedia("(max-aspect-ratio: 4/5)").matches;

  /* ================= Menu de acessibilidade ================= */
  const CHAVE = "vagar-acessibilidade";
  let pref = { escala: 100, contraste: false, parado: false, legivel: false, espaco: false, links: false };
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
    else if (b.dataset.acao === "zerar") pref = { escala: 100, contraste: false, parado: false, legivel: false, espaco: false, links: false };
    else if (b.dataset.opcao) pref[b.dataset.opcao] = !pref[b.dataset.opcao];
    salvar();
    aplicarPreferencias();
  });

  /* ================= Cabeçalho ================= */
  const topo = document.querySelector(".topo");
  const cardapio = document.getElementById("cardapio");
  function ajustarTopo() {
    topo.classList.toggle("com-fundo", window.scrollY > window.innerHeight * 0.9 && !dentroDaAbertura());
    const r = cardapio.getBoundingClientRect();
    topo.classList.toggle("claro", r.top < 60 && r.bottom > 60);
  }

  /* ================= Revelações de texto ================= */
  const io = new IntersectionObserver((itens) => {
    for (const it of itens) if (it.isIntersecting) { it.target.classList.add("visto"); io.unobserve(it.target); }
  }, { rootMargin: "0px 0px -12% 0px" });
  document.querySelectorAll(".revela, .revela-img").forEach((el) => io.observe(el));

  /* ================= ATO I: da calçada para dentro ================= */
  const ato1 = document.querySelector(".ato1");
  const rua = ato1.querySelector(".plano--rua");
  const dentro = ato1.querySelector(".plano--dentro");
  const vidro = ato1.querySelector(".vidro");
  const tarjas = ato1.querySelectorAll(".tarja");
  const luz = ato1.querySelector(".luz");
  const dica = ato1.querySelector(".dica-rolar");
  const falas = [...ato1.querySelectorAll(".fala")];
  const progressoAto1 = () => limita(-ato1.getBoundingClientRect().top / (ato1.offsetHeight - window.innerHeight));
  const dentroDaAbertura = () => ato1.getBoundingClientRect().bottom > window.innerHeight * 0.5;

  function quadroAto1() {
    const p = progressoAto1();
    // 1. a rua surge do escuro e a câmera caminha até a vitrine
    const ida = suave(limita(p / 0.48));
    const desfoque = limita((p - 0.34) / 0.14) * 10;
    const brilho = 0.3 + 0.7 * limita((p - 0.12) / 0.22);
    rua.style.transform = `scale(${(1 + 3.4 * ida).toFixed(3)})`;
    rua.style.filter = `brightness(${brilho.toFixed(2)}) blur(${desfoque.toFixed(1)}px)`;
    rua.style.opacity = (1 - limita((p - 0.44) / 0.06)).toFixed(3);
    // 2. atravessa o vidro: a luz quente da vitrine toma a tela
    const subida = limita((p - 0.34) / 0.12), descida = limita((p - 0.47) / 0.08);
    vidro.style.opacity = (subida * (1 - descida)).toFixed(3);
    // 3. já dentro: a cafeteria entra em foco e a câmera segue andando
    const entra = limita((p - 0.43) / 0.1);
    const escala = 1.2 - 0.2 * suave(entra) + 0.28 * suave(limita((p - 0.55) / 0.45));
    dentro.style.opacity = entra.toFixed(3);
    dentro.style.transform = `scale(${escala.toFixed(3)})`;
    dentro.style.filter = `blur(${((1 - entra) * 8).toFixed(1)}px)`;
    // tarjas de cinema abrem quando a pessoa entra
    const a = suave(limita((p - 0.3) / 0.16));
    tarjas[0].style.transform = `translateY(${-100 * a}%)`;
    tarjas[1].style.transform = `translateY(${100 * a}%)`;
    // 4. no fim, a luz da janela vira a próxima cena
    luz.style.opacity = suave(limita((p - 0.86) / 0.08)).toFixed(3);
    dica.style.opacity = (1 - limita(p / 0.04)).toFixed(2);
    for (const f of falas) f.classList.toggle("ativa", p >= +f.dataset.de && p < +f.dataset.ate);
  }

  /* ================= ATO II: a tira de filme ================= */
  const rolo = document.querySelector(".rolo");
  const tira = rolo.querySelector(".tira");
  function quadroRolo() {
    const r = rolo.getBoundingClientRect();
    const q = limita(-r.top / (rolo.offsetHeight - window.innerHeight));
    const curso = Math.max(0, tira.scrollWidth - window.innerWidth);
    tira.style.transform = `translate3d(${(-q * curso).toFixed(1)}px, 0, 0)`;
  }

  /* ================= ATO III: a rolagem conduz o leite ================= */
  const ato3 = document.querySelector(".ato3");
  const tela = ato3.querySelector(".tela-ritual");
  const ctx = tela.getContext("2d");
  const tempos = [...ato3.querySelectorAll(".tempos li")];
  const TOTAL = 90;
  const quadros = new Array(TOTAL);
  let alvo = 0, desenhado = -1, carregando = false;
  const caminho = (i) => `assets/ritual/r_${String(i + 1).padStart(4, "0")}.webp`;
  const pronto = (i) => quadros[i] && quadros[i].complete && quadros[i].naturalWidth;

  function carregarRitual() {
    if (carregando) return;
    carregando = true;
    const fila = [];
    for (const passo of [6, 3, 1]) for (let i = 0; i < TOTAL; i += passo) if (!fila.includes(i)) fila.push(i);
    let k = 0;
    (function lote() {
      for (let n = 0; n < 6 && k < fila.length; n++) {
        const i = fila[k++], img = new Image();
        img.decoding = "async";
        img.onload = () => { if (Math.abs(i - alvo) < 4 || desenhado < 0) desenharRitual(); };
        img.src = caminho(i);
        quadros[i] = img;
      }
      if (k < fila.length) setTimeout(lote, 50);
    })();
  }
  function tamanhoTela() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    tela.width = Math.round(tela.clientWidth * dpr);
    tela.height = Math.round(tela.clientHeight * dpr);
    desenhado = -1;
    desenharRitual();
  }
  function desenharRitual() {
    let i = -1;
    for (let d = 0; d < TOTAL; d++) {
      if (pronto(alvo - d)) { i = alvo - d; break; }
      if (pronto(alvo + d)) { i = alvo + d; break; }
    }
    if (i < 0 || i === desenhado || !tela.width) return;
    const img = quadros[i], cw = tela.width, ch = tela.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) * 0.4, w, h);
    desenhado = i;
  }
  function quadroAto3() {
    const r = ato3.getBoundingClientRect();
    const p = limita(-r.top / (ato3.offsetHeight - window.innerHeight));
    alvo = Math.round(p * (TOTAL - 1));
    desenharRitual();
    for (const t of tempos) t.classList.toggle("ativa", p >= +t.dataset.de && p < +t.dataset.ate);
  }

  /* ================= Paralaxe discreta ================= */
  const paralaxes = [...document.querySelectorAll(".paralaxe")];
  function quadroParalaxe() {
    const meio = window.innerHeight / 2;
    for (const el of paralaxes) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) continue;
      const d = (r.top + r.height / 2 - meio) * -(+el.dataset.v);
      const base = el.closest(".pessoas-foto") ? " scale(1.1)" : "";
      el.style.transform = `translate3d(0, ${d.toFixed(1)}px, 0)${base}`;
    }
  }

  /* ================= Liga e desliga o movimento ================= */
  let ligado = false, pedido = false;
  function quadro() {
    pedido = false;
    ajustarTopo();
    if (!ligado) return;
    quadroAto1(); quadroRolo(); quadroAto3(); quadroParalaxe();
  }
  const agendar = () => { if (!pedido) { pedido = true; requestAnimationFrame(quadro); } };
  const observaRitual = new IntersectionObserver(([e]) => { if (e.isIntersecting && ligado) carregarRitual(); }, { rootMargin: "150% 0px" });

  function atualizarMovimento() {
    const deve = !reduzirSistema.matches && !pref.parado;
    raiz.classList.toggle("parado", !deve);
    if (deve === ligado) return;
    ligado = deve;
    raiz.classList.toggle("filme", deve);
    raiz.classList.toggle("anima", deve);
    if (deve) {
      observaRitual.observe(ato3);
      tamanhoTela();
    } else {
      [rua, dentro, vidro, luz, dica, tira, ...tarjas, ...paralaxes].forEach((el) => el.removeAttribute("style"));
      document.querySelectorAll(".revela, .revela-img").forEach((el) => el.classList.add("visto"));
    }
    agendar();
  }

  window.addEventListener("scroll", agendar, { passive: true });
  window.addEventListener("resize", () => { if (ligado) tamanhoTela(); agendar(); });
  reduzirSistema.addEventListener("change", atualizarMovimento);
  aplicarPreferencias();
})();
