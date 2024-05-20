var global_database;
var isDatabaseOpen = false;
var isTableCreated = false;
var userList = [];

document.addEventListener('pause', onPause, false);

function onPause() {
    if (isDatabaseOpen) {
        closeDatabase();
    }
}
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady(){
    console.log('Running Cordova'+ cordova.platformId + 'version' + cordova.version);
    global_database = window.sqlitePlugin.openDatabase(
        {
            name: 'my.db',
            location: 'default',
            androidDatabaseProvider: 'system',
            androidLockWorkaround:1
        },
        function(db){
            console.log('Base de datos abierta', db);
            isDatabaseOpen = true;
            createTable();
        },
        function(error){
            console.log('Error al abrir la base de datos', error);
        }
    );
}

function createTable() {
    global_database.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS usuario (Id_user INTEGER PRIMARY KEY, nombre_user TEXT, email_user TEXT NOT NULL UNIQUE, username TEXT, phone_user TEXT, password_user TEXT)', [],
        function(tx, result){
            console.log('Tabla usuario creada', result);
            isTableCreated = true;
        },
        function(tx, error){
            console.log('Error al crear la tabla usuario', error);
        });
    });
}

function createUser(nombre, email, username, phone, password) {
    global_database.transaction(function(tx){
        tx.executeSql('SELECT COUNT(*) AS count FROM usuario WHERE email_user = ?', [email], function(tx, res) {
            if (res.rows.item(0).count === 0) {
                // El usuario no existe, inserta los datos
                tx.executeSql('INSERT INTO usuario (nombre_user, email_user, username, phone_user, password_user) VALUES (?, ?, ?, ?, ?)', [nombre, email, username, phone, password],
                function(tx, results) {
                    selectData();
                },
                function(tx, error) {
                    console.error('Error al insertar datos:', error);
                    alert('Error al insertar datos'+ error.message);
                });
            } else {
                // El usuario ya existe, no insertes nada
                console.log('El usuario ya existe');
                alert('El usuario ya existe');
            }
        }, function(tx, error){
            console.log('Error al realizar la consulta', error);
            alert('Error al realizar la consulta'+ error.message);
        });
    });
}
function register() {
    // Asegúrate de que la ruta al archivo de registro es correcta
    window.location.href = 'user_create.html';
}

document.addEventListener('init', function(event) {
    var page = event.target;
    var usermail='';

        if (page.querySelector('#register-button')) {
            page.querySelector('#register-button').onclick = function() {
                redirectToUserCreate();
            };

        if (event.target.querySelector('#guardar-button')) {
            event.target.querySelector('#guardar-button').onclick = function() {
                var nombre = document.querySelector('#nombre_usu').value;
                var email = document.querySelector('#email_usu').value;
                var username = document.querySelector('#username_usu').value;
                var password = document.querySelector('#password_usu').value;
                var cellphone = document.querySelector('#cellphone_usu').value;

                // Asegúrate de que el correo electrónico no es nulo o vacío
                if (email && email.trim() !== '') {
                    createUser(nombre, email, username, cellphone, password);
                } else {
                    console.error('El correo electrónico es obligatorio');
                    alert('El correo electrónico es obligatorio');
                }

                document.getElementById('guardando-dialog').show();

                setTimeout(function() {
                    document.getElementById('guardando-dialog').hide();
                }, 2000);
            };
        }
    }
});