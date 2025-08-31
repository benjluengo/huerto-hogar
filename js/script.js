// Función para mostrar/ocultar el menú de usuario
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Cerrar el menú si se hace clic fuera de él
document.addEventListener('click', function (event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');

    if (!userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Prevenir que el menú se cierre cuando se hace clic dentro de él
document.addEventListener('DOMContentLoaded', function () {
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }

    // Verificar estado del usuario y actualizar navbar
    updateNavbarForUser();
});

// Actualizar la navbar según el estado del usuario
function updateNavbarForUser() {
    const currentUser = JSON.parse(localStorage.getItem('huertohogar_currentUser') || 'null');
    const userDropdown = document.getElementById('userDropdown');

    if (!userDropdown) return;

    if (currentUser) {
        // Usuario logueado - mostrar opciones de usuario autenticado
        const userInitials = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();

        // Actualizar el icono del usuario con sus iniciales
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            userIcon.innerHTML = userInitials;
            userIcon.style.fontSize = '0.9rem';
            userIcon.style.fontWeight = '600';
        }

        // Actualizar las opciones del dropdown
        userDropdown.innerHTML = `
            <a href="pages/user-profile.html" class="dropdown-item">
                <i class="fas fa-user"></i> Mi Perfil
            </a>
            <a href="#" class="dropdown-item" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </a>
        `;
    } else {
        // Usuario no logueado - mostrar opciones de login/registro
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            userIcon.innerHTML = '<i class="fa-solid fa-user"></i>';
            userIcon.style.fontSize = '1.2rem';
            userIcon.style.fontWeight = 'normal';
        }

        userDropdown.innerHTML = `
            <a href="pages/login.html" class="dropdown-item">
                <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
            </a>
            <a href="pages/register.html" class="dropdown-item">
                <i class="fas fa-user-plus"></i> Registrarse
            </a>
        `;
    }
}

// Función de logout global
function logout() {
    localStorage.removeItem('huertohogar_currentUser');

    // Si estamos en una página que requiere autenticación, redirigir
    if (window.location.pathname.includes('user-profile.html')) {
        window.location.href = '../index.html';
    } else {
        // Solo actualizar la navbar
        updateNavbarForUser();
    }
}

// Funcionalidad adicional: smooth scroll para futuras secciones
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Función para redireccionar rutas relativas según la ubicación
function getCorrectPath(path) {
    // Si estamos en una subcarpeta (pages/), agregar ../ al inicio
    if (window.location.pathname.includes('/pages/')) {
        return path.startsWith('../') ? path : '../' + path;
    }
    // Si estamos en la raíz, remover ../ si existe
    return path.replace('../', '');
}