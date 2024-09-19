document.addEventListener("DOMContentLoaded", function () {
    const URL = "http://localhost:3000/series";
  
    async function getInfo(pagina, limit) {
      const data = await fetch(`${URL}?pagina=${pagina}&limite=${limit}`);
      const dados = await data.json();
      return dados;
    }
  
    const filmeContent = document.querySelector("#divSeries");
    let currentPage = 1;
    let limit = 10;
  
    window.onload = () => {
      series(currentPage, limit);
    };
  
    async function series(pagina, limit) {
      currentPage = pagina;
      const dados = await getInfo(pagina, limit);
  
      document.getElementById("left").removeEventListener("click", previousPage);
      document.getElementById("right").removeEventListener("click", nextPage);
  
      deleteSeries();
  
      dados.data.forEach((element) => showSeries(element));
  
      document.getElementById("current-page").textContent = currentPage;
  
      if (currentPage - 1 >= 1) {
        let back = document.getElementById("left");
        back.style.display = "block";
        back.addEventListener("click", previousPage);
      } else {
        document.getElementById("left").style.display = "none";
      }
  
      if (currentPage + 1 <= Math.ceil(dados.total / limit)) {
        let next = document.getElementById("right");
        next.style.display = "block";
        next.addEventListener("click", nextPage);
      } else {
        document.getElementById("right").style.display = "none";
      }
    }
  
    function previousPage() {
      if (currentPage > 1) {
        series(currentPage - 1, limit);
      }
    }
  
    function nextPage() {
      series(currentPage + 1, limit);
    }
  
    function showSeries(element) {
      let div = document.createElement("div");
      div.className = "series-item";
      let titulo = document.createElement("p");
      titulo.innerHTML = element.tituloDestacado || element.titulo;
      let img = document.createElement("img");
      img.src = element.imagem;
  
      div.appendChild(titulo);
      div.appendChild(img);
      filmeContent.appendChild(div);
    }
  
    function deleteSeries() {
      filmeContent.innerHTML = "";
    }
  
    window.buscar = async function () {
      const inputBusca = document.getElementById("search").value.toLowerCase();
      filmeContent.innerHTML = "";
  
      const dados = await getInfo(1, 240);
  
      const resultadosFiltrados = dados.data.filter((elemento) => {
        const titulo = elemento.titulo.toLowerCase();
        if (titulo.includes(inputBusca)) {
          const termoDestacado = titulo.replace(
            new RegExp(inputBusca, "gi"),
            (match) => `<span class="destaque">${match}</span>`
          );
          elemento.tituloDestacado = termoDestacado;
          return true;
        }
        return false;
      });
  
      resultadosFiltrados.forEach((elemento) => showSeries(elemento));
  
      if (resultadosFiltrados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum resultado encontrado.";
        filmeContent.appendChild(mensagem);
      }
    };
  });
  
  // Função referente ao scroll para ver o footer
  window.onscroll = function () {
    var footer = document.querySelector("footer");
    // Verifica se o usuário chegou ao final da página
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      footer.style.display = "block"; // Mostra o rodapé
    } else {
      footer.style.display = "none"; // Oculta o rodapé se rolar para cima
    }
  };
  