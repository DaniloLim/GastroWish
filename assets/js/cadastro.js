document.getElementById('form-cadastro').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Verifica se já existe um usuário cadastrado
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Checa se o nome de usuário ou e-mail já estão cadastrados
    const userExists = users.some(user => user.username === username || user.email === email);

    if (userExists) {
        alert('Usuário ou e-mail já cadastrados!');
        return;
    }

    // Cria um novo usuário e adiciona ao localStorage
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';  // Redireciona para a página de login
});
