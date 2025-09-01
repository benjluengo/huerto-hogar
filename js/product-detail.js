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

// Función para agregar al carrito
function addToCart() {
    const productName = getUrlParameter('name');
    const productPrice = parseInt(getUrlParameter('price'));
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!productName || !productPrice) {
        alert('Error: No se pudo obtener la información del producto.');
        return;
    }

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
            price: productPrice,
            quantity: quantity,
            image: getUrlParameter('image')
        });
    }

    // Guardar carrito actualizado
    localStorage.setItem('huertohogar_cart', JSON.stringify(cart));

    // Mostrar confirmación
    alert(`¡${quantity} ${productName} agregado(s) al carrito!`);

    // Actualizar contador del carrito en la navbar si existe
    updateCartCount();
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

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProductData();
    updateCartCount();
});
