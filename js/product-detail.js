// Función para obtener parámetros de la URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Base de datos de productos para recomendaciones (sincronizada con products.js)
const PRODUCTS_DATABASE = [
    {
        name: 'Manzana Fuji',
        price: 1200,
        stock: 150,
        image: '../images/manzana-fuji.jpg',
        description: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.',
        category: 'Frutas',
        origin: 'Valle del Maule, Chile',
        sustainablePractices: 'Certificado orgánico, riego eficiente',
        suggestedRecipes: ['Ensalada de manzana', 'Tarta de manzana']
    },
    {
        name: 'Naranjas Valencia',
        price: 1000,
        stock: 200,
        image: '../images/naranja-valencia.jpg',
        description: 'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes.',
        category: 'Frutas',
        origin: 'Región de O\'Higgins, Chile',
        sustainablePractices: 'Agricultura sostenible, sin pesticidas',
        suggestedRecipes: ['Zumo de naranja', 'Ensalada cítrica']
    },
    {
        name: 'Plátanos Cavendish',
        price: 800,
        stock: 250,
        image: '../images/platano-cavendish.jpg',
        description: 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.',
        category: 'Frutas',
        origin: 'Costa Central, Chile',
        sustainablePractices: 'Cultivo orgánico',
        suggestedRecipes: ['Plátano con miel', 'Batido de plátano']
    },
    {
        name: 'Zanahorias Orgánicas',
        price: 900,
        stock: 100,
        image: '../images/zanahoria-organica.jpg',
        description: 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O\'Higgins.',
        category: 'Verduras',
        origin: 'Región Metropolitana, Chile',
        sustainablePractices: 'Orgánico certificado',
        suggestedRecipes: ['Zanahorias glaseadas', 'Sopa de zanahoria']
    },
    {
        name: 'Espinacas Frescas',
        price: 700,
        stock: 80,
        image: '../images/espinaca-fresca.jpg',
        description: 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes.',
        category: 'Verduras',
        origin: 'Valle Central, Chile',
        sustainablePractices: 'Cultivo hidropónico sostenible',
        suggestedRecipes: ['Ensalada de espinacas', 'Batido verde']
    },
    {
        name: 'Pimientos Tricolores',
        price: 1500,
        stock: 120,
        image: '../images/pimiento-tricolor.jpg',
        description: 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos.',
        category: 'Verduras',
        origin: 'Región del Maule, Chile',
        sustainablePractices: 'Agricultura integrada',
        suggestedRecipes: ['Pimientos rellenos', 'Ensalada de pimientos']
    },
    {
        name: 'Miel Organica',
        price: 5000,
        stock: 40,
        image: '../images/miel-organica.jpg',
        description: 'Miel pura y organica producida por apicultores locales.',
        category: 'Productos Organicos',
        origin: 'Región de Los Lagos, Chile',
        sustainablePractices: 'Apicultura orgánica',
        suggestedRecipes: ['Té con miel', 'Aderezo de miel']
    },
    {
        name: 'Quinoa Organica',
        price: 6000,
        stock: 40,
        image: '../images/quinoa-organica.jpg',
        description: 'Quinoa 100% orgánica, rica en proteínas, ideal para dietas saludables y libre de gluten. Cultivada sin pesticidas ni químicos.',
        category: 'Productos Organicos',
        origin: 'Altiplano chileno',
        sustainablePractices: 'Cultivo ancestral sostenible',
        suggestedRecipes: ['Quinoa con verduras', 'Ensalada de quinoa']
    },
    {
        name: 'Leche Entera',
        price: 1100,
        stock: 60,
        image: '../images/leche-entera.jpg',
        description: 'Leche entera pasteurizada de alta calidad, fuente natural de calcio y vitaminas. Perfecta para consumo diario.',
        category: 'Productos Lacteos',
        origin: 'Región de Los Lagos, Chile',
        sustainablePractices: 'Ganadería sostenible',
        suggestedRecipes: ['Café con leche', 'Cereal con leche']
    }
];

// Función para cargar los datos del producto desde la URL
function loadProductData() {
    const productName = getUrlParameter('name');
    const productPrice = getUrlParameter('price');
    const productStock = getUrlParameter('stock');
    const productImage = getUrlParameter('image');
    const productDescription = getUrlParameter('description');
    const productOrigin = getUrlParameter('origin');
    const productSustainablePractices = getUrlParameter('sustainablePractices');
    const productSuggestedRecipes = getUrlParameter('suggestedRecipes');

    // Lista de productos que se venden por KG
    const kgProducts = ['Manzana Fuji', 'Naranjas Valencia', 'Plátanos Cavendish', 'Zanahorias Orgánicas', 'Pimientos Tricolores'];

    // Actualizar elementos del DOM con los datos del producto
    if (productName) {
        document.getElementById('productName').textContent = productName;
        document.title = productName + ' - HUERTO HOGAR';
    }

    if (productPrice) {
        let priceText = '$' + productPrice;
        if (kgProducts.includes(productName)) {
            priceText += ' KG';
        }
        document.getElementById('productPrice').textContent = priceText;
    }

    if (productStock) {
        let stockText = 'Stock: ' + productStock;
        if (kgProducts.includes(productName)) {
            stockText += ' kilos';
        } else {
            stockText += ' unidades';
        }
        document.getElementById('productStock').textContent = stockText;
    }

    if (productImage) {
        const imageElement = document.getElementById('productImage');
        imageElement.src = productImage;
        imageElement.alt = productName;
        // Manejar error de imagen
        imageElement.onerror = function() {
            this.src = '../images/placeholder.jpg';
        };
    }

    if (productDescription) {
        document.getElementById('productDescription').textContent = productDescription;
    }

    if (productOrigin) {
        document.getElementById('productOrigin').textContent = productOrigin;
    }

    if (productSustainablePractices) {
        document.getElementById('productSustainablePractices').textContent = productSustainablePractices;
    }

    if (productSuggestedRecipes) {
        const recipes = productSuggestedRecipes.split('|');
        const recipesList = document.getElementById('productRecipes');
        recipesList.innerHTML = recipes.map(recipe => `<li>${recipe}</li>`).join('');
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

// Función para agregar al carrito (mejorada)
function addToCart() {
    const productName = getUrlParameter('name');
    const productPrice = getUrlParameter('price');
    const productImage = getUrlParameter('image');
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!productName || !productPrice) {
        showNotification('Error: No se pudo obtener la información del producto.', 'error');
        return;
    }

    try {
        // Usar la función unificada de script.js
        if (typeof addProductToCart === 'function') {
            addProductToCart(productName, parseInt(productPrice), quantity, productImage);
            showNotification(`¡${quantity} ${productName} agregado(s) al carrito!`, 'success');
        } else {
            // Fallback en caso de que script.js no esté cargado
            console.warn('addProductToCart no disponible, usando método alternativo');
            
            let cart = JSON.parse(localStorage.getItem('huertohogar_cart') || '[]');
            const existingProductIndex = cart.findIndex(item => item.name === productName);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += quantity;
            } else {
                cart.push({
                    name: productName,
                    price: parseInt(productPrice),
                    quantity: quantity,
                    image: productImage
                });
            }

            localStorage.setItem('huertohogar_cart', JSON.stringify(cart));
            showNotification(`¡${quantity} ${productName} agregado(s) al carrito!`, 'success');

            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        showNotification('Error al agregar el producto al carrito', 'error');
    }
}

// Función para obtener productos recomendados
function getRecommendedProducts(currentProductName, limit = 4) {
    const currentProduct = PRODUCTS_DATABASE.find(p => p.name === currentProductName);
    let recommendedProducts = [];

    if (currentProduct) {
        // Priorizar productos de la misma categoría
        const sameCategory = PRODUCTS_DATABASE.filter(p => 
            p.name !== currentProductName && p.category === currentProduct.category
        );
        
        // Agregar productos de otras categorías si no hay suficientes
        const otherCategory = PRODUCTS_DATABASE.filter(p => 
            p.name !== currentProductName && p.category !== currentProduct.category
        );

        recommendedProducts = [...sameCategory, ...otherCategory];
    } else {
        // Si no se encuentra el producto actual, mostrar productos aleatorios
        recommendedProducts = PRODUCTS_DATABASE.filter(p => p.name !== currentProductName);
    }

    // Mezclar y limitar
    return recommendedProducts.sort(() => 0.5 - Math.random()).slice(0, limit);
}

// Función para crear HTML de producto recomendado
function createRecommendedProductHTML(product) {
    const kgProducts = ['Manzana Fuji', 'Naranjas Valencia', 'Plátanos Cavendish', 'Zanahorias Orgánicas', 'Pimientos Tricolores'];
    const priceText = kgProducts.includes(product.name) ? `$${product.price} KG` : `$${product.price}`;
    const stockText = kgProducts.includes(product.name) ? `${product.stock} kilos` : `${product.stock} unidades`;
    
    return `
        <div class="product-card recommended-product">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/placeholder.jpg'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${priceText}</p>
                <p class="product-stock">Stock: ${stockText}</p>
                <div class="product-actions">
                    <a href="product-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&stock=${product.stock}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description)}&origin=${encodeURIComponent(product.origin)}&sustainablePractices=${encodeURIComponent(product.sustainablePractices)}&suggestedRecipes=${encodeURIComponent(product.suggestedRecipes.join('|'))}" class="btn-secondary">
                        Ver Detalles
                    </a>
                    <button class="btn-primary" onclick="addRecommendedToCart('${product.name}', ${product.price}, '${product.image}')">
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para cargar productos recomendados
function loadRecommendedProducts() {
    const currentProductName = getUrlParameter('name');
    const recommendedProducts = getRecommendedProducts(currentProductName, 4);
    const grid = document.getElementById('recommendedProductsGrid');
    
    if (!grid) return; // Si no existe el grid, salir
    
    if (recommendedProducts.length > 0) {
        grid.innerHTML = recommendedProducts.map(product => createRecommendedProductHTML(product)).join('');
        
        // Mostrar la sección
        const section = document.querySelector('.recommended-products-section');
        if (section) {
            section.style.display = 'block';
        }
    } else {
        // Si no hay productos recomendados, ocultar la sección
        const section = document.querySelector('.recommended-products-section');
        if (section) {
            section.style.display = 'none';
        }
    }
}

// Función para agregar producto recomendado al carrito
function addRecommendedToCart(productName, price, image) {
    try {
        if (typeof addProductToCart === 'function') {
            addProductToCart(productName, price, 1, image);
            showNotification(`¡${productName} agregado al carrito!`, 'success');
        } else {
            // Fallback
            let cart = JSON.parse(localStorage.getItem('huertohogar_cart') || '[]');
            const existingProductIndex = cart.findIndex(item => item.name === productName);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: price,
                    quantity: 1,
                    image: image
                });
            }

            localStorage.setItem('huertohogar_cart', JSON.stringify(cart));
            showNotification(`¡${productName} agregado al carrito!`, 'success');

            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        }
    } catch (error) {
        console.error('Error al agregar producto recomendado:', error);
        showNotification('Error al agregar el producto al carrito', 'error');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    const icon = type === 'success' ? '✓' : '⚠';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;

    // Agregar icono
    const iconSpan = document.createElement('span');
    iconSpan.textContent = icon;
    iconSpan.style.fontSize = '1.2rem';
    notification.insertBefore(iconSpan, notification.firstChild);

    // Agregar animación CSS si no existe
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

// Validar cantidad ingresada
function validateQuantity() {
    const quantityInput = document.getElementById('quantity');
    const maxStock = parseInt(getUrlParameter('stock')) || 99;
    let value = parseInt(quantityInput.value);

    if (isNaN(value) || value < 1) {
        quantityInput.value = 1;
    } else if (value > maxStock) {
        quantityInput.value = maxStock;
        showNotification(`Cantidad máxima disponible: ${maxStock}`, 'error');
    }
}

// Función para manejar el botón "Volver atrás"
function goBack() {
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        window.history.back();
    } else {
        window.location.href = '../pages/productos.html';
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Cargar datos del producto principal
        loadProductData();
        
        // Cargar productos recomendados
        loadRecommendedProducts();
        
        // Actualizar contador del carrito
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        
        // Configurar validación de cantidad
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', validateQuantity);
            quantityInput.addEventListener('blur', validateQuantity);
        }

        // Agregar botón de volver si no existe
        addBackButton();
        
    } catch (error) {
        console.error('Error al inicializar la página de detalle del producto:', error);
        showNotification('Error al cargar los datos del producto', 'error');
    }
});

// Función para agregar botón de volver
function addBackButton() {
    const productInfo = document.querySelector('.product-info-detail');
    if (productInfo && !document.querySelector('.back-button')) {
        const backButton = document.createElement('button');
        backButton.className = 'back-button btn-secondary';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Volver';
        backButton.onclick = goBack;
        backButton.style.marginBottom = '1rem';
        
        productInfo.insertBefore(backButton, productInfo.firstChild);
    }
}

// Función para detectar productos similares basado en categoría
function getSimilarProducts(currentProductName, currentCategory, limit = 2) {
    return PRODUCTS_DATABASE.filter(product => 
        product.name !== currentProductName && 
        product.category === currentCategory
    ).slice(0, limit);
}

// Función mejorada para obtener recomendaciones inteligentes
function getSmartRecommendations(currentProductName, limit = 4) {
    const currentProduct = PRODUCTS_DATABASE.find(p => p.name === currentProductName);
    
    if (!currentProduct) {
        return getRecommendedProducts(currentProductName, limit);
    }

    let recommendations = [];
    
    // 1. Productos de la misma categoría (50% del espacio)
    const sameCategory = getSimilarProducts(currentProductName, currentProduct.category, Math.ceil(limit / 2));
    recommendations.push(...sameCategory);
    
    // 2. Productos complementarios basados en precio similar (25% del espacio)
    const similarPrice = PRODUCTS_DATABASE.filter(p => 
        p.name !== currentProductName &&
        p.category !== currentProduct.category &&
        Math.abs(p.price - currentProduct.price) < currentProduct.price * 0.3
    ).slice(0, Math.ceil(limit / 4));
    recommendations.push(...similarPrice);
    
    // 3. Completar con productos populares (resto del espacio)
    const remaining = limit - recommendations.length;
    if (remaining > 0) {
        const popular = PRODUCTS_DATABASE.filter(p => 
            p.name !== currentProductName &&
            !recommendations.some(r => r.name === p.name)
        ).slice(0, remaining);
        recommendations.push(...popular);
    }
    
    return recommendations.slice(0, limit);
}

// Función para crear breadcrumb navigation
function createBreadcrumb() {
    const breadcrumbContainer = document.querySelector('.product-detail-section .container');
    if (breadcrumbContainer && !document.querySelector('.breadcrumb')) {
        const productName = getUrlParameter('name');
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb';
        breadcrumb.innerHTML = `
            <a href="../index.html">Inicio</a>
            <span class="separator">></span>
            <a href="productos.html">Productos</a>
            <span class="separator">></span>
            <span class="current">${productName || 'Producto'}</span>
        `;
        
        breadcrumb.style.cssText = `
            margin-bottom: 2rem;
            font-size: 0.9rem;
            color: var(--text-secondary);
        `;
        
        breadcrumbContainer.insertBefore(breadcrumb, breadcrumbContainer.firstChild);
    }
}

// Función para lazy loading de imágenes
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Función para compartir producto en redes sociales
function shareProduct(platform) {
    const productName = getUrlParameter('name');
    const productPrice = getUrlParameter('price');
    const currentURL = window.location.href;
    const shareText = `¡Mira este producto en Huerto Hogar: ${productName} - ${productPrice}!`;
    
    let shareURL = '';
    
    switch (platform) {
        case 'facebook':
            shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`;
            break;
        case 'twitter':
            shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentURL)}`;
            break;
        case 'whatsapp':
            shareURL = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentURL)}`;
            break;
        case 'copy':
            if (navigator.clipboard) {
                navigator.clipboard.writeText(currentURL).then(() => {
                    showNotification('¡Enlace copiado al portapapeles!', 'success');
                });
            }
            return;
    }
    
    if (shareURL) {
        window.open(shareURL, '_blank', 'width=600,height=400');
    }
}

// Exportar funciones para uso global
window.loadProductData = loadProductData;
window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addRecommendedToCart = addRecommendedToCart;
window.goBack = goBack;
window.shareProduct = shareProduct;

// Reviews and Ratings Feature

// Key for storing reviews in localStorage
const REVIEWS_STORAGE_KEY = 'huertohogar_product_reviews';

// Load reviews for a product from localStorage
function loadReviews(productName) {
    const allReviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '{}');
    return allReviews[productName] || [];
}

// Save reviews for a product to localStorage
function saveReviews(productName, reviews) {
    const allReviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '{}');
    allReviews[productName] = reviews;
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews));
}

// Calculate average rating from reviews
function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / reviews.length;
}

// Display average rating stars
function displayAverageRating(average) {
    const averageRatingDiv = document.getElementById('averageRating');
    averageRatingDiv.innerHTML = '';
    if (average === 0) {
        averageRatingDiv.textContent = 'No hay calificaciones aún.';
        return;
    }
    const fullStars = Math.floor(average);
    const halfStar = average - fullStars >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '&#9733;'; // full star
    }
    if (halfStar) {
        starsHTML += '&#9734;'; // half star (using empty star as approximation)
    }
    averageRatingDiv.innerHTML = `Calificación promedio: <span class="stars">${starsHTML}</span> (${average.toFixed(1)})`;
}

// Display list of reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<li>No hay reseñas aún.</li>';
        return;
    }
    reviews.forEach(review => {
        const li = document.createElement('li');
        li.className = 'review-item';
        const stars = '&#9733;'.repeat(review.rating) + '&#9734;'.repeat(5 - review.rating);
        li.innerHTML = `
            <div class="review-rating">${stars}</div>
            <div class="review-text">${escapeHtml(review.text)}</div>
        `;
        reviewsList.appendChild(li);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle review form submission
function handleReviewFormSubmit(event) {
    event.preventDefault();
    const productName = getUrlParameter('name');
    if (!productName) {
        alert('No se pudo identificar el producto para la reseña.');
        return;
    }
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('reviewText').value.trim();

    if (!ratingInput) {
        alert('Por favor, seleccione una calificación.');
        return;
    }
    if (reviewText.length === 0) {
        alert('Por favor, escriba una reseña.');
        return;
    }

    const rating = parseInt(ratingInput.value);
    const reviews = loadReviews(productName);
    reviews.push({ rating, text: reviewText });
    saveReviews(productName, reviews);

    displayReviews(reviews);
    displayAverageRating(calculateAverageRating(reviews));

    // Reset form
    event.target.reset();
    alert('Gracias por su reseña.');
}

// Initialize reviews section on page load
function initReviews() {
    const productName = getUrlParameter('name');
    if (!productName) return;

    const reviews = loadReviews(productName);
    displayReviews(reviews);
    displayAverageRating(calculateAverageRating(reviews));

    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewFormSubmit);
    }
}

// Initialize reviews when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    initReviews();
});
