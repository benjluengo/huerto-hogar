// Función para mostrar/ocultar el menú de usuario
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Cerrar el menú si se hace clic fuera de él
document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (!userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Prevenir que el menú se cierre cuando se hace clic dentro de él
document.querySelector('.user-dropdown').addEventListener('click', function(event) {
    event.stopPropagation();
});

// Funcionalidad adicional: smooth scroll para futuras secciones
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}
