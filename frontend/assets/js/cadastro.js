document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api';
    const form = document.getElementById('form-cadastro');
    const nameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    // Novos campos
    const phoneInput = document.getElementById('phone');
    const favoriteFoodInput = document.getElementById('favorite_food');
    const favoriteTypeInput = document.getElementById('favorite_type');
    const profilePictureInput = document.getElementById('profile_picture');

    // Função para mostrar mensagens
    function showMessage(message, isError = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isError ? 'error' : 'success'}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 8px;
            text-align: center;
            color: white;
            background-color: ${isError ? '#ef4444' : '#10b981'};
        `;
        
        form.insertBefore(messageDiv, form.firstChild);
        
        setTimeout(() => messageDiv.remove(), 3000);
    }

    // Validações
    const validations = {
        name: (value) => {
            const isValid = value.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(value);
            return { isValid, message: 'Nome deve ter pelo menos 3 letras e apenas caracteres alfabéticos' };
        },
        email: (value) => {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            return { isValid, message: 'Email inválido' };
        },
        password: (value) => {
            const isValid = value.length >= 6;
            return { isValid, message: 'Senha deve ter pelo menos 6 caracteres' };
        }
    };

    // Função principal de cadastro
    async function handleRegistration(formData) {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                // fetch will set multipart/form-data automatically with FormData
                body: formData
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            showMessage('Cadastro realizado com sucesso!', false);
            setTimeout(() => window.location.href = 'login.html', 1500);

        } catch (error) {
            showMessage(error.message);
        }
    }

    // Event Listeners
    form?.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        // Captura dos novos campos
        const phone = phoneInput.value.trim();
        const favorite_food = favoriteFoodInput.value.trim();
        const favorite_type = favoriteTypeInput.value.trim();

        // Validar todos os campos
        const nameValidation = validations.name(name);
        const emailValidation = validations.email(email);
        const passwordValidation = validations.password(password);

        if (!nameValidation.isValid) {
            showMessage(nameValidation.message);
            return;
        }

        if (!emailValidation.isValid) {
            showMessage(emailValidation.message);
            return;
        }

        if (!passwordValidation.isValid) {
            showMessage(passwordValidation.message);
            return;
        }

        // Build FormData including file if provided
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('favorite_food', favorite_food);
        formData.append('favorite_type', favorite_type);
        if (profilePictureInput.files[0]) {
            formData.append('profile_picture', profilePictureInput.files[0]);
        }

        await handleRegistration(formData);
    });

    // Validações em tempo real
    [nameInput, emailInput, passwordInput].forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                const validation = validations[this.id](this.value);
                this.style.borderColor = this.value && !validation.isValid ? '#ef4444' : '';
            });
        }
    });
});