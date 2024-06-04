document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskStartDate = document.getElementById('taskStartDate').value;
    const taskEndDate = document.getElementById('taskEndDate').value;
    const taskLocation = document.getElementById('taskLocation').value;

    const task = {
        name: taskName,
        description: taskDescription,
        startDate: taskStartDate,
        endDate: taskEndDate,
        location: taskLocation /
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('taskForm').reset();
    alert('Tarea añadida exitosamente.');


    window.location.href = 'principal.html';
});

document.getElementById('getGeoLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const location = `Latitud: ${latitude}, Longitud: ${longitude}`;
            document.getElementById('taskLocation').value = location;
            document.getElementById('geoLocationDisplay').textContent = location;
        }, function(error) {
            alert('Error al obtener la geolocalización.');
        });
    } else {
        alert('Tu navegador no soporta geolocalización.');
    }
});



