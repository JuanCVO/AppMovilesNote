// Función para actualizar la lista de tareas en la interfaz de usuario
function updateTaskList(tasks) {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = ''; // Limpiar el contenedor de tareas

    tasks.forEach(function(task, index) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.index = index;

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';

        const taskName = document.createElement('h2');
        taskName.textContent = task.name;

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description.length > 100 ? task.description.substring(0, 100) + '...' : task.description;

        const taskLocation = document.createElement('p');
        taskLocation.textContent = `Ubicación: ${task.location}`; // Mostrar la geolocalización

        const editLocationButton = document.createElement('button');
        editLocationButton.textContent = 'Modificar nota';
        editLocationButton.addEventListener('click', function() {
            editTaskLocation(index);
        });

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskDescription);
        taskInfo.appendChild(taskLocation);
        taskInfo.appendChild(editLocationButton);

        taskCard.appendChild(taskInfo);
        taskContainer.appendChild(taskCard);
    });
}

// Función para manejar la edición de la ubicación de una tarea
function editTaskLocation(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks[index];

    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editTaskDescription').value = task.description;
    document.getElementById('editTaskStartDate').value = task.startDate;
    document.getElementById('editTaskEndDate').value = task.endDate;
    document.getElementById('editTaskLatitude').value = task.latitude;
    document.getElementById('editTaskLongitude').value = task.longitude;

    const modal = document.getElementById('taskModal');
    modal.style.display = 'block';

    // Obtener nueva geolocalización
    document.getElementById('getNewGeoLocation').addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                document.getElementById('editTaskLatitude').value = latitude;
                document.getElementById('editTaskLongitude').value = longitude;
            }, function(error) {
                alert('Error al obtener la geolocalización.');
            });
        } else {
            alert('Tu navegador no soporta geolocalización.');
        }
    });

    document.getElementById('editTaskForm').onsubmit = function(event) {
        event.preventDefault();

        task.name = document.getElementById('editTaskName').value;
        task.description = document.getElementById('editTaskDescription').value;
        task.startDate = document.getElementById('editTaskStartDate').value;
        task.endDate = document.getElementById('editTaskEndDate').value;
        task.latitude = document.getElementById('editTaskLatitude').value;
        task.longitude = document.getElementById('editTaskLongitude').value;

        localStorage.setItem('tasks', JSON.stringify(tasks));
        modal.style.display = 'none';

        alert('Cambios guardados exitosamente.');
        updateTaskList(tasks); // Actualizar la lista de tareas sin recargar la página
    };

    // Agregar evento al botón "Eliminar Tarea"
    document.getElementById('deleteTaskButton').onclick = function() {
        tasks.splice(index, 1); // Eliminar la tarea del arreglo
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Actualizar el almacenamiento local
        modal.style.display = 'none'; // Ocultar el modal
        alert('Tarea eliminada exitosamente.');
        updateTaskList(tasks); // Actualizar la lista de tareas sin recargar la página
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const taskContainer = document.getElementById('taskContainer');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    updateTaskList(tasks); // Inicializar la lista de tareas

    // Mostrar el nombre de usuario logueado
    const showUsernameButton = document.getElementById('showUsernameButton');
    showUsernameButton.addEventListener('click', function() {
        const username = localStorage.getItem('loggedInUser');
        if (username) {
            alert(`Usuario logueado: ${username}`);
        } else {
            alert('No hay usuario logueado.');
        }
    });

    // Cerrar sesión y redirigir a login.html
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        alert('Sesión cerrada.');
        window.location.href = 'index.html';
    });

    // Código para manejar el modal de edición
    const modal = document.getElementById('taskModal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Filtrar tareas por nombre al escribir en la barra de búsqueda
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', function() {
        const searchText = searchBar.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchText));
        updateTaskList(filteredTasks);
    });
});
