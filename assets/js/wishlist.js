document.addEventListener("DOMContentLoaded", function () {
    const listaWishlist = document.getElementById("lista-wishlist");

    // Carrega a wishlist
    function carregarWishlist() {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        listaWishlist.innerHTML = "";

        wishlist.forEach((restaurante, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${restaurante.nome}</strong> - ${restaurante.endereco}
                <br><em>${restaurante.categoria} - ${restaurante.tipo}</em>
                <button class="btn-visitado" data-index="${index}">✅ Marcar como Visitado</button>
                <button class="btn-remover" data-index="${index}">❌ Remover</button>
            `;

            listaWishlist.appendChild(li);
        });

        // Adiciona eventos aos botões
        document.querySelectorAll('.btn-visitado').forEach(button => {
            button.addEventListener('click', () => marcarComoVisitado(button.dataset.index));
        });

        document.querySelectorAll('.btn-remover').forEach(button => {
            button.addEventListener('click', () => removerWishlist(button.dataset.index));
        });
    }

    // Marcar restaurante como visitado
    function marcarComoVisitado(index) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const restaurantes = JSON.parse(localStorage.getItem("restaurantes")) || [];

        const restaurante = wishlist[index];
        let avaliacao = prompt("Dê uma nota de 1 a 5 estrelas:");

        // Valida a avaliação
        while (avaliacao === null || isNaN(avaliacao) || avaliacao < 1 || avaliacao > 5) {
            alert("Por favor, insira uma nota válida de 1 a 5.");
            avaliacao = prompt("Dê uma nota de 1 a 5 estrelas:");
        }

        const comentario = prompt("Adicione um comentário sobre sua experiência:");

        restaurante.avaliacao = avaliacao;
        restaurante.comentario = comentario;

        restaurantes.push(restaurante);
        wishlist.splice(index, 1);

        localStorage.setItem("restaurantes", JSON.stringify(restaurantes));
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        carregarWishlist();
    }

    // Remover da wishlist
    function removerWishlist(index) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        carregarWishlist();
    }

    // Botão de voltar
    function voltar() {
        window.location.href = "./restaurantes.html"; // Ajuste o caminho conforme necessário
    }

    // Vincula o botão de voltar à função
    const btnVoltar = document.getElementById("btn-voltar");
    if (btnVoltar) {
        btnVoltar.addEventListener("click", voltar);
    }

    // Carrega a wishlist ao iniciar
    carregarWishlist();
});