document.addEventListener('DOMContentLoaded', function() {
    // Cache de elementos DOM
    const elements = {
        filterToggle: document.querySelector('.filter-toggle-btn'),
        filtersPanel: document.querySelector('.filters-panel'),
        distanceSlider: document.querySelector('#distance-slider'),
        distanceDisplay: document.querySelector('#distance-display'),
        searchInput: document.querySelector('#search-input'),
        restaurantsContainer: document.querySelector('#restaurants-container'),
        notification: document.querySelector('#notification'),
        notificationMessage: document.querySelector('.notification-message'),
        notificationClose: document.querySelector('.notification-close')
    };

    // Array de imagens de exemplo da internet (usando Unsplash)
    const restaurantImages = [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format',
        'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=1000&auto=format',
        'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=1000&auto=format',
        'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=1000&auto=format',
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1000&auto=format',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format'
    ];

    // Função para gerar um placeholder dinâmico caso a imagem falhe
    function generatePlaceholderUrl(name, width = 400, height = 300) {
        const backgroundColor = Math.floor(Math.random()*16777215).toString(16);
        const textColor = 'ffffff';
        return `https://via.placeholder.com/${width}x${height}/${backgroundColor}/${textColor}?text=${encodeURIComponent(name)}`;
    }

    // Estado da aplicação com imagens reais
    const state = {
        restaurants: [
            {
                id: 1,
                name: "Bella Italia",
                image: restaurantImages[0],
                rating: 4.5,
                price: "$$",
                cuisine: "Italiana",
                service: "À la Carte",
                distance: 2.5,
                delivery: true,
                openNow: true,
                description: "Autêntica culinária italiana no coração da cidade."
            },
            {
                id: 2,
                name: "Sushi Master",
                image: restaurantImages[1],
                rating: 4.8,
                price: "$$$",
                cuisine: "Japonesa",
                service: "Rodízio",
                distance: 3.2,
                delivery: true,
                openNow: true,
                description: "O melhor da culinária japonesa com chefs especializados."
            },
            {
                id: 3,
                name: "Sabor Mineiro",
                image: restaurantImages[2],
                rating: 4.3,
                price: "$$",
                cuisine: "Brasileira",
                service: "Self Service",
                distance: 1.8,
                delivery: false,
                openNow: false,
                description: "Comida mineira tradicional com aquele gostinho de casa."
            },
            {
                id: 4,
                name: "Le Bistrot",
                image: restaurantImages[3],
                rating: 4.7,
                price: "$$$$",
                cuisine: "Francesa",
                service: "À la Carte",
                distance: 4.1,
                delivery: false,
                openNow: true,
                description: "Experiência gastronômica francesa autêntica."
            },
            {
                id: 5,
                name: "Taco Loco",
                image: restaurantImages[4],
                rating: 4.2,
                price: "$",
                cuisine: "Mexicana",
                service: "Casual",
                distance: 1.5,
                delivery: true,
                openNow: true,
                description: "Sabores autênticos do México."
            },
            {
                id: 6,
                name: "Dragon Wok",
                image: restaurantImages[5],
                rating: 4.4,
                price: "$$",
                cuisine: "Chinesa",
                service: "Delivery",
                distance: 2.8,
                delivery: true,
                openNow: true,
                description: "O melhor da culinária chinesa tradicional."
            }
        ],
        filters: {
            price: [],
            cuisine: [],
            service: 'todos',
            distance: 5,
            delivery: false,
            rating: 0,
            status: 'todos'
        },
        wishlist: new Set(),
        groups: new Set()
    };

    // Função para criar estrelas de avaliação
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - Math.ceil(rating);
        
        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    // Função para criar card do restaurante
    function createRestaurantCard(restaurant) {
        const isInWishlist = state.wishlist.has(restaurant.id);
        
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.dataset.id = restaurant.id;

        // Handler para erro de carregamento de imagem
        const handleImageError = (imgElement) => {
            imgElement.src = generatePlaceholderUrl(restaurant.name);
        };
        
        card.innerHTML = `
            <img src="${restaurant.image}" 
                 alt="${restaurant.name}" 
                 class="restaurant-image"
                 onerror="this.src='${generatePlaceholderUrl(restaurant.name)}'">
            <div class="restaurant-status ${restaurant.openNow ? 'status-open' : 'status-closed'}">
                ${restaurant.openNow ? 'Aberto' : 'Fechado'}
            </div>
            <div class="restaurant-info">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <div class="restaurant-rating">
                    ${generateStarRating(restaurant.rating)}
                    <span class="rating-number">${restaurant.rating}</span>
                </div>
                <div class="restaurant-details">
                    <p class="price-cuisine">${restaurant.price} • ${restaurant.cuisine}</p>
                    <p class="distance-delivery">
                        ${restaurant.distance}km 
                        ${restaurant.delivery ? '• Delivery disponível' : ''}
                    </p>
                    <p class="service">${restaurant.service}</p>
                </div>
                <div class="card-buttons">
                    <button class="add-group-btn" title="Adicionar ao Grupo">
                        <i class="fas fa-users"></i>
                        <span>Adicionar ao Grupo</span>
                    </button>
                    <button class="add-wishlist-btn ${isInWishlist ? 'active' : ''}" 
                            title="Adicionar aos Favoritos">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Função para renderizar restaurantes
    function renderRestaurants(restaurants) {
        elements.restaurantsContainer.innerHTML = '';
        if (restaurants.length === 0) {
            elements.restaurantsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Nenhum restaurante encontrado</p>
                </div>
            `;
            return;
        }
        
        restaurants.forEach(restaurant => {
            elements.restaurantsContainer.appendChild(createRestaurantCard(restaurant));
        });
    }

    // Funções de filtro e busca
    function filterRestaurants(searchTerm = '') {
        return state.restaurants.filter(restaurant => {
            const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesFilters = 
                (state.filters.price.length === 0 || state.filters.price.includes(restaurant.price)) &&
                (state.filters.cuisine.length === 0 || state.filters.cuisine.includes(restaurant.cuisine)) &&
                (state.filters.service === 'todos' || restaurant.service === state.filters.service) &&
                restaurant.distance <= state.filters.distance &&
                (!state.filters.delivery || restaurant.delivery) &&
                restaurant.rating >= state.filters.rating &&
                (state.filters.status === 'todos' || 
                 (state.filters.status === 'aberto' && restaurant.openNow) ||
                 (state.filters.status === 'fechado' && !restaurant.openNow));

            return matchesSearch && matchesFilters;
        });
    }

    // Event Listeners e Inicialização
    function init() {
        // Event listeners
        elements.filterToggle?.addEventListener('click', () => {
            elements.filtersPanel.classList.toggle('active');
        });

        elements.distanceSlider?.addEventListener('input', (e) => {
            elements.distanceDisplay.textContent = `${e.target.value} km`;
            state.filters.distance = parseInt(e.target.value);
        });

        elements.searchInput?.addEventListener('input', debounce((e) => {
            const filtered = filterRestaurants(e.target.value);
            renderRestaurants(filtered);
        }, 300));

        elements.restaurantsContainer?.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.add-wishlist-btn');
            const groupBtn = e.target.closest('.add-group-btn');
            const card = e.target.closest('.restaurant-card');

            if (!card) return;

            const restaurantId = parseInt(card.dataset.id);

            if (wishlistBtn) {
                toggleWishlist(restaurantId, wishlistBtn);
            } else if (groupBtn) {
                addToGroup(restaurantId);
            }
        });

        // Renderização inicial
        renderRestaurants(state.restaurants);
    }

    // Funções utilitárias
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function showNotification(message, type = 'success') {
        elements.notificationMessage.textContent = message;
        elements.notification.className = `notification ${type}`;
        elements.notification.classList.add('active');

        setTimeout(() => {
            elements.notification.classList.remove('active');
        }, 3000);
    }

    function toggleWishlist(restaurantId, button) {
        if (state.wishlist.has(restaurantId)) {
            state.wishlist.delete(restaurantId);
            button.classList.remove('active');
            showNotification('Removido dos favoritos');
        } else {
            state.wishlist.add(restaurantId);
            button.classList.add('active');
            showNotification('Adicionado aos favoritos');
        }
    }

    function addToGroup(restaurantId) {
        if (state.groups.has(restaurantId)) {
            showNotification('Este restaurante já está em um grupo', 'info');
        } else {
            state.groups.add(restaurantId);
            showNotification('Adicionado ao grupo com sucesso!');
        }
    }

    // Profile Dropdown Functionality
    const profileTrigger = document.querySelector('.profile-trigger');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const userInfo = JSON.parse(localStorage.getItem('userData')) || {};
    const profileImage = document.querySelector('.profile-image');
    
    // Update profile info and image
    if (userInfo.id) {  // Changed from userInfo.name to userInfo.id
        document.querySelector('.profile-name').textContent = userInfo.name || 'Usuário';
        
        // Fetch user profile data including profile picture
        fetch(`/api/profile/${userInfo.id}`)
            .then(response => response.json())
            .then(userData => {
                if (userData.profile_picture) {
                    // Remove the file:// prefix if present and adjust the path
                    const picturePath = userData.profile_picture.replace('\\', '/').split('backend/')[1];
                    profileImage.src = `/${picturePath}`;
                    
                    // Handle image loading error
                    profileImage.onerror = () => {
                        console.log('Failed to load profile picture, falling back to default');
                        profileImage.src = '/assets/css/img/default-avatar.jpg';
                    };
                } else {
                    console.log('No profile picture found, using default');
                    profileImage.src = '/assets/css/img/default-avatar.jpg';
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                profileImage.src = '/assets/css/img/default-avatar.jpg';
            });
    }

    // Toggle dropdown
    profileTrigger?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-dropdown')) {
            dropdownMenu?.classList.remove('active');
        }
    });

    // Inicializar a aplicação
    init();
});