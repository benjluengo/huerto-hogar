// Función para verificar si hay una sesión activa
function checkSession() {
    const currentPath = window.location.pathname;
    const user = localStorage.getItem('huertohogar_currentUser');
    
    // Si hay un usuario logueado y estamos en la página de login o registro
    if (user && (currentPath.includes('login.html') || currentPath.includes('register.html'))) {
        window.location.href = '../index.html';
        return true;
    }
    return false;
}

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Solo verificar en páginas de auth
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('register.html')) {
        checkSession();
    }
});

// Funciones de API para autenticación
async function loginUser(credentials) {
    try {
        console.log('Intentando login con credenciales:', credentials);
        console.log('URL de login:', API_URLS.USER_LOGIN);
        
        const response = await fetch(API_URLS.USER_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        // Obtener el texto de la respuesta primero
        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);
        
        if (!response.ok) {
            throw new Error(`Login falló - Status: ${response.status}, Response: ${responseText}`);
        }
        
        // Si la respuesta está vacía, es un error
        if (!responseText) {
            throw new Error('El servidor no envió datos del usuario');
        }
        
        // Intentar parsear la respuesta como JSON
        try {
            const responseData = JSON.parse(responseText);
            console.log('Respuesta del servidor:', responseData);

            // El backend devuelve {user: {...}, token: "..."}
            if (responseData.user && responseData.token) {
                // Combinar el usuario con el token
                const userData = {
                    ...responseData.user,
                    token: responseData.token
                };
                console.log('Login exitoso, datos del usuario:', userData);
                return userData;
            } else {
                // Si no tiene la estructura esperada, asumir que es el usuario directo
                console.log('Login exitoso (formato directo), datos del usuario:', responseData);
                return responseData;
            }
        } catch (e) {
            console.error('Error al parsear respuesta del servidor:', e);
            throw new Error('Error al procesar la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
}

async function registerUser(userData) {
    try {
        console.log('URL de registro:', API_URLS.USER_REGISTER);
        console.log('Datos a enviar:', JSON.stringify(userData, null, 2));
        
        const response = await fetch(API_URLS.USER_REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        // Obtener el texto de la respuesta primero
        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);
        
        if (!response.ok) {
            // Intentar parsear el texto como JSON si es posible
            try {
                const errorData = JSON.parse(responseText);
                throw new Error(errorData.message || 'Registro falló');
            } catch (e) {
                throw new Error(`Registro falló - Status: ${response.status}, Response: ${responseText}`);
            }
        }
        
        // Si la respuesta está vacía, retornar null
        if (!responseText) {
            return null;
        }
        
        // Intentar parsear la respuesta como JSON
        try {
            const responseData = JSON.parse(responseText);
            console.log('Registro exitoso, respuesta del servidor:', responseData);

            // El backend devuelve el usuario registrado
            return responseData;
        } catch (e) {
            console.error('Error al parsear la respuesta:', e);
            throw new Error('Error al procesar la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error en registro:', error);
        console.error('Detalles del usuario enviado:', userData);
        throw error;
    }
}

async function updateUser(userId, userData) {
    try {
        const response = await fetch(API_URLS.USER_PROFILE(userId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Actualización falló');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en actualización:', error);
        throw error;
    }
}

// Función para mostrar/ocultar contraseña
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Función para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar teléfono chileno
function validatePhone(phone) {
    const phoneRegex = /^(\+?56)?(\s?)(9)(\s?)([0-9]{4})(\s?)([0-9]{4})$/;
    return phoneRegex.test(phone);
}

// Función para evaluar fortaleza de contraseña
function checkPasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    if (!strengthIndicator) return;

    let strength = 0;

    // Verificar longitud
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;

    // Verificar mayúsculas
    if (/[A-Z]/.test(password)) strength++;

    // Verificar números
    if (/[0-9]/.test(password)) strength++;

    // Verificar caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Aplicar clase según fortaleza
    strengthIndicator.classList.remove('weak', 'medium', 'strong');

    if (strength <= 2) {
        strengthIndicator.classList.add('weak');
    } else if (strength <= 3) {
        strengthIndicator.classList.add('medium');
    } else {
        strengthIndicator.classList.add('strong');
    }
}

// Función para mostrar mensajes de error
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);

    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.classList.add('error');
    }
}

// Función para limpiar errores
function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);

    if (errorElement && inputElement) {
        errorElement.classList.remove('show');
        inputElement.classList.remove('error');
    }
}

// Función para limpiar todos los errores
function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('.error');

    errorMessages.forEach(error => error.classList.remove('show'));
    inputElements.forEach(input => input.classList.remove('error'));
}

// Función para mostrar mensaje de éxito
function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    if (successElement) {
        successElement.querySelector('p').textContent = message;
        successElement.style.display = 'block';

        // Ocultar el formulario
        const form = document.querySelector('.auth-form');
        if (form) {
            form.style.display = 'none';
        }
    }
}

// Función de Login
async function handleLogin(event) {
    event.preventDefault();
    clearAllErrors();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');

    let isValid = true;

    // Validación de email
    if (!email) {
        showError('email', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Ingresa un correo electrónico válido');
        isValid = false;
    }

    // Validación de contraseña
    if (!password) {
        showError('password', 'La contraseña es requerida');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }

    if (!isValid) return;

    // Mostrar loading
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    try {
        const user = await loginUser({ email: email.toLowerCase(), password });

        // Verificar que tenemos los datos necesarios del usuario
        if (!user || !user.email) {
            throw new Error('Datos de usuario inválidos');
        }

        // Guardar sesión
        localStorage.setItem('huertohogar_currentUser', JSON.stringify(user));
        localStorage.setItem('auth_token', user.token);

        showSuccess('¡Bienvenido! Iniciando sesión...');

        // Redireccionar después de 2 segundos
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    } catch (error) {
        console.error('Error durante el login:', error);
        showError('email', 'Correo o contraseña incorrectos');
        showError('password', 'Correo o contraseña incorrectos');
    } finally {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// Función de Registro
async function handleRegister(event) {
    event.preventDefault();
    clearAllErrors();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    const registerBtn = document.getElementById('registerBtn');

    let isValid = true;

    // Validación de nombre
    if (!firstName) {
        showError('firstName', 'El nombre es requerido');
        isValid = false;
    } else if (firstName.length < 2) {
        showError('firstName', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }

    // Validación de apellido
    if (!lastName) {
        showError('lastName', 'El apellido es requerido');
        isValid = false;
    } else if (lastName.length < 2) {
        showError('lastName', 'El apellido debe tener al menos 2 caracteres');
        isValid = false;
    }

    // Validación de email
    if (!email) {
        showError('email', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Ingresa un correo electrónico válido');
        isValid = false;
    }

    // Validación de teléfono
    if (!phone) {
        showError('phone', 'El teléfono es requerido');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showError('phone', 'Ingresa un número de teléfono válido (+56 9 XXXX XXXX)');
        isValid = false;
    }

    // Validación de dirección
    if (!address) {
        showError('address', 'La dirección es requerida');
        isValid = false;
    } else if (address.length < 10) {
        showError('address', 'Ingresa una dirección más específica');
        isValid = false;
    }

    // Validación de contraseña
    if (!password) {
        showError('password', 'La contraseña es requerida');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }

    // Validación de confirmación de contraseña
    if (!confirmPassword) {
        showError('confirmPassword', 'Debes confirmar tu contraseña');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Las contraseñas no coinciden');
        isValid = false;
    }

    // Validación de términos
    if (!terms) {
        showError('terms', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }

    if (!isValid) return;

    // Mostrar loading
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;

    try {
        // Crear nuevo usuario con los campos exactos que espera el backend
        const userData = {
            name: `${firstName} ${lastName}`.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            phoneNumber: phone.trim(),
            address: address.trim(),
            role: "USER"
        };

        console.log('Enviando datos de registro (normalizados):', userData);

        // Registrar al usuario
        const user = await registerUser(userData);
        
        // Esperar un momento antes de intentar el auto-login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            // Hacer login automáticamente con las credenciales
            const loginData = {
                email: email.toLowerCase(),
                password: password
            };
            console.log('Intentando auto-login con:', loginData);

            const loggedInUser = await loginUser(loginData);
            
            // Verificar que tenemos los datos necesarios del usuario
            if (!loggedInUser || !loggedInUser.email) {
                throw new Error('Datos de usuario inválidos en auto-login');
            }

            console.log('Auto-login exitoso:', loggedInUser);
            
            // Guardar sesión
            localStorage.setItem('huertohogar_currentUser', JSON.stringify(loggedInUser));
            localStorage.setItem('auth_token', loggedInUser.token);

            showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
            
            // Redireccionar después de 2 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } catch (loginError) {
            console.error('Error durante el auto-login:', loginError);
            // Si falla el auto-login, redirigir a la página de login
            showSuccess('¡Cuenta creada exitosamente! Por favor, inicia sesión manualmente.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    } catch (error) {
        console.error('Error completo:', error);
        
        if (error.message.includes('El correo ya está registrado')) {
            showError('email', 'Este correo ya está registrado');
        } else if (error.message.includes('400')) {
            showError('email', 'Datos inválidos. Por favor verifica la información.');
        } else if (error.message.includes('500')) {
            showError('email', 'Error en el servidor. Por favor intenta más tarde.');
        } else {
            showError('email', `Error al crear la cuenta: ${error.message}`);
        }
    } finally {
        registerBtn.classList.remove('loading');
        registerBtn.disabled = false;
    }
}

// Funciones de gestión del token
function getAuthToken() {
    const user = JSON.parse(localStorage.getItem('huertohogar_currentUser'));
    return user ? user.token : null;
}

function isAuthenticated() {
    const token = getAuthToken();
    return token !== null;
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

// Exponer funciones globalmente
window.getAuthToken = getAuthToken;
window.isAuthenticated = isAuthenticated;
window.redirectToLogin = redirectToLogin;

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Form de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);

        // Limpiar errores al escribir
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (emailInput) {
            emailInput.addEventListener('input', () => clearError('email'));
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => clearError('password'));
        }
    }

    // Form de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);

        // Validación en tiempo real para registro
        const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'password', 'confirmPassword'];

        fields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            if (input) {
                input.addEventListener('input', () => clearError(fieldId));
            }
        });

        // Verificar fortaleza de contraseña en tiempo real
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                checkPasswordStrength(e.target.value);
            });
        }

        // Verificar coincidencia de contraseñas
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput && passwordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                    showError('confirmPassword', 'Las contraseñas no coinciden');
                } else {
                    clearError('confirmPassword');
                }
            });
        }
    }

    // Verificar si hay usuario logueado
    const currentUser = localStorage.getItem('huertohogar_currentUser');
    if (currentUser && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
        // Si ya está logueado y trata de acceder a login/register, redirigir
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 100);
    }
});