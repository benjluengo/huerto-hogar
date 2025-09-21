// Carrito de compras
let cart = JSON.parse(localStorage.getItem('huertohogar_cart')) || [];

// Función para mostrar los items del carrito
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCartContainer = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartContainer.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }

    emptyCartContainer.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-subtotal">
                <p>$${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <div class="cart-item-remove">
                <button class="remove-btn" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    updateCartTotal();
}

// Función para actualizar cantidad
function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeItem(index);
        return;
    }

    cart[index].quantity = parseInt(newQuantity);
    saveCart();
    displayCartItems();
    updateCartCount();
}

// Función para remover item
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    displayCartItems();
    updateCartCount();
    showNotification('Producto removido del carrito', 'success');
}

// Función para actualizar total del carrito
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toLocaleString();
}

// Función para guardar carrito
function saveCart() {
    localStorage.setItem('huertohogar_cart', JSON.stringify(cart));
}

// Función para actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function processCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    // Get delivery date value
    const deliveryDateInput = document.getElementById('deliveryDate');
    const deliveryDate = deliveryDateInput ? deliveryDateInput.value : null;

    if (!deliveryDate) {
        showNotification('Por favor, selecciona una fecha de entrega preferida.', 'error');
        return;
    }

    // Validate delivery date is today or later
    const today = new Date();
    const selectedDate = new Date(deliveryDate);
    today.setHours(0,0,0,0);
    selectedDate.setHours(0,0,0,0);
    if (selectedDate < today) {
        showNotification('La fecha de entrega no puede ser anterior a hoy.', 'error');
        return;
    }

    // Create order object
    const order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        deliveryDate: deliveryDate,
        status: 'pending',
        items: cart.map(item => item.name),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    // Save order to currentUser purchases
    let currentUser = JSON.parse(localStorage.getItem('huertohogar_currentUser') || 'null');
    if (!currentUser) {
        showNotification('Debes iniciar sesión para realizar la compra.', 'error');
        return;
    }

    if (!currentUser.purchases) {
        currentUser.purchases = [];
    }
    currentUser.purchases.push(order);

    // Update localStorage
    const allUsers = JSON.parse(localStorage.getItem('huertohogar_users') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = currentUser;
        localStorage.setItem('huertohogar_users', JSON.stringify(allUsers));
    }
    localStorage.setItem('huertohogar_currentUser', JSON.stringify(currentUser));

    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();

    // Redirect to purchase success page with order id in query string
    window.location.href = `purchase-success.html?orderId=${order.id}`;
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    updateCartCount();

    // Agregar event listener al botón de compra
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processCheckout);
    }
});

// Exportar funciones para uso global
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
