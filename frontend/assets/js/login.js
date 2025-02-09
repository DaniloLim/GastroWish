document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-login');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-btn');
    const googleButton = document.querySelector('.google-btn');
    const rememberCheckbox = document.getElementById('remember');

    // Verificar se existem credenciais salvas
    checkSavedCredentials();

    // Validação de email em tempo real
    emailInput.addEventListener('input', function() {
        validateEmail(this);
    });

    // Mostrar força da senha em tempo real
    passwordInput.addEventListener('input', function() {
        validatePassword(this);
    });

    // Manipular envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            handleLogin();
        }
    });

    // Login com Google
    googleButton.addEventListener('click', handleGoogleLogin);

    // Funções de validação
    function validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value);
        
        if (!isValid) {
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#2ecc71';
        }
        
        return isValid;
    }

    function validatePassword(input) {
        const isValid = input.value.length >= 6;
        
        if (!isValid) {
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#2ecc71';
        }
        
        return isValid;
    }

    function validateForm() {
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        
        return isEmailValid && isPasswordValid;
    }

    // Funções de manipulação de login
    function handleLogin() {
        // Mostrar estado de loading
        loginButton.disabled = true;
        const originalText = loginButton.textContent;
        loginButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Entrando...';

        // Salvar credenciais se "Lembrar-me" estiver marcado
        if (rememberCheckbox.checked) {
            saveCredentials();
        } else {
            clearSavedCredentials();
        }

        // Simular requisição de login
        setTimeout(() => {
            // Aqui você adicionaria sua lógica real de autenticação
            const mockSuccessfulLogin = true;

            if (mockSuccessfulLogin) {
                showSuccess();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showError('Credenciais inválidas');
                loginButton.disabled = false;
                loginButton.textContent = originalText;
            }
        }, 1500);
    }

    function handleGoogleLogin() {
        // Adicionar efeito de loading
        googleButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        googleButton.disabled = true;

        // Simular login com Google
        setTimeout(() => {
            // Aqui você adicionaria sua lógica real de autenticação com Google
            window.location.href = 'index.html';
        }, 1500);
    }

    // Funções para lidar com credenciais salvas
    function saveCredentials() {
        const credentials = {
            email: emailInput.value,
            remember: true
        };
        localStorage.setItem('loginCredentials', JSON.stringify(credentials));
    }

    function clearSavedCredentials() {
        localStorage.removeItem('loginCredentials');
    }

    function checkSavedCredentials() {
        const saved = localStorage.getItem('loginCredentials');
        if (saved) {
            const credentials = JSON.parse(saved);
            emailInput.value = credentials.email;
            rememberCheckbox.checked = credentials.remember;
        }
    }

    // Funções de feedback visual
    function showSuccess() {
        loginButton.style.backgroundColor = '#2ecc71';
        loginButton.innerHTML = '<i class="fas fa-check"></i> Sucesso!';
    }

    function showError(message) {
        // Criar e mostrar mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '10px';
        errorDiv.style.textAlign = 'center';
        
        // Remover mensagem de erro anterior se existir
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        form.appendChild(errorDiv);

        // Remover mensagem após 3 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // Prevenir envio do formulário ao pressionar Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (validateForm()) {
                handleLogin();
            }
        }
    });

    // Adicionar efeito de ripple aos botões
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