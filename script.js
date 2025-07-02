const produtos = [
  {
    nome: "Conjunto Team Wolf SS25 Futevôlei Masculino - branco e preto",
    preco: 139.99,
    imagem: "uniformes/instrutor1.jpg",
    descricao: "Conjunto oficial masculino preto e branco, leve e confortável."
  },
  {
    nome: "Conjunto Team Wolf SS25 Futevôlei Masculino - preto e branco",
    preco: 139.99,
    imagem: "uniformes/aluno2.png",
    descricao: "Conjunto oficial masculino preto e branco, leve e confortável."
  },
  {
    nome: "Conjunto Team Wolf SS25 Futevôlei Masculino - branco e vermelho",
    preco: 139.99,
    imagem: "uniformes/brancoevermelho.png",
    descricao: "Conjunto oficial masculino preto e branco, leve e confortável."
  },
  {
    nome: "Conjunto Team Wolf SS25 Futevôlei - preto e dourado",
    preco: 139.99,
    imagem: "uniformes/preto e dourado.png",
    descricao: "Conjunto oficial masculino preto e branco, leve e confortável."
  },
  {
     nome: "Conjunto Team Wolf SS25 Futevôlei - rosa e branco",
    preco: 139.99,
    imagem: "uniformes/rosa e branco.png",
    descricao: "Conjunto oficial masculino preto e branco, leve e confortável."
  },
  {
     nome: "Calção Team Wolf SS25 Futevôlei feminino- preto/branco",
    preco: 139.99,
    imagem: "uniformes/aluno1.png",
    descricao: "Calção oficial feminino preto com branco, leve e confortável."
  },
  {
    nome: "Garra Do Lobo Team Wolf SS25 Futevôlei- preto/branco",
    preco: 139.99,
    imagem: "uniformes/garra.png",
    descricao: "Conjunto oficial Garra Do Lobo, leve e confortável."
  }
];

// Recupera o carrinho do localStorage
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function adicionarCarrinho(index) {
  const produto = produtos[index];
  const itemCarrinho = carrinho.find(item => item.nome === produto.nome);
  if (itemCarrinho) {
    itemCarrinho.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  salvarCarrinho();
  atualizarCarrinho();
}

function removerCarrinho(i) {
  if (carrinho[i].quantidade > 1) {
    carrinho[i].quantidade--;
  } else {
    carrinho.splice(i, 1);
  }
  salvarCarrinho();
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  if (!lista) return; // evita erro caso o elemento não exista

  lista.innerHTML = "";

  let totalItens = 0;

  carrinho.forEach((item, i) => {
    totalItens += item.quantidade;

    const produtoIndex = produtos.findIndex(p => p.nome === item.nome && p.preco === item.preco);

    const div = document.createElement("div");
    div.innerHTML = `
      <div style="display:flex; align-items:center; margin-bottom:10px;">
        <img src="${item.imagem}" style="width:50px; height:auto; margin-right:10px; cursor:pointer;" onclick="abrirDetalhes(${produtoIndex})" />
        <div style="flex-grow:1;">
          <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span><br/>
          <small>Quantidade: ${item.quantidade}</small>
        </div>
        <button onclick="removerCarrinho(${i})" style="margin-left:10px; background:red; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">
          Remover
        </button>
      </div>
    `;
    lista.appendChild(div);
  });

  const carrinhoTitulo = document.querySelector(".carrinho-flutuante h3");
  if (carrinhoTitulo) {
    carrinhoTitulo.textContent = `🛒 Carrinho (${totalItens} item${totalItens !== 1 ? "s" : ""})`;
  }

  // Atualiza link do WhatsApp
  let texto = "Olá, gostaria de finalizar minha compra:\n";
  carrinho.forEach((item) => {
    texto += `• ${item.nome} - R$ ${item.preco.toFixed(2)} (x${item.quantidade})\n`;
  });

  const formaSelecionada = document.querySelector('input[name="pagamento"]:checked');
  if (formaSelecionada) {
    texto += `\nForma de pagamento: ${formaSelecionada.value}`;
  }

  const link = "https://wa.me/5575998253258?text=" + encodeURIComponent(texto);
  const botaoWhats = document.getElementById("btn-whatsapp");
  if (botaoWhats) {
    botaoWhats.href = link;
  }
}

function abrirDetalhes(index) {
  const produto = produtos[index];
  document.getElementById("modal-img").src = produto.imagem;
  document.getElementById("modal-titulo").textContent = produto.nome;
  document.getElementById("modal-preco").textContent = `R$ ${produto.preco.toFixed(2)}`;
  document.getElementById("modal-desc").textContent = produto.descricao;
  document.getElementById("modal").classList.add("show");
}

function fecharModal() {
  document.getElementById("modal").classList.remove("show");
}

window.onload = function () {
  atualizarCarrinho();

  // Botão de fechar o carrinho (flutuante)
  const btnFechar = document.getElementById('fechar-carrinho');
  const carrinhoDiv = document.getElementById('carrinho');
  if (btnFechar && carrinhoDiv) {
    btnFechar.addEventListener('click', () => {
      carrinhoDiv.style.display = 'none';
    });
  }

  // Atualizar o carrinho se mudar a forma de pagamento
  document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener('change', atualizarCarrinho);
  });
};
