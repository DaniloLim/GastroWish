document.addEventListener("DOMContentLoaded", function () {
    const formRestaurante = document.getElementById("form-restaurante");
    const listaRestaurantes = document.getElementById("lista-restaurantes");
    const googleLinkInput = document.getElementById("google-link");
    const importarBtn = document.getElementById("importar-btn");
    const logoutBtn = document.getElementById("logout-btn");

    function carregarRestaurantes() {
        const restaurantes = JSON.parse(localStorage.getItem("restaurantes")) || [];
        listaRestaurantes.innerHTML = "";

        restaurantes.forEach((restaurante, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${restaurante.nome}</strong> - ${restaurante.endereco} 
                <br><em>${restaurante.categoria} - ${restaurante.tipo}</em>
                ${restaurante.avaliacao ? `<br>⭐ ${restaurante.avaliacao} - ${restaurante.comentario}` : ""}
                <button onclick="adicionarWishlist(${index})">❤️</button>
                <button onclick="removerRestaurante(${index})">Remover</button>
            `;

            listaRestaurantes.appendChild(li);
        });
    }

    formRestaurante.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const endereco = document.getElementById("endereco").value;
        const categoria = document.getElementById("categoria").value;
        const tipo = document.getElementById("tipo").value;

        const restaurantes = JSON.parse(localStorage.getItem("restaurantes")) || [];
        restaurantes.push({ nome, endereco, categoria, tipo });
        localStorage.setItem("restaurantes", JSON.stringify(restaurantes));

        formRestaurante.reset();
        carregarRestaurantes();
    });

    function removerRestaurante(index) {
        const restaurantes = JSON.parse(localStorage.getItem("restaurantes")) || [];
        restaurantes.splice(index, 1);
        localStorage.setItem("restaurantes", JSON.stringify(restaurantes));
        carregarRestaurantes();
    }

    // Função para adicionar restaurante à Wishlist
    function adicionarWishlist(index) {
        const restaurantes = JSON.parse(localStorage.getItem("restaurantes")) || [];
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        wishlist.push(restaurantes[index]);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        alert("Adicionado à lista de desejos!");
    }

    // Importar restaurante pelo link do Google Maps
    importarBtn.addEventListener("click", function () {
        const link = googleLinkInput.value;

        if (!link.includes("google.com/maps")) {
            alert("Por favor, insira um link válido do Google Maps.");
            return;
        }

        const nomeExtraido = link.split("/")[5] || "Restaurante Importado";
        const enderecoExtraido = "Endereço não disponível";

        const restaurantes = JSON.parse(localStorage.getItem("restaurantes")) || [];
        restaurantes.push({ nome: nomeExtraido, endereco: enderecoExtraido, categoria: "Desconhecida", tipo: "Desconhecido" });
        localStorage.setItem("restaurantes", JSON.stringify(restaurantes));

        googleLinkInput.value = "";
        carregarRestaurantes();
    });

    // Logout
    logoutBtn.addEventListener("click", function () {
        alert("Você saiu!");
        window.location.href = "login.html";
    });

    carregarRestaurantes();
});
