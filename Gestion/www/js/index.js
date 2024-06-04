function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const storedUser = localStorage.getItem(username);

    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.password === password) {
            // Guardar el nombre de usuario logueado
            localStorage.setItem('loggedInUser', username);

            // Redirigir a la página principal
            window.location.href = 'principal.html';
        } else {
            alert('Contraseña incorrecta.');
        }
    } else {
        alert('Usuario no encontrado.');
    }
}

function register() {
    window.location.href = 'registro.html';
}

function registrar() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        const user = {
            username: username,
            password: password
        };

        localStorage.setItem(username, JSON.stringify(user));
        document.getElementById('registered-message').style.display = 'block';

        setTimeout(function() {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        alert('Por favor, completa todos los campos.');
    }
}
