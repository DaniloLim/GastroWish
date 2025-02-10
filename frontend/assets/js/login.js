document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api';
    const form = document.getElementById('form-login');
    const emailInput = document.getElementById('email'); // ID correto do seu HTML
    const passwordInput = document.getElementById('password'); // ID correto do seu HTML
    const loginButton = document.querySelector('button[type="submit"]');
    const rememberCheckbox = document.getElementById('remember');

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

    // Função de loading
    function setLoading(isLoading) {
        loginButton.disabled = isLoading;
        loginButton.innerHTML = isLoading ? 
            '<i class="fas fa-circle-notch fa-spin"></i> Entrando...' : 
            'Entrar';
    }

    // Função principal de login
    async function handleLogin(email, password) {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            localStorage.setItem('userData', JSON.stringify({
                id: data.id,
                name: data.name,
                email: data.email
            }));

            if (rememberCheckbox?.checked) {
                localStorage.setItem('savedEmail', email);
            }

            showMessage('Login realizado com sucesso!', false);
            setTimeout(() => window.location.href = 'index.html', 1500);

        } catch (error) {
            showMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Event Listeners
    form?.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showMessage('Preencha todos os campos');
            return;
        }

        await handleLogin(email, password);
    });

    // Carregar email salvo
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail && emailInput && rememberCheckbox) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }
});