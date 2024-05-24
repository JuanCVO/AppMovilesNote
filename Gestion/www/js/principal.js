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

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskDescription);

        taskCard.appendChild(taskInfo);
        taskContainer.appendChild(taskCard);
    });

    // Refrescar la página de manera dinámica
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    const taskContainer = document.getElementById('taskContainer');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

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

        taskInfo.appendChild(taskName);
        taskInfo.appendChild(taskDescription);

        taskCard.appendChild(taskInfo);
        taskContainer.appendChild(taskCard);
    });

    // Código para manejar el modal de edición
    const modal = document.getElementById('taskModal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Rellenar y mostrar el modal de edición cuando se hace clic en una tarea
    document.getElementById('taskContainer').addEventListener('click', function(event) {
        const taskCard = event.target.closest('.task-card');
        if (taskCard) {
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            const task = tasks[taskCard.dataset.index];

            document.getElementById('editTaskName').value = task.name;
            document.getElementById('editTaskDescription').value = task.description;
            document.getElementById('editTaskStartDate').value = task.startDate;
            document.getElementById('editTaskEndDate').value = task.endDate;

            modal.style.display = 'block';

            document.getElementById('editTaskForm').onsubmit = function(event) {
                event.preventDefault();

                task.name = document.getElementById('editTaskName').value;
                task.description = document.getElementById('editTaskDescription').value;
                task.startDate = document.getElementById('editTaskStartDate').value;
                task.endDate = document.getElementById('editTaskEndDate').value;

                localStorage.setItem('tasks', JSON.stringify(tasks));
                modal.style.display = 'none';

                alert('Cambios guardados exitosamente.');
                updateTaskList(tasks); // Actualizar la lista de tareas sin recargar la página
            };

            // Agregar evento al botón "Eliminar Tarea"
            document.getElementById('deleteTaskButton').onclick = function() {
                tasks.splice(taskCard.dataset.index, 1); // Eliminar la tarea del arreglo
                localStorage.setItem('tasks', JSON.stringify(tasks)); // Actualizar el almacenamiento local
                modal.style.display = 'none'; // Ocultar el modal
                alert('Tarea eliminada exitosamente.');
                updateTaskList(tasks); // Actualizar la lista de tareas sin recargar la página
            };

        }
    });
});

