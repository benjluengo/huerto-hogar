// Configuración de URLs del backend
const API_BASE_URL = 'http://localhost:8080/api';

// URLs específicas de la API
const API_URLS = {
    // Productos
    PRODUCTS: `${API_BASE_URL}/products`,
    PRODUCTS_BY_CATEGORY: (category) => `${API_BASE_URL}/products/category/${category}`,
    PRODUCTS_SEARCH: (query) => `${API_BASE_URL}/products/search?query=${query}`,
    
    // Usuarios
    USERS: `${API_BASE_URL}/users`,
    USER_LOGIN: `${API_BASE_URL}/users/login`,
    USER_REGISTER: `${API_BASE_URL}/users/register`,
    USER_PROFILE: (id) => `${API_BASE_URL}/users/${id}`,
    
    // Pedidos/Órdenes
    ORDERS: `${API_BASE_URL}/orders`,
    USER_ORDERS: (userId) => `${API_BASE_URL}/orders/user/${userId}`,
    ORDER_STATUS: (orderId) => `${API_BASE_URL}/orders/${orderId}/status`
};

// Función para verificar si la API está disponible
async function checkApiAvailability() {
    try {
        const response = await fetch(API_URLS.PRODUCTS);
        console.log('API Status:', response.status);
        return response.ok;
    } catch (error) {
        console.error('API no disponible:', error);
        return false;
    }
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    return !!token;
}

// Función para redirigir al login si no está autenticado
function redirectToLogin() {
    window.location.href = '/pages/login.html';
}

// Función para obtener el token de autenticación
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

// Exportar funciones y constantes necesarias
window.API_URLS = API_URLS;
window.checkApiAvailability = checkApiAvailability;
window.isAuthenticated = isAuthenticated;
window.redirectToLogin = redirectToLogin;
window.getAuthToken = getAuthToken;