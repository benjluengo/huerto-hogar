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

async function processCheckout() {
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

    // Verificar autenticación
    if (!isAuthenticated()) {
        showNotification('Debes iniciar sesión para realizar la compra.', 'error');
        setTimeout(() => {
            redirectToLogin();
        }, 2000);
        return;
    }

    let orderResponse = null;

    try {
        // Obtener el token de autenticación
        const token = getAuthToken();
        if (!token) {
            showNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error');
            setTimeout(() => {
                redirectToLogin();
            }, 2000);
            return;
        }

        // Crear el objeto de la orden para el backend
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderData = {
            deliveryDate: deliveryDate + 'T12:00:00', // Agregar hora por defecto
            orderItems: cart.map(item => ({
                product: {
                    id: item.id
                },
                quantity: item.quantity,
                price: item.price
            })),
            status: "PENDING",
            totalAmount: totalAmount
        };

        // Enviar la orden al backend
        const response = await fetch(API_URLS.ORDERS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.message || 'Error al crear la orden');
            } catch (parseError) {
                throw new Error(`Error del servidor: ${errorText}`);
            }
        }

        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!responseText.trim()) {
            throw new Error('El servidor no devolvió datos de la orden');
        }

        orderResponse = JSON.parse(responseText);
        console.log('Orden creada:', orderResponse);

        // Limpiar el carrito después de una orden exitosa
        cart = [];
        saveCart();
        updateCartCount();

        // Mostrar notificación de éxito
        showNotification('¡Compra realizada con éxito!', 'success');

        // Redirigir a la página de éxito con el ID de la orden
        window.location.href = `purchase-success.html?orderId=${orderResponse.id}`;

    } catch (error) {
        console.error('Error en el checkout:', error);
        showNotification('Hubo un error al procesar tu orden. Por favor, intenta de nuevo.', 'error');
    }
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
