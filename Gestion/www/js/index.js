var global_database;
var isDatabaseOpen = false;
var isTableCreated = false;

document.addEventListener('DOMContentLoaded', onDeviceReady, false);

function onDeviceReady() {
    console.log('Iniciando aplicación en navegador');
    openDatabase();
}

function openDatabase() {
    if (!window.indexedDB) {
        alert("Tu navegador no soporta una versión estable de IndexedDB. Algunas funcionalidades no estarán disponibles.");
    } else {
        var request = window.indexedDB.open("myDB", 1);

        request.onerror = function(event) {
            console.error('Error al abrir la base de datos', event);
        };

        request.onsuccess = function(event) {
            global_database = event.target.result;
            isDatabaseOpen = true;
            console.log('La base de datos está abierta.');
            createTable();
        };

        request.onupgradeneeded = function(event) {
            global_database = event.target.result;
            var objectStore = global_database.createObjectStore("usuario", { keyPath: "Id_user", autoIncrement: true });
            objectStore.createIndex("email_user", "email_user", { unique: true });
            objectStore.createIndex("username", "username", { unique: false });
            objectStore.createIndex("password_user", "password_user", { unique: false });
            console.log('Tabla creada.');
        };
    }
}

function createTable() {
    if (isDatabaseOpen) {
        isTableCreated = true;
        insertExampleUser();
    }
}

function insertExampleUser() {
    if (!isDatabaseOpen || !isTableCreated) {
        console.log('La base de datos o la tabla no están listas');
        return;
    }

    var transaction = global_database.transaction(["usuario"], "readwrite");
    transaction.oncomplete = function(event) {
        console.log('Transacción completada.');
    };

    transaction.onerror = function(event) {
        console.error('Error en la transacción', event);
    };

    var objectStore = transaction.objectStore("usuario");
    var request = objectStore.add({
        nombre_user: 'Juan Perez',
        email_user: 'juan@example.com',
        username: 'juan123',
        phone_user: '1234567890',
        password_user: 'password123'
    });

    request.onsuccess = function(event) {
        console.log('Usuario de ejemplo añadido con éxito');
    };

    request.onerror = function(event) {
        console.error('Error al añadir usuario de ejemplo', event.target.error);
    };
}

function loginUser(username, password) {
    if (!isDatabaseOpen || !isTableCreated) {
        console.log('La base de datos no está lista');
        alert('La base de datos no está lista. Por favor, inténtalo de nuevo en un momento.');
        return;
    }

    var transaction = global_database.transaction(["usuario"]);
    var objectStore = transaction.objectStore("usuario");
    var index = objectStore.index("username");

    var request = index.get(username);
    request.onsuccess = function(event) {
        var result = event.target.result;
        if (result && result.password_user === password) {
            console.log('Inicio de sesión exitoso');
            window.location.href = 'html/blank_page.html';
        } else {
            console.log('Credenciales incorrectas');
            alert('Correo electrónico o contraseña incorrectos');
        }
    };

    request.onerror = function(event) {
        console.error('Error al iniciar sesión', event);
    };
}

document.addEventListener('init', function(event) {
    var page = event.target;

    if (page.id === 'login-page') {
        if (page.querySelector('#login-button')) {
            page.querySelector('#login-button').onclick = function() {
                var username = document.querySelector('#username').value;
                var password = document.querySelector('#password').value;

                if (!username || username.trim() === '') {
                    alert('El nombre de usuario es obligatorio');
                    return;
                }

                if (!password || password.trim() === '') {
                    alert('La contraseña es obligatoria');
                    return;
                }

                loginUser(username, password);
            };
        }
    }
});

setInterval(function() {
    if (!isDatabaseOpen || !isTableCreated) {
        console.log('Esperando a que la base de datos esté lista...');
    } else {
        console.log('La base de datos está lista.');
    }
}, 1000);
