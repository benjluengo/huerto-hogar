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
            <a href="${getCorrectPath('pages/login.html')}" class="dropdown-item">
                <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
            </a>
            <a href="${getCorrectPath('pages/register.html')}" class="dropdown-item">
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

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('huertohogar_cart') || '[]');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Buscar elemento del contador del carrito
    let cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Función para obtener el carrito actual
function getCart() {
    return JSON.parse(localStorage.getItem('huertohogar_cart') || '[]');
}

// Función para guardar el carrito
function saveCart(cart) {
    localStorage.setItem('huertohogar_cart', JSON.stringify(cart));
    updateCartCount();
}

// Función para agregar producto al carrito (desde cualquier página)
function addProductToCart(productName, price, quantity = 1, image = '') {
    let cart = getCart();

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (existingProductIndex > -1) {
        // Actualizar cantidad si ya existe
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Agregar nuevo producto al carrito
        cart.push({
            name: productName,
            price: parseInt(price),
            quantity: quantity,
            image: image
        });
    }

    saveCart(cart);
    return cart;
}

// Función para remover producto del carrito
function removeFromCart(productName) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== productName);
    saveCart(cart);
    return cart;
}

// Función para actualizar cantidad de producto en el carrito
function updateCartItemQuantity(productName, newQuantity) {
    let cart = getCart();
    const productIndex = cart.findIndex(item => item.name === productName);

    if (productIndex > -1) {
        if (newQuantity <= 0) {
            cart.splice(productIndex, 1);
        } else {
            cart[productIndex].quantity = newQuantity;
        }
        saveCart(cart);
    }
    return cart;
}

// Función para vaciar el carrito
function clearCart() {
    localStorage.removeItem('huertohogar_cart');
    updateCartCount();
}

// Inicializar contador del carrito cuando se carga cualquier página
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
});
