// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Función para cargar los datos del producto desde la URL
function loadProductData() {
    const productName = getUrlParameter('name');
    const productPrice = getUrlParameter('price');
    const productStock = getUrlParameter('stock');
    const productImage = getUrlParameter('image');
    const productDescription = getUrlParameter('description');

    // Actualizar elementos del DOM con los datos del producto
    if (productName) {
        document.getElementById('productName').textContent = productName;
        document.title = productName + ' - HUERTO HOGAR';
    }

    if (productPrice) {
        document.getElementById('productPrice').textContent = '$' + productPrice;
    }

    if (productStock) {
        document.getElementById('productStock').textContent = 'Stock: ' + productStock + ' unidades';
    }

    if (productImage) {
        document.getElementById('productImage').src = productImage;
        document.getElementById('productImage').alt = productName;
    }

    if (productDescription) {
        document.getElementById('productDescription').textContent = productDescription;
    }
}

// Función para disminuir la cantidad
function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Función para aumentar la cantidad
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const currentValue = parseInt(quantityInput.value);
    const maxStock = parseInt(getUrlParameter('stock')) || 99;
    if (currentValue < maxStock) {
        quantityInput.value = currentValue + 1;
    }
}

// Función para agregar al carrito (corregida para usar la función unificada)
function addToCart() {
    const productName = getUrlParameter('name');
    const productPrice = getUrlParameter('price');
    const productImage = getUrlParameter('image');
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!productName || !productPrice) {
        alert('Error: No se pudo obtener la información del producto.');
        return;
    }

    // Usar la función unificada de script.js
    if (typeof addProductToCart === 'function') {
        addProductToCart(productName, parseInt(productPrice), quantity, productImage);
        
        // Mostrar confirmación
        alert(`¡${quantity} ${productName} agregado(s) al carrito!`);
    } else {
        // Fallback en caso de que script.js no esté cargado
        console.warn('addProductToCart no disponible, usando método alternativo');
        
        // Obtener carrito actual del localStorage
        let cart = JSON.parse(localStorage.getItem('huertohogar_cart') || '[]');

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex(item => item.name === productName);

        if (existingProductIndex > -1) {
            // Actualizar cantidad si ya existe
            cart[existingProductIndex].quantity += quantity;
        } else {
            // Agregar nuevo producto al carrito
            cart.push({
                name: productName,
                price: parseInt(productPrice),
                quantity: quantity,
                image: productImage
            });
        }

        // Guardar carrito actualizado
        localStorage.setItem('huertohogar_cart', JSON.stringify(cart));

        // Mostrar confirmación
        alert(`¡${quantity} ${productName} agregado(s) al carrito!`);

        // Actualizar contador del carrito si la función existe
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
    }
}

// Función para mostrar notificación personalizada (opcional)
function showProductNotification(message, type = 'success') {
    // Si existe la función de notificaciones global, usarla
    if (typeof showNotification === 'function') {
        showNotification(message, type);
        return;
    }

    // Crear notificación simple como fallback
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProductData();
    
    // Actualizar contador del carrito si la función existe
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});

// Exportar funciones para uso global
window.loadProductData = loadProductData;
window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;