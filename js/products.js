// Productos disponibles
const products = [
    {
        id: 1,
        name: "Tomates Orgánicos",
        price: 4500,
        image: "https://images.unsplash.com/photo-1546470427-e9b3ba2e4c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Verduras",
        stock: 50
    },
    {
        id: 2,
        name: "Lechuga Fresca",
        price: 2500,
        image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Verduras",
        stock: 30
    },
    {
        id: 3,
        name: "Manzanas Rojas",
        price: 3800,
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Frutas",
        stock: 40
    },
    {
        id: 4,
        name: "Zanahorias",
        price: 2200,
        image: "https://images.unsplash.com/photo-1582515073490-39981397c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Verduras",
        stock: 60
    },
    {
        id: 5,
        name: "Papas Frescas",
        price: 3200,
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Verduras",
        stock: 45
    },
    {
        id: 6,
        name: "Naranjas Dulces",
        price: 2800,
        image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        category: "Frutas",
        stock: 35
    }
];

// Carrito de compras
let cart = JSON.parse(localStorage.getItem('huertohogar_cart')) || [];

// Función para mostrar productos destacados
function displayFeaturedProducts() {
    const productsGrid = document.getElementById('featuredProducts');
    if (!productsGrid) return;

    // Mostrar solo los primeros 6 productos
    const featuredProducts = products.slice(0, 6);

    productsGrid.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <button class="btn-secondary" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Función para agregar producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} agregado al carrito`, 'success');
}

// Función para guardar carrito en localStorage
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

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        ${message}
    `;

    // Agregar estilos básicos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
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

    // Animación de entrada
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para obtener productos por categoría
function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

// Función para buscar productos
function searchProducts(query) {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
    );
}

// Función para obtener producto por ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Función para obtener carrito
function getCart() {
    return cart;
}

// Función para vaciar carrito
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

// Función para remover item del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
}

// Función para actualizar cantidad en carrito
function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartCount();
        }
    }
}

// Función para calcular total del carrito
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
    updateCartCount();
});

// Exportar funciones para uso global
window.addToCart = addToCart;
window.getCart = getCart;
window.clearCart = clearCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.getCartTotal = getCartTotal;
window.getProductById = getProductById;
window.searchProducts = searchProducts;
window.getProductsByCategory = getProductsByCategory;
