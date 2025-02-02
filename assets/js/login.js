document.getElementById('form-login').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verifica se o usuário existe e a senha está correta
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        alert('Login realizado com sucesso!');
        window.location.href = 'index.html';  // Redireciona para a página principal do grupo
    } else {
        alert('Usuário ou senha inválidos!');
    }
});
