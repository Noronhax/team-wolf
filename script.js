// ==== DADOS DO CATÁLOGO ====
const produtos = JSON.parse(localStorage.getItem('produtos')) || [
  { nome: "Conjunto branco e preto", preco: 120.00, imagem: "uniformes/instrutor1.jpg",
    descricao: "Conjunto oficial Team Wolf FTV, tecido dry-fit confortável para treinos." },
  { nome: "Conjunto preto e branco", preco: 120.00, imagem: "uniformes/aluno2.png",
    descricao: "Estilo clássico alunno, resistente e ajustável." },
  { nome: "Conjunto branco e vermelho", preco: 139.99, imagem: "uniformes/brancoevermelho.png",
    descricao: "Detalhes em vermelho, tecido respirável e leve." },
  { nome: "Conjunto preto e dourado", preco: 149.90, imagem: "uniformes/preto-e-dourado.png",
    descricao: "Edição premium, design dourado único." },
  { nome: "Conjunto rosa e branco", preco: 139.99, imagem: "uniformes/rosa-e-branco.png",
    descricao: "Para o público feminino, corte moderno e confortável." },
  { nome: "Garra do Lobo", preco: 139.99, imagem: "uniformes/garra.png",
    descricao: "Estampa exclusiva com a lendária Garra do Lobo." },
  { nome: "Calção feminino preto e branco", preco: 69.99, imagem: "uniformes/aluno1.png",
    descricao: "Short feminino leve e prático para treinos físicos." }
];
localStorage.setItem('produtos', JSON.stringify(produtos));

// Carrinho persistente
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// ==== FUNÇÕES INICIAIS ==== 
const container = document.getElementById('produtos');
const modalOverlay = document.getElementById('modal');
const btnToggleCarrinho = document.getElementById('toggle-carrinho');

function renderizarProdutos() {
  container.innerHTML = '';
  produtos.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.tabIndex = 0;
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', `Detalhes: ${p.nome}`);
    div.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}" />
      <h2>${p.nome}</h2>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <button type="button" aria-label="Adicionar ${p.nome} ao carrinho">
        Adicionar ao carrinho
      </button>
    `;

    // Ao clicar na div: abre modal
    div.addEventListener('click', () => abrirModal(i));
    div.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') abrirModal(i);
    });

    // Botão de adicionar ao carrinho
    div.querySelector('button').addEventListener('click', e => {
      e.stopPropagation();
      adicionarAoCarrinho(i);
    });

    container.appendChild(div);
  });
}

function abrirModal(index) {
  const p = produtos[index];
  document.getElementById('modal-img').src = p.imagem;
  document.getElementById('modal-img').alt = p.nome;
  document.getElementById('modal-titulo').textContent = p.nome;
  document.getElementById('modal-preco').textContent = `R$ ${p.preco.toFixed(2)}`;
  document.getElementById('modal-desc').textContent = p.descricao || "Produto oficial Team Wolf FTV.";
  modalOverlay.classList.add('open');
  document.body.classList.add('modal-open');
  modalOverlay.focus();
  trapFocus(modalOverlay);
}

function fecharModal() {
  modalOverlay.classList.remove('open');
  document.body.classList.remove('modal-open');
  unlockScroll();
  previousFocus?.focus();
}

// Fechar com botão ou clique fora
modalOverlay.querySelector('.modal-close').addEventListener('click', fecharModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) fecharModal(); });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) fecharModal();
});

// Foco dentro do modal
let previousFocus;
function trapFocus(modal) {
  previousFocus = document.activeElement;
  const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  first.focus();

  function handleTab(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  modal.addEventListener('keydown', handleTab);
  modal.handleTab = handleTab;
}

function unlockScroll() {
  modalOverlay.removeEventListener('keydown', modalOverlay.handleTab);
}

// Carrinho: adicionar, remover e atualizar
function adicionarAoCarrinho(i) {
  carrinho.push(produtos[i]);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById('lista-carrinho');
  const titulo = document.querySelector('.carrinho-flutuante h3');
  const botaoWhats = document.getElementById('btn-whatsapp');
  const quant = carrinho.length;
  titulo.textContent = `🛒 Carrinho (${quant} ${quant === 1 ? 'item' : 'itens'})`;
  lista.innerHTML = '';

  let total = 0;
  carrinho.forEach((item, idx) => {
    total += item.preco;
    const div = document.createElement('div');
    div.style = 'display:flex; align-items:center; margin-bottom:10px;';
    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" style="width:50px;height:50px;object-fit:cover;border-radius:6px; margin-right:10px;">
      <div style="flex-grow:1;">
        <p style="margin:0;font-weight:600;">${item.nome}</p>
        <p style="margin:0;">R$ ${item.preco.toFixed(2)}</p>
      </div>
      <button aria-label="Remover ${item.nome}" style="background:transparent;border:none;color:red;font-size:18px;cursor:pointer;">❌</button>
    `;
    div.querySelector('button').addEventListener('click', () => removerDoCarrinho(idx));
    lista.appendChild(div);
  });

  // Total final
  const divTotal = document.createElement('div');
  divTotal.style = 'font-weight:700; font-size:18px; margin-top:10px; border-top:1px solid #ccc; padding-top:10px;';
  divTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
  lista.appendChild(divTotal);

  // Link WhatsApp
  const forma = document.querySelector('input[name="pagamento"]:checked')?.value || 'PIX';
  const texto = encodeURIComponent(
    `Olá! Gostaria de finalizar a compra:\n\n` +
    carrinho.map(item => `• ${item.nome} – R$ ${item.preco.toFixed(2)}`).join('\n') +
    `\n\nTotal: R$ ${total.toFixed(2)}\nForma de pagamento: ${forma}`
  );
  botaoWhats.href = `https://wa.me/559${"75998253258"}?text=${texto}`;
}

// Toggle do carrinho
btnToggleCarrinho.addEventListener('click', () => {
  const carr = document.getElementById('carrinho');
  if (carr.style.display === 'block') {
    carr.style.display = 'none';
  } else {
    atualizarCarrinho();
    carr.style.display = 'block';
  }
});

// ==== FUNCIONALIDADE DO BANNER (vídeo + autoplay) ====
const banner = document.getElementById('banners-promocionais');
const containerBan = banner.querySelector('.banner-container');
const slides = Array.from(containerBan.children);
const prevBtn = banner.querySelector('.banner-prev');
const nextBtn = banner.querySelector('.banner-next');
let current = 0;
let autoplayId = null;

function showSlide(i) {
  current = (i + slides.length) % slides.length;
  containerBan.style.transform = `translateX(-${current * 100}%)`;
  slides.forEach((slide, idx) => {
    const vid = slide.querySelector('video');
    if (vid) {
      if (idx === current) {
        vid.currentTime = 0;
        vid.play();
      } else {
        vid.pause();
      }
    }
  });
}

prevBtn.addEventListener('click', () => {
  clearInterval(autoplayId);
  showSlide(current - 1);
});
nextBtn.addEventListener('click', () => {
  clearInterval(autoplayId);
  showSlide(current + 1);
});

banner.addEventListener('mouseover', () => clearInterval(autoplayId));
banner.addEventListener('mouseout', () => autoplayId = setInterval(() => showSlide(current + 1), 7000));
banner.addEventListener('focusin', () => clearInterval(autoplayId));
banner.addEventListener('focusout', () => autoplayId = setInterval(() => showSlide(current + 1), 7000));

showSlide(0);
autoplayId = setInterval(() => showSlide(current + 1), 7000);
showSlide(0); // inicial

document.addEventListener('DOMContentLoaded', () => {
  renderizarProdutos();
});

