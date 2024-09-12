// Elementos do DOM
let campoBusca = document.getElementById('campo-busca');
let botaoBusca = document.getElementById('botao-busca');
let containerSeries = document.getElementById('container-series');
let controlesPagina = document.getElementById('controles-pagina');

let apiBaseURL = 'http://localhost:3000/series';
let paginaAtual = 1;
let itensPorPagina = 10; // Quantidade fixa de itens por página
let totalItens = 0;
let buscaAtual = '';
let buscando = false; // Flag para verificar se a busca foi acionada

// Event Listeners
botaoBusca.addEventListener('click', () => {
    buscaAtual = campoBusca.value.trim();
    paginaAtual = 1;
    buscando = true; // A busca foi acionada
    buscarSeries();
});

// Função para buscar séries
async function buscarSeries() {
    let url = `${apiBaseURL}?pagina=${paginaAtual}&limite=${itensPorPagina}`;
    
    if (buscaAtual !== '') {
        url = `${apiBaseURL}?titulo=${encodeURIComponent(buscaAtual)}&pagina=${paginaAtual}&limite=${itensPorPagina}`;
    }

    try {
        let resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error('Erro na requisição');
        }
        let dados = await resposta.json();
        totalItens = dados.total; // Supondo que a API retorna um campo 'total'
        exibirSeries(dados.series); // Supondo que a API retorna as séries no campo 'series'
        configurarPaginacao();
    } catch (erro) {
        console.error(erro);
        containerSeries.innerHTML = '<p>Ocorreu um erro ao buscar as séries.</p>';
    }
}

// Função para exibir as séries
function exibirSeries(series) {
    containerSeries.innerHTML = '';

    if (buscando && (!series || series.length === 0)) {
        containerSeries.innerHTML = '<p>Nenhuma série encontrada.</p>';
    } else {
        if (series && series.length > 0) {
            series.forEach(serie => {
                let card = document.createElement('div');
                card.classList.add('cartao-serie');

                let img = document.createElement('img');
                img.src = serie.poster || 'placeholder.jpg'; // Substitua 'poster' pelo campo correto da API
                img.alt = serie.titulo;

                let info = document.createElement('div');
                info.classList.add('info-serie');

                let titulo = document.createElement('h3');
                titulo.textContent = serie.titulo;

                let descricao = document.createElement('p');
                descricao.textContent = serie.descricao || 'Sem descrição disponível.'; // Substitua 'descricao' pelo campo correto

                info.appendChild(titulo);
                info.appendChild(descricao);

                card.appendChild(img);
                card.appendChild(info);

                containerSeries.appendChild(card);
            });
        }
    }
}

// Função para configurar a paginação
function configurarPaginacao() {
    controlesPagina.innerHTML = '';
    let totalPaginas = Math.ceil(totalItens / itensPorPagina);

    // Botão Anterior
    let botaoAnterior = document.createElement('button');
    botaoAnterior.textContent = 'Anterior';
    botaoAnterior.disabled = paginaAtual === 1;
    botaoAnterior.classList.toggle('desabilitado', botaoAnterior.disabled);
    botaoAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            buscarSeries();
        }
    });
    controlesPagina.appendChild(botaoAnterior);

    // Botões de Página
    for (let i = 1; i <= totalPaginas; i++) {
        if (i > paginaAtual + 2 || i < paginaAtual - 2) continue; // Limita a exibição de páginas próximas

        let botaoPagina = document.createElement('button');
        botaoPagina.textContent = i;
        botaoPagina.classList.toggle('ativo', i === paginaAtual);
        botaoPagina.addEventListener('click', () => {
            paginaAtual = i;
            buscarSeries();
        });
        controlesPagina.appendChild(botaoPagina);
    }

    // Botão Próximo
    let botaoProximo = document.createElement('button');
    botaoProximo.textContent = 'Próximo';
    botaoProximo.disabled = paginaAtual === totalPaginas;
    botaoProximo.classList.toggle('desabilitado', botaoProximo.disabled);
    botaoProximo.addEventListener('click', () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            buscarSeries();
        }
    });
    controlesPagina.appendChild(botaoProximo);
}

// Inicializar a aplicação
buscarSeries();
