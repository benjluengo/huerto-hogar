// Gestión de sesión
const SESSION_KEY = 'huertohogar_currentUser';

// Función para guardar la sesión
function saveSession(userData) {
    if (!userData || !userData.email) {
        throw new Error('Datos de usuario inválidos');
    }
    
    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Error al guardar sesión:', error);
        return false;
    }
}

// Función para obtener la sesión actual
function getCurrentSession() {
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
        console.error('Error al leer sesión:', error);
        return null;
    }
}

// Función para cerrar sesión
function clearSession() {
    try {
        localStorage.removeItem(SESSION_KEY);
        return true;
    } catch (error) {
        console.error('Error al limpiar sesión:', error);
        return false;
    }
}

// Función para verificar si hay una sesión activa
function checkAuthPages() {
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.includes('login.html') || currentPath.includes('register.html');
    const user = getCurrentSession();

    if (user && isAuthPage) {
        console.log('Sesión activa detectada, redirigiendo...');
        window.location.href = '../index.html';
        return true;
    }
    return false;
}

// Inicializar verificación de sesión en páginas de auth
document.addEventListener('DOMContentLoaded', checkAuthPages);