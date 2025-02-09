document.addEventListener('DOMContentLoaded', function() {
    // Botões de navegação
    const loginButton = document.querySelector('.login');
    const cadastroButton = document.querySelector('.cadastre-se');

    // Adiciona eventos de clique nos botões
    loginButton.addEventListener('click', () => {
        window.location.href = '../pages/login.html';
    });

    cadastroButton.addEventListener('click', () => {
        window.location.href = '../pages/cadastro.html';
    });

    // Funcionalidade do Carrossel
    const carrossel = document.querySelector('.carrossel-imagens');
    const images = Array.from(carrossel.getElementsByTagName('img'));
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentIndex = 0;
    const totalImages = images.length;
    const slideInterval = 5000; // 5 segundos
    let slideTimer;

    // Função para inicializar o carrossel
    function initCarousel() {
        images.forEach((img, index) => {
            img.style.transform = `translateX(${100 * index}%)`;
        });
        startAutoSlide();
    }

    // Função para mover os slides
    function moveSlides(direction) {
        currentIndex = (currentIndex + direction + totalImages) % totalImages;
        updateSlidePosition();
        resetAutoSlide();
    }

    // Função para atualizar a posição dos slides
    function updateSlidePosition() {
        images.forEach((img, index) => {
            img.style.transform = `translateX(${100 * (index - currentIndex)}%)`;
        });
    }

    // Função para iniciar o slide automático
    function startAutoSlide() {
        slideTimer = setInterval(() => {
            moveSlides(1);
        }, slideInterval);
    }

    // Função para resetar o timer do slide automático
    function resetAutoSlide() {
        clearInterval(slideTimer);
        startAutoSlide();
    }

    // Event listeners
    prevBtn.addEventListener('click', () => moveSlides(-1));
    nextBtn.addEventListener('click', () => moveSlides(1));

    // Pausa o carrossel quando o mouse está sobre ele
    carrossel.addEventListener('mouseenter', () => clearInterval(slideTimer));
    carrossel.addEventListener('mouseleave', startAutoSlide);

    // Suporte para touch
    let touchStartX = 0;
    let touchEndX = 0;

    carrossel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(slideTimer);
    });

    carrossel.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    carrossel.addEventListener('touchend', () => {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                moveSlides(1);
            } else {
                moveSlides(-1);
            }
        }
        startAutoSlide();
    });

    // Suporte para teclas de seta
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveSlides(-1);
        } else if (e.key === 'ArrowRight') {
            moveSlides(1);
        }
    });

    // Inicializa o carrossel
    initCarousel();
});