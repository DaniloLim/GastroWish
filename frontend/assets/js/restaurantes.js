document.addEventListener("DOMContentLoaded", function () {
    const formRestaurante = document.getElementById("form-restaurante");
    const listaRestaurantes = document.getElementById("lista-restaurantes");
    const googleLinkInput = document.getElementById("google-link");
    const importarBtn = document.getElementById("importar-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // Carregar restaurantes da API
    async function carregarRestaurantes() {
        try {
            const response = await fetch('http://localhost:3000/restaurantes');
            const restaurantes = await response.json();
            
            listaRestaurantes.innerHTML = restaurantes.map(restaurante => `
                <li data-id="${restaurante.id}">
                    <strong>${restaurante.nome}</strong> - ${restaurante.endereco} 
                    <br><em>${restaurante.categoria} - ${restaurante.tipo}</em>
                    <button onclick="adicionarWishlist('${restaurante.id}')">❤️</button>
                    <button onclick="removerRestaurante('${restaurante.id}')">Remover</button>
                </li>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar:', error);
        }
    }

    // Enviar para a API
    formRestaurante.addEventListener("submit", async (event) => {
        event.preventDefault();

        const restaurante = {
            nome: document.getElementById("nome").value,
            endereco: document.getElementById("endereco").value,
            categoria: document.getElementById("categoria").value,
            tipo: document.getElementById("tipo").value
        };

        try {
            const response = await fetch('http://localhost:3000/restaurantes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(restaurante)
            });

            if (response.ok) {
                formRestaurante.reset();
                await carregarRestaurantes();
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    });

    // Remover via API
    async function removerRestaurante(id) {
        if (confirm('Tem certeza que deseja remover este restaurante?')) {
            try {
                const response = await fetch(`http://localhost:3000/restaurantes/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    await carregarRestaurantes();
                }
            } catch (error) {
                console.error('Erro:', error);
            }
        }
    }

    function criarItemRestaurante(restaurante) {
        return `
            <li>
                <h3>${restaurante.nome}</h3>
                <p>Endereço: ${restaurante.endereco}</p>
                <div class="meta-info">
                    <span>Categoria: ${restaurante.categoria}</span>
                    <span>Tipo: ${restaurante.tipo}</span>
                </div>
                <div class="actions">
                    <button class="favorito-btn" onclick="adicionarWishlist('${restaurante.id}')">
                        ❤️ Favorito
                    </button>
                    <button class="remover-btn" onclick="removerRestaurante('${restaurante.id}')">
                        🗑️ Remover
                    </button>
                </div>
            </li>
        `;
    }


    // Wishlist (mantive localStorage apenas para este recurso)
    function adicionarWishlist(id) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const restaurante = Array.from(listaRestaurantes.children)
            .find(li => li.dataset.id === id)
            .textContent;
        
        wishlist.push(restaurante);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Adicionado à lista de desejos!");
    }

    // Importar do Google Maps
    importarBtn.addEventListener("click", async () => {
        const link = googleLinkInput.value;

        if (!link.includes("google.com/maps")) {
            alert("Por favor, insira um link válido do Google Maps.");
            return;
        }

        const nomeExtraido = link.split("/")[5]?.replace(/\+/g, ' ') || "Restaurante Importado";
        
        try {
            const response = await fetch('http://localhost:3000/restaurantes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: nomeExtraido,
                    endereco: "Endereço importado do Google Maps",
                    categoria: "Desconhecida",
                    tipo: "Desconhecido"
                })
            });

            if (response.ok) {
                googleLinkInput.value = "";
                await carregarRestaurantes();
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    });

    // Logout (mantido igual)
    logoutBtn.addEventListener("click", function () {
        alert("Você saiu!");
        window.location.href = "login.html";
    });

    carregarRestaurantes();
});