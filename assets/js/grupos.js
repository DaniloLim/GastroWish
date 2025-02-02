document.addEventListener("DOMContentLoaded", function () {
    const formGrupo = document.getElementById("form-grupo");
    const listaGrupos = document.getElementById("lista-grupos");
    const detalhesGrupo = document.getElementById("detalhes-grupo");
    const nomeDetalhe = document.getElementById("nome-detalhe");
    const descricaoDetalhe = document.getElementById("descricao-detalhe");
    const listaMembros = document.getElementById("lista-membros");
    const listaRestaurantesGrupo = document.getElementById("lista-restaurantes-grupo");
    
    let grupos = JSON.parse(localStorage.getItem("grupos")) || [];
    
    function salvarGrupos() {
        localStorage.setItem("grupos", JSON.stringify(grupos));
    }
    
    function carregarGrupos() {
        listaGrupos.innerHTML = "";
        grupos.forEach((grupo, index) => {
            const li = document.createElement("li");
            li.textContent = grupo.nome;
            li.onclick = () => visualizarGrupo(index);
            listaGrupos.appendChild(li);
        });
    }
    
    formGrupo.addEventListener("submit", function (event) {
        event.preventDefault();
        const nome = document.getElementById("nome-grupo").value;
        const descricao = document.getElementById("descricao-grupo").value;
        grupos.push({ nome, descricao, membros: [], restaurantes: [] });
        salvarGrupos();
        carregarGrupos();
        formGrupo.reset();
    });
    
    function visualizarGrupo(index) {
        const grupo = grupos[index];
        nomeDetalhe.textContent = grupo.nome;
        descricaoDetalhe.textContent = grupo.descricao;
        detalhesGrupo.style.display = "block";
        listaMembros.innerHTML = grupo.membros.map(m => `<li>${m}</li>`).join("");
        listaRestaurantesGrupo.innerHTML = grupo.restaurantes.map(r => `<li>${r}</li>`).join("");
    }
    
    window.adicionarMembro = function () {
        const email = document.getElementById("novo-membro").value;
        if (email) {
            grupos.find(g => g.nome === nomeDetalhe.textContent).membros.push(email);
            salvarGrupos();
            visualizarGrupo(grupos.findIndex(g => g.nome === nomeDetalhe.textContent));
        }
    };
    
    window.adicionarRestauranteGrupo = function () {
        const nomeRestaurante = document.getElementById("nome-restaurante").value;
        if (nomeRestaurante) {
            grupos.find(g => g.nome === nomeDetalhe.textContent).restaurantes.push(nomeRestaurante);
            salvarGrupos();
            visualizarGrupo(grupos.findIndex(g => g.nome === nomeDetalhe.textContent));
        }
    };
    
    window.voltarParaGrupos = function () {
        detalhesGrupo.style.display = "none";
    };
    
    window.sairDoGrupo = function () {
        grupos = grupos.filter(g => g.nome !== nomeDetalhe.textContent);
        salvarGrupos();
        carregarGrupos();
        detalhesGrupo.style.display = "none";
    };
    
    carregarGrupos();
});
