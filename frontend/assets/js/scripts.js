document.getElementById('add-restaurant').addEventListener('click', function() {
    // Cria um novo restaurante fictício
    const restaurant = {
        name: 'Restaurante Exemplo',
        category: 'Rodízio',
        rating: '★★★★☆'
    };

    // Adiciona o restaurante à wishlist
    const wishlistContainer = document.getElementById('wishlist-container');
    const restaurantElement = document.createElement('div');
    restaurantElement.classList.add('restaurant');
    restaurantElement.innerHTML = `
        <h3>${restaurant.name}</h3>
        <p><strong>Categoria:</strong> ${restaurant.category}</p>
        <p><strong>Avaliação:</strong> ${restaurant.rating}</p>
        <button class="visit-btn">Marcar como Visitado</button>
    `;
    wishlistContainer.appendChild(restaurantElement);

    // Adiciona funcionalidade de marcar como visitado
    const visitButton = restaurantElement.querySelector('.visit-btn');
    visitButton.addEventListener('click', function() {
        const visitedContainer = document.getElementById('visited-restaurants');
        const visitedElement = document.createElement('div');
        visitedElement.innerHTML = `
            <h3>${restaurant.name}</h3>
            <p><strong>Categoria:</strong> ${restaurant.category}</p>
            <p><strong>Avaliação:</strong> ${restaurant.rating}</p>
        `;
        visitedContainer.appendChild(visitedElement);

        // Remove o restaurante da wishlist
        wishlistContainer.removeChild(restaurantElement);
    });
    document.addEventListener("DOMContentLoaded", function() {
        fetch("header.html")
            .then(response => response.text())
            .then(data => document.body.insertAdjacentHTML("afterbegin", data));

        fetch("footer.html")
            .then(response => response.text())
            .then(data => document.body.insertAdjacentHTML("beforeend", data));
    });
});
