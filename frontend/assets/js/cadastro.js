document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-cadastro');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const termsCheckbox = document.getElementById('terms');
    const cadastroButton = document.querySelector('.cadastro-btn');
    const googleButton = document.querySelector('.google-btn');

    // Validação de username em tempo real
    usernameInput.addEventListener('input', function() {
        validateUsername(this);
    });

    // Validação de email em tempo real
    emailInput.addEventListener('input', function() {
        validateEmail(this);
    });

    // Validação de senha em tempo real
    passwordInput.addEventListener('input', function() {
        validatePassword(this);
    });

    // Manipular envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            handleCadastro();
        }
    });

    // Cadastro com Google
    googleButton.addEventListener('click', handleGoogleCadastro);

    // Funções de validação
    function validateUsername(input) {
        const isValid = input.value.length >= 3;
        updateFieldStatus(input, isValid);
        return isValid;
    }

    function validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value);
        updateFieldStatus(input, isValid);
        return isValid;
    }

    function validatePassword(input) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        const isValid = passwordRegex.test(input.value);
        updateFieldStatus(input, isValid);
        return isValid;
    }

    function updateFieldStatus(input, isValid) {
        if (!isValid) {
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#2ecc71';
        }
    }

    function validateForm() {
        const isUsernameValid = validateUsername(usernameInput);
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        const isTermsAccepted = termsCheckbox.checked;

        if (!isTermsAccepted) {
            showError('Por favor, aceite os termos de uso');
        }

        return isUsernameValid && isEmailValid && isPasswordValid && isTermsAccepted;
    }

    // Funções de manipulação de cadastro
    function handleCadastro() {
        cadastroButton.disabled = true;
        const originalText = cadastroButton.textContent;
        cadastroButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Cadastrando...';

        // Simular requisição de cadastro
        setTimeout(() => {
            const mockSuccessfulCadastro = true;

            if (mockSuccessfulCadastro) {
                showSuccess();
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            } else {
                showError('Erro ao cadastrar. Tente novamente.');
                cadastroButton.disabled = false;
                cadastroButton.textContent = originalText;
            }
        }, 1500);
    }

    function handleGoogleCadastro() {
        googleButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        googleButton.disabled = true;

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Funções de feedback visual
    function showSuccess() {
        cadastroButton.style.backgroundColor = '#2ecc71';
        cadastroButton.innerHTML = '<i class="fas fa-check"></i> Sucesso!';
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        form.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Efeito Ripple nos botões
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});