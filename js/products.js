// Estado global de la aplicación
let products = [];
let filteredProducts = [];

// Inicializar la página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initializeFilters();
    updateCartCount();
});

// Función para cargar productos desde el backend y actualizar la UI
async function loadProducts() {
    try {
        const response = await fetch(API_URLS.PRODUCTS, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        products = await response.json();
        filteredProducts = [...products];
        
        console.log('Productos cargados:', products);
        
        if (window.location.pathname.includes('productos.html')) {
            displayAllProducts();
            updateResultsCount();
        } else {
            displayFeaturedProducts();
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        showErrorMessage();
    }
}

function showErrorMessage() {
    const container = document.querySelector('.products-container') || 
                     document.querySelector('.featured-products') || 
                     document.getElementById('productsGrid');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>Error al cargar los productos</h3>
                <p>Por favor, intenta recargar la página</p>
                <button onclick="loadProducts()" class="btn-primary">
                    <i class="fas fa-sync"></i> Reintentar
                </button>
            </div>
        `;
    }
}

// Función para mostrar productos destacados en la página principal
function displayFeaturedProducts() {
    const productsGrid = document.getElementById('featuredProducts');
    if (!productsGrid) return;

    const featuredProducts = products.slice(0, 6);

    productsGrid.innerHTML = featuredProducts.map(product => {
        const category = formatCategory(product.category);
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toLocaleString()}</p>
                    <p class="product-category">${category}</p>
                    <button class="btn-secondary" onclick="addToCartFromProducts(${product.id});" ${product.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> 
                        ${product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Función para mostrar todos los productos en la página productos.html
function displayAllProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    if (!filteredProducts.length) {
        showNoResults();
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => {
        const category = formatCategory(product.category);

        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toLocaleString()}</p>
                    <p class="product-stock">${product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}</p>
                    <p class="product-category">${category}</p>
                    <button class="btn-secondary" onclick="addToCartFromProducts(${product.id});" ${product.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> 
                        ${product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    updateResultsCount();
}

function formatCategory(category) {
    const categoryMap = {
        'Frutas': 'Frutas',
        'Verduras': 'Verduras',
        'Productos Orgánicos': 'Productos Orgánicos',
        'Productos Lácteos': 'Productos Lácteos',
        'PLANTAS': 'Plantas',
        'HERRAMIENTAS': 'Herramientas',
        'MACETAS': 'Macetas',
        'SUSTRATOS': 'Sustratos',
        'FERTILIZANTES': 'Fertilizantes'
    };
    return categoryMap[category] || category;
}

function showNoResults() {
    const noResults = document.getElementById('noResults');
    const productsGrid = document.getElementById('productsGrid');
    
    if (noResults && productsGrid) {
        productsGrid.innerHTML = '';
        noResults.style.display = 'block';
    }
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.innerHTML = `Mostrando <strong>${filteredProducts.length}</strong> producto${filteredProducts.length !== 1 ? 's' : ''}`;
    }
}

function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const stockFilter = document.getElementById('stockFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const resetSearchBtn = document.getElementById('resetSearch');
    const clearSearchBtn = document.getElementById('clearSearch');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (stockFilter) stockFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', clearFilters);
    }
    
    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            applyFilters();
        });
    }
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const stockFilter = document.getElementById('stockFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearSearchBtn = document.getElementById('clearSearch');

    const searchTerm = searchInput?.value.toLowerCase() || '';
    const category = categoryFilter?.value || '';
    const priceRange = priceFilter?.value || '';
    const stockFilterValue = stockFilter?.value || '';
    const sortBy = sortFilter?.value || 'name-asc';

    // Mostrar/ocultar botón de limpiar búsqueda
    if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm ? 'block' : 'none';
    }

    // Filtrar productos
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            (product.description || '').toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category.toLowerCase() === category.toLowerCase();
        const matchesPrice = matchesPriceRange(product.price, priceRange);
        const matchesStock = matchesStockFilter(product.stock, stockFilterValue);

        return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    // Ordenar productos
    sortProducts(sortBy);

    // Actualizar visualización
    displayAllProducts();
}

function matchesPriceRange(price, range) {
    if (!range) return true;
    const [min, max] = range.split('-').map(Number);
    if (range.endsWith('+')) {
        return price >= min;
    }
    return price >= min && price <= max;
}

function matchesStockFilter(stock, filter) {
    switch (filter) {
        case 'available':
            return stock > 0;
        case 'low-stock':
            return stock > 0 && stock < 50;
        default:
            return true;
    }
}

function sortProducts(sortBy) {
    switch (sortBy) {
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'stock-desc':
            filteredProducts.sort((a, b) => b.stock - a.stock);
            break;
    }
}

function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const stockFilter = document.getElementById('stockFilter');
    const sortFilter = document.getElementById('sortFilter');
    const noResults = document.getElementById('noResults');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (stockFilter) stockFilter.value = '';
    if (sortFilter) sortFilter.value = 'name-asc';
    if (noResults) noResults.style.display = 'none';

    // Restablecer lista de productos
    filteredProducts = [...products];
    displayAllProducts();
}

// Función para agregar productos al carrito
function addToCartFromProducts(productId) {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
        showNotification('Debes iniciar sesión para agregar productos al carrito', 'error');
        setTimeout(() => {
            redirectToLogin();
        }, 2000);
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('huertohogar_cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('No hay más stock disponible de este producto', 'error');
            return;
        }
    } else {
        if (product.stock > 0) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                stock: product.stock // Agregamos el stock para validaciones posteriores
            });
        } else {
            showNotification('Este producto está fuera de stock', 'error');
            return;
        }
    }
    
    localStorage.setItem('huertohogar_cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Producto agregado al carrito', 'success');
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

    // Agregar animaciones si no existen
    if (!document.head.querySelector('style[data-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification', 'true');
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

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('huertohogar_cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    const cartCountBadge = document.getElementById('cartCount'); // Soporte para ambos IDs
    
    // Actualizar el contador en la página de productos
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    // Actualizar el contador en otras páginas
    if (cartCountBadge) {
        cartCountBadge.textContent = totalItems;
        cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Exportar funciones necesarias al scope global
window.addToCartFromProducts = addToCartFromProducts;