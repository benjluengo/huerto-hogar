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
        let priceText = '$' + productPrice;
        // Agregar "KG" para productos específicos
        const keywords = ['Manzana', 'Zanahoria', 'Plátano', 'Pimiento', 'Naranja'];
        if (keywords.some(keyword => productName.includes(keyword))) {
            priceText += ' KG';
        }
        document.getElementById('productPrice').textContent = priceText;
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

    // Buscar el producto en la lista de productos para obtener el ID correcto
    // Nota: Esto asume que js/products.js está cargado en la página
    const product = window.products ? window.products.find(p => p.name === productName) : null;
    const productId = product ? product.id : Date.now(); // Usar timestamp como fallback si no se encuentra

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        // Actualizar cantidad si ya existe
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Agregar nuevo producto al carrito
        cart.push({
            id: productId,
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

// Función para cargar productos recomendados
function loadRecommendedProducts() {
    const currentProductName = getUrlParameter('name');
    const recommendedProductsContainer = document.getElementById('recommendedProducts');

    if (!recommendedProductsContainer || !window.products) return;

    // Filtrar productos recomendados (excluir el producto actual y limitar a 4)
    const recommendedProducts = window.products
        .filter(product => product.name !== currentProductName)
        .slice(0, 4);

    // Generar HTML para productos recomendados
    const recommendedHTML = recommendedProducts.map(product => {
        let priceText = '$' + product.price.toLocaleString();
        const keywords = ['Manzana', 'Zanahoria', 'Plátano', 'Pimiento', 'Naranja'];
        if (keywords.some(keyword => product.name.includes(keyword))) {
            priceText += ' KG';
        }
        return `
        <a href="product-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&stock=${product.stock}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.name + ' - Producto fresco y de calidad.')}" class="recommended-product-card">
            <img src="${product.image}" alt="${product.name}" class="recommended-product-image">
            <div class="recommended-product-info">
                <h4>${product.name}</h4>
                <p>${priceText}</p>
            </div>
        </a>
    `}).join('');

    recommendedProductsContainer.innerHTML = recommendedHTML;
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProductData();
    loadRecommendedProducts();
    updateCartCount();
});
