document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aqui você pode adicionar a lógica para validar o login
    // Por exemplo, fazer uma requisição para o backend

    if (username && password) {
        alert('Login realizado com sucesso!');
        // Redirecionar para a página de lista de restaurantes
        window.location.href = 'lista-restaurantes.html';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});