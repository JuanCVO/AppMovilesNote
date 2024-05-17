function login() {
      // Redirigir a la página de inicio de sesión
      window.location.href = '../principal.html'; // Cambia 'login.html' a la URL de tu página de inicio de sesión
    }

function register() {
      // Redirigir a la página de registro
      window.location.href = '../registro.html'; // Cambia 'register.html' a la URL de tu página de registro
    }
 function registrar() {
      // Mostrar mensaje de registro exitoso
      document.getElementById('registered-message').style.display = 'block';
      // Redirigir a otra página después de 2 segundos (2000 milisegundos)
      setTimeout(function() {
        window.location.href = '../index.html'; // Cambia 'bienvenido.html' a la URL de tu página de bienvenida
      }, 2000);
    }

