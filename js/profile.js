// Variables globales para el perfil
let currentUser = null;
let isEditMode = false;

// Inicializar página de perfil
document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar en la página de perfil
    if (!window.location.pathname.includes('user-profile.html')) return;
    
    // Verificar si hay usuario logueado
    const userData = JSON.parse(localStorage.getItem('huertohogar_currentUser') || 'null');
    
    if (!userData) {
        // Si no hay usuario logueado, redirigir al login
        window.location.href = '../pages/login.html';
        return;
    }

    currentUser = userData;
    
    // Inicializar funcionalidades del perfil
    loadUserProfile();
    setupMenuNavigation();
    setupFormHandlers();
    
    // Generar datos de ejemplo después de un breve delay
    setTimeout(() => {
        generateSamplePurchases();
        loadPurchaseHistory();
        loadStatistics();
    }, 100);
});

// Cargar información del perfil
function loadUserProfile() {
    if (!currentUser) return;

    // Generar nombres a partir del nombre completo
    const nameParts = currentUser.name ? currentUser.name.split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Actualizar sidebar
    document.getElementById('userName').textContent = currentUser.name || 'Usuario';
    document.getElementById('userEmail').textContent = currentUser.email;
    
    // Generar avatar con iniciales
    const initials = currentUser.name ? 
        `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase() :
        currentUser.email.charAt(0).toUpperCase();
    document.getElementById('userAvatar').innerHTML = initials;

    // Actualizar información personal
    document.getElementById('displayName').textContent = currentUser.name || 'No especificado';
    document.getElementById('displayEmail').textContent = currentUser.email || 'No especificado';
    document.getElementById('displayPhone').textContent = currentUser.phoneNumber || 'No especificado';
    document.getElementById('displayAddress').textContent = currentUser.address || 'No especificado';
    // No tenemos campo newsletter en el backend todavía
    document.getElementById('displayNewsletter').textContent = 'No disponible';
    
    // Por ahora no tenemos fecha de creación en el backend
    const today = new Date();
    document.getElementById('displayMemberSince').textContent = today.toLocaleDateString('es-CL');

    // Cargar historial de compras
    loadPurchaseHistory();
    
    // Cargar estadísticas
    loadStatistics();
}

// Cargar historial de compras
function loadPurchaseHistory() {
    const purchasesList = document.getElementById('purchasesList');
    const emptyState = document.getElementById('emptyPurchases');

    if (!currentUser.purchases || currentUser.purchases.length === 0) {
        purchasesList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    
    const purchasesHTML = currentUser.purchases.map(purchase => {
        const statusClass = purchase.status === 'completed' ? 'status-completed' : 
                          purchase.status === 'pending' ? 'status-pending' : 'status-shipped';
        const statusText = purchase.status === 'completed' ? 'Completada' : 
                         purchase.status === 'pending' ? 'Pendiente' : 'Enviada';

        // Add reorder button with onclick handler
        return `
            <div class="purchase-card">
                <div class="purchase-header">
                    <div>
                        <div class="purchase-id">Pedido #${purchase.id}</div>
                        <div class="purchase-date">${new Date(purchase.date).toLocaleDateString('es-CL')}</div>
                    </div>
                    <span class="purchase-status ${statusClass}">${statusText}</span>
                </div>
                <div class="purchase-total">$${purchase.total.toLocaleString('es-CL')}</div>
                <button class="btn-primary reorder-btn" onclick="reorderPurchase('${purchase.id}')">
                    <i class="fas fa-redo"></i> Reordenar
                </button>
            </div>
        `;
    }).join('');

    purchasesList.innerHTML = purchasesHTML;
}

// Cargar estadísticas
function loadStatistics() {
    if (!currentUser.purchases || currentUser.purchases.length === 0) {
        return;
    }

    const totalPurchases = currentUser.purchases.length;
    const totalSpent = currentUser.purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const avgPurchase = Math.round(totalSpent / totalPurchases);
    
    // Calcular días como miembro
    const memberSince = new Date(currentUser.createdAt);
    const today = new Date();
    const memberDays = Math.floor((today - memberSince) / (1000 * 60 * 60 * 24));

    // Actualizar estadísticas
    document.getElementById('totalPurchases').textContent = totalPurchases;
    document.getElementById('totalSpent').textContent = `$${totalSpent.toLocaleString('es-CL')}`;
    document.getElementById('avgPurchase').textContent = `$${avgPurchase.toLocaleString('es-CL')}`;
    document.getElementById('memberDays').textContent = memberDays;

    // Producto favorito (simulado)
    const favoriteProducts = ['Tomates Cherry', 'Lechugas Orgánicas', 'Zanahorias', 'Brócoli', 'Espinacas'];
    const randomFavorite = favoriteProducts[Math.floor(Math.random() * favoriteProducts.length)];
    document.getElementById('favoriteProduct').textContent = randomFavorite;
}

// Configurar navegación del menú
function setupMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.profile-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los items
            menuItems.forEach(mi => mi.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Agregar clase active al item actual
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Función para reordenar una compra previa
function reorderPurchase(purchaseId) {
    const purchase = currentUser.purchases.find(p => p.id === purchaseId);
    if (!purchase) return;

    // Obtener el carrito actual o crear uno nuevo
    let cart = JSON.parse(localStorage.getItem('huertohogar_cart') || '[]');

    // Agregar cada ítem de la compra al carrito
    purchase.items.forEach(itemName => {
        // Buscar producto en la base de productos
        const product = products.find(p => p.name === itemName);
        if (!product) return;

        // Verificar si el producto ya está en el carrito
        const existingIndex = cart.findIndex(c => c.name === product.name);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
    });

    // Guardar carrito actualizado
    localStorage.setItem('huertohogar_cart', JSON.stringify(cart));

    // Actualizar contador del carrito si existe la función
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }

    // Mostrar notificación
    showNotification('Compra reordenada y agregada al carrito', 'success');
}

// Configurar manejadores de formularios
function setupFormHandlers() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Limpiar errores al escribir
    const editFields = ['editFirstName', 'editLastName', 'editEmail', 'editPhone', 'editAddress'];
    editFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', () => clearProfileError(fieldId));
        }
    });
}

// Función para cargar recomendaciones personalizadas
function loadPersonalizedRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    if (!recommendationsList) return;

    // Obtener productos comprados por el usuario
    const purchasedProductNames = new Set();
    if (currentUser.purchases) {
        currentUser.purchases.forEach(purchase => {
            purchase.items.forEach(item => purchasedProductNames.add(item));
        });
    }

    // Productos populares simulados
    const popularProducts = ['Tomates Cherry', 'Lechugas Orgánicas', 'Zanahorias', 'Brócoli', 'Espinacas'];

    // Recomendaciones basadas en productos comprados y populares
    const recommendedProducts = products.filter(product => 
        !purchasedProductNames.has(product.name) && popularProducts.includes(product.name)
    );

    if (recommendedProducts.length === 0) {
        recommendationsList.innerHTML = '<p>No hay recomendaciones disponibles en este momento.</p>';
        return;
    }

    // Crear HTML para recomendaciones
    const recommendationsHTML = recommendedProducts.map(product => `
        <div class="recommendation-card">
            <img src="${product.image}" alt="${product.name}" class="recommendation-image">
            <div class="recommendation-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toLocaleString()}</p>
                <button class="btn-primary" onclick="addProductToCart('${product.name}', ${product.price}, 1, '${product.image}')">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');

    recommendationsList.innerHTML = recommendationsHTML;
}

// Toggle modo edición
function toggleEditMode() {
    isEditMode = !isEditMode;
    
    const readOnlyView = document.getElementById('readOnlyView');
    const editView = document.getElementById('editView');
    const editBtn = document.getElementById('editBtn');

    if (isEditMode) {
        // Entrar en modo edición
        readOnlyView.style.display = 'none';
        editView.style.display = 'block';
        editBtn.style.display = 'none';

        // Llenar formulario con datos actuales
        document.getElementById('editFirstName').value = currentUser.firstName;
        document.getElementById('editLastName').value = currentUser.lastName;
        document.getElementById('editEmail').value = currentUser.email;
        document.getElementById('editPhone').value = currentUser.phone;
        document.getElementById('editAddress').value = currentUser.address;
        document.getElementById('editNewsletter').checked = currentUser.newsletter;
    } else {
        // Salir del modo edición
        readOnlyView.style.display = 'block';
        editView.style.display = 'none';
        editBtn.style.display = 'flex';
        clearAllProfileErrors();
    }
}

// Modificar loadUserProfile para cargar recomendaciones
const originalLoadUserProfile = loadUserProfile;
loadUserProfile = function() {
    originalLoadUserProfile();
    loadPersonalizedRecommendations();
};

// Cancelar edición
function cancelEdit() {
    toggleEditMode();
}

// Manejar actualización del perfil
function handleProfileUpdate(event) {
    event.preventDefault();
    clearAllProfileErrors();

    const firstName = document.getElementById('editFirstName').value.trim();
    const lastName = document.getElementById('editLastName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const address = document.getElementById('editAddress').value.trim();
    const newsletter = document.getElementById('editNewsletter').checked;

    let isValid = true;

    // Validaciones
    if (!firstName || firstName.length < 2) {
        showProfileError('editFirstName', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }

    if (!lastName || lastName.length < 2) {
        showProfileError('editLastName', 'El apellido debe tener al menos 2 caracteres');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showProfileError('editEmail', 'Ingresa un correo electrónico válido');
        isValid = false;
    }

    // Verificar si el email ya existe (excepto el actual)
    const users = JSON.parse(localStorage.getItem('huertohogar_users') || '[]');
    const emailExists = users.some(u => u.email === email && u.id !== currentUser.id);
    if (emailExists) {
        showProfileError('editEmail', 'Este correo ya está registrado');
        isValid = false;
    }

    if (!validatePhone(phone)) {
        showProfileError('editPhone', 'Ingresa un número de teléfono válido (+56 9 XXXX XXXX)');
        isValid = false;
    }

    if (!address || address.length < 10) {
        showProfileError('editAddress', 'Ingresa una dirección más específica');
        isValid = false;
    }

    if (!isValid) return;

    // Actualizar usuario
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.email = email;
    currentUser.phone = phone;
    currentUser.address = address;
    currentUser.newsletter = newsletter;

    // Actualizar en localStorage
    const allUsers = JSON.parse(localStorage.getItem('huertohogar_users') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = currentUser;
        localStorage.setItem('huertohogar_users', JSON.stringify(allUsers));
    }
    localStorage.setItem('huertohogar_currentUser', JSON.stringify(currentUser));

    // Mostrar mensaje de éxito
    const successAlert = document.getElementById('successAlert');
    successAlert.classList.add('show');

    // Salir del modo edición y recargar datos
    setTimeout(() => {
        toggleEditMode();
        loadUserProfile();
        successAlert.classList.remove('show');
    }, 2000);
}

// Mostrar errores específicos del perfil
function showProfileError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);

    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.style.borderColor = '#dc3545';
    }
}

// Limpiar error específico del perfil
function clearProfileError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);

    if (errorElement && inputElement) {
        errorElement.classList.remove('show');
        inputElement.style.borderColor = '#e0e0e0';
    }
}

// Limpiar todos los errores del perfil
function clearAllProfileErrors() {
    const errorMessages = document.querySelectorAll('#editView .error-message');
    const inputs = document.querySelectorAll('#editView input');

    errorMessages.forEach(error => error.classList.remove('show'));
    inputs.forEach(input => input.style.borderColor = '#e0e0e0');
}

// Función de logout específica para perfil
function logout() {
    localStorage.removeItem('huertohogar_currentUser');
    window.location.href = '../index.html';
}

// Generar datos de ejemplo para compras (solo si no existen)
function generateSamplePurchases() {
    if (!currentUser || (currentUser.purchases && currentUser.purchases.length > 0)) {
        return;
    }

    const samplePurchases = [
        {
            id: '2024001',
            date: '2024-08-15T10:30:00Z',
            total: 25900,
            status: 'completed',
            items: ['Tomates Cherry', 'Lechugas Orgánicas']
        },
        {
            id: '2024002',
            date: '2024-08-20T14:15:00Z',
            total: 18500,
            status: 'shipped',
            items: ['Zanahorias', 'Brócoli']
        },
        {
            id: '2024003',
            date: '2024-08-28T09:45:00Z',
            total: 32000,
            status: 'pending',
            items: ['Espinacas', 'Apio', 'Cilantro']
        }
    ];

    currentUser.purchases = samplePurchases;
    
    // Actualizar en localStorage
    const allUsers = JSON.parse(localStorage.getItem('huertohogar_users') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = currentUser;
        localStorage.setItem('huertohogar_users', JSON.stringify(allUsers));
    }
    localStorage.setItem('huertohogar_currentUser', JSON.stringify(currentUser));
}

// Funciones auxiliares (si no están definidas en auth.js)

// Función para validar email (definida en auth.js, pero por si acaso)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar teléfono chileno (definida en auth.js, pero por si acaso)
function validatePhone(phone) {
    const phoneRegex = /^(\+?56)?(\s?)(9)(\s?)([0-9]{4})(\s?)([0-9]{4})$/;
    return phoneRegex.test(phone);
}

// Función para actualizar la navbar con información del usuario
function updateProfileNavbar() {
    if (currentUser) {
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            const initials = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
            userIcon.innerHTML = initials;
            userIcon.style.fontSize = '0.9rem';
            userIcon.style.fontWeight = '600';
        }
    }
}

// Llamar a la función de actualización de navbar cuando se carga el perfil
setTimeout(updateProfileNavbar, 100);