// Lista de produtos com imagens
// Tenta carregar produtos do localStorage, se não houver usa padrão
let produtos = JSON.parse(localStorage.getItem('produtos')) || [
  { nome: "Conjunto branco e preto", preco: 120.00, imagem: "uniformes/instrutor1.jpg" },
  { nome: "Conjunto preto e branco", preco: 120.00, imagem: "uniformes/aluno2.png" },
  { nome: "Conjunto branco e vermelho", preco: 139.99, imagem: "uniformes/brancoevermelho.png" },
  { nome: "Conjunto preto e dourado", preco: 149.90, imagem: "uniformes/preto e dourado.png" },
  { nome: "Conjunto rosa e branco", preco: 139.99, imagem: "uniformes/rosa e branco.png" },
  { nome: "Garra do Lobo", preco: 139.99, imagem: "uniformes/garra.png" },
  { nome: "Calção feminino preto e branco", preco: 69.99, imagem: "uniformes/aluno1.png" }
];

function renderizarProdutos() {
  const container = document.getElementById('produtos');
  container.innerHTML = '';
  produtos.forEach((produto, index) => {
    const div = document.createElement('div');
    div.className = 'item';
    div.onclick = () => abrirDetalhes(index);
    div.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h2>${produto.nome}</h2>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <button onclick="event.stopPropagation(); adicionarCarrinho(${index})">Adicionar ao carrinho</button>
    `;
    container.appendChild(div);
  });
}


let carrinho = [];

function adicionarCarrinho(index) {
  carrinho.push(produtos[index]);
  atualizarCarrinho();
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const botaoWhatsapp = document.getElementById("btn-whatsapp");
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, i) => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.marginBottom = "10px";
    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; margin-right: 10px;">
      <div style="flex-grow: 1;">
        <p style="margin: 0; font-weight: 600;">${item.nome}</p>
        <p style="margin: 0;">R$ ${item.preco.toFixed(2)}</p>
      </div>
      <button onclick="removerDoCarrinho(${i})" style="background: transparent; border: none; color: red; font-weight: bold; cursor: pointer; font-size: 18px;">❌</button>
    `;
    lista.appendChild(div);
    total += item.preco;
  });

  // Exibe total no final
  const totalDiv = document.createElement("div");
  totalDiv.style.fontWeight = "700";
  totalDiv.style.fontSize = "18px";
  totalDiv.style.marginTop = "10px";
  totalDiv.style.borderTop = "1px solid #ccc";
  totalDiv.style.paddingTop = "10px";
  totalDiv.textContent = `Total: R$ ${total.toFixed(2)}`;
  lista.appendChild(totalDiv);

  const titulo = document.querySelector(".carrinho-flutuante h3");
  titulo.innerText = `🛒 Carrinho (${carrinho.length} itens)`;

  // Link para WhatsApp com produtos e total
  const texto = encodeURIComponent(
    `Olá! Gostaria de finalizar a compra com os seguintes itens:\n\n` +
    carrinho.map((item, i) => `• ${item.nome} - R$ ${item.preco.toFixed(2)}`).join("\n") +
    `\n\nTotal: R$ ${total.toFixed(2)}\nForma de pagamento: ${document.querySelector('input[name=\"pagamento\"]:checked')?.value }`
  );

  const telefone = "75998253258"; // coloque seu número aqui com DDD e sem espaços
  botaoWhatsapp.href = `https://wa.me/${telefone}?text=${texto}`;
}

function abrirDetalhes(index) {
  const modal = document.getElementById("modal");
  const produto = produtos[index];
  document.getElementById("modal-img").src = produto.imagem;
  document.getElementById("modal-titulo").innerText = produto.nome;
  document.getElementById("modal-preco").innerText = `R$ ${produto.preco.toFixed(2)}`;
  document.getElementById("modal-desc").innerText = "Produto oficial da Team Wolf FTV.";
  modal.style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Fecha modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    fecharModal();
  }
};

renderizarProdutos();
