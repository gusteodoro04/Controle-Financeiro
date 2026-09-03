const form = document.getElementById('form')
const descImput = document.querySelector('#descricao')
const valorImput = document.getElementById('montante')
const balancoH1 = document.getElementById('balanco')
const receitaP = document.getElementById('din-positivo')
const despesaP = document.getElementById('din-negativo')
const transacoesUL = document.getElementById('transacoes')
const tipoReceitaRadio = document.getElementById('tipo-receita')
const tipoDespesaRadio = document.getElementById('tipo-despesa')

// ls == Local Storage
const chave_transacoes_ls = 'transacoes'
let transacoesSalvas;
try {
    transacoesSalvas = JSON.parse(
        localStorage.getItem(chave_transacoes_ls));
} catch (error) {
    transacoesSalvas = null;
}
if (transacoesSalvas == null || transacoesSalvas == undefined) {
    transacoesSalvas = []
}

// MELHORIA 1: id incremental (0, 1, 2, ... N) -----------------------------
// Em vez de um id aleatório (que podia se repetir), guardamos um contador
// que começa em 0. Se já existirem transações salvas, o contador continua
// a partir do maior id já usado, garantindo que nenhum id se repita mesmo
// depois de exclusões.
let proximoId = transacoesSalvas.length > 0
    ? Math.max(...transacoesSalvas.map((transacao) => transacao.id)) + 1
    : 0;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descTransacao = descImput.value.trim();
    const valorDigitado = valorImput.value.trim();

    // Fail fast - falhar cedo
    if ((descTransacao == "") || (valorDigitado == "")) {
        alert('Descrição e valor não podem ser vazios.')
        return;
    }

    // MELHORIA 2: o usuário sempre digita um valor positivo. O tipo da
    // transação (Receita/Despesa), escolhido no seletor do formulário,
    // é que decide o sinal do valor — sem precisar digitar "-".
    let valorTransacao = Math.abs(parseFloat(valorDigitado));
    if (tipoDespesaRadio.checked) {
        valorTransacao = -valorTransacao;
    }

    const transacao = {
        id: proximoId,
        descricao: descTransacao,
        valor: valorTransacao
    }
    proximoId++;

    somaAoSaldo(transacao)
    somaReceitaDespesa(transacao)
    addTransacaoAoDOM(transacao)

    transacoesSalvas.push(transacao)
    localStorage.setItem(chave_transacoes_ls,
        JSON.stringify(transacoesSalvas))

    descImput.value = "";
    valorImput.value = "";
    tipoReceitaRadio.checked = true;
    descImput.focus();
});

function addTransacaoAoDOM(transacao) {
    const classeCSS = transacao.valor < 0 ? 'negativo' : 'positivo'

    const li = document.createElement('li')
    li.classList.add(classeCSS)
    li.innerHTML = `${transacao.descricao} 
                    <span>R$${transacao.valor.toFixed(2)}</span>
                    <button onclick="excluiTransacao(${transacao.id}, this)" 
                            class="delete-btn">X</button>`

    transacoesUL.append(li)
}

function somaReceitaDespesa(transacao) {
    atualizaReceitaDespesa(transacao, 1)
}

function subtraiReceitaDespesa(transacao) {
    atualizaReceitaDespesa(transacao, -1)
}

function atualizaReceitaDespesa(transacao, sinal) {
    const elemento = transacao.valor < 0 ? despesaP : receitaP
    const prefixo = transacao.valor < 0 ? "- R$" : "+ R$"

    let valorAtual = elemento.innerHTML.replace(prefixo, "")
    valorAtual = parseFloat(valorAtual)
    valorAtual += sinal * Math.abs(transacao.valor)
    elemento.innerHTML = `${prefixo}${valorAtual.toFixed(2)}`
}

function somaAoSaldo(transacao) {
    atualizaSaldo(transacao.valor)
}

function subtraiDoSaldo(transacao) {
    atualizaSaldo(-transacao.valor)
}

function atualizaSaldo(delta) {
    let total = balancoH1.innerHTML.replace('R$', '');
    total = parseFloat(total)
    total += delta;
    balancoH1.innerHTML = `R$${total.toFixed(2)}`
}

function carregarDados() {
    transacoesUL.innerHTML = ''
    balancoH1.innerHTML = 'R$0.00'
    receitaP.innerHTML = '+ R$0.00'
    despesaP.innerHTML = '- R$0.00'

    for (let i = 0; i < transacoesSalvas.length; i++) {
        somaAoSaldo(transacoesSalvas[i])
        somaReceitaDespesa(transacoesSalvas[i])
        addTransacaoAoDOM(transacoesSalvas[i])
    }
}
carregarDados();

// MELHORIA 3: exclusão sem recarregar tudo do Local Storage ---------------
// Antes: excluiTransacao apagava do array/localStorage e chamava
// carregarDados(), que zerava o <ul>, o saldo e as receitas/despesas para
// depois reconstruir tudo de novo a partir do zero.
// Agora: a função remove diretamente o <li> clicado, tira só aquela
// transação do array/Local Storage, e ajusta saldo/receitas/despesas
// subtraindo apenas o valor removido — sem tocar nas demais transações.
function excluiTransacao(id, botao) {
    const transacaoIndex = transacoesSalvas.findIndex((transacao) =>
        transacao.id === id
    );

    if (transacaoIndex === -1) return;

    const transacao = transacoesSalvas[transacaoIndex]

    // 1) Exclusão do elemento li correspondente
    const li = botao.closest('li')
    li.remove()

    // 2) Exclusão da transação do Local Storage (e do array em memória)
    transacoesSalvas.splice(transacaoIndex, 1)
    localStorage.setItem(chave_transacoes_ls,
        JSON.stringify(transacoesSalvas))

    // 3) Atualização do balanço e das receitas/despesas
    subtraiDoSaldo(transacao)
    subtraiReceitaDespesa(transacao)
}
