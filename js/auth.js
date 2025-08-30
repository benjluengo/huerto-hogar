// Simulación de base de datos de usuarios (en un proyecto real usarías una API)
let users = JSON.parse(localStorage.getItem('huertohogar_users')) || [];

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
function handleLogin(event) {
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

    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showError('email', 'Correo o contraseña incorrectos');
        showError('password', 'Correo o contraseña incorrectos');
        return;
    }

    // Mostrar loading
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    // Simular proceso de login
    setTimeout(() => {
        // Guardar sesión
        localStorage.setItem('huertohogar_currentUser', JSON.stringify(user));

        showSuccess('¡Bienvenido! Iniciando sesión...');

        // Redireccionar después de 2 segundos
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }, 1500);
}

// Función de Registro
function handleRegister(event) {
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
    } else if (users.some(u => u.email === email)) {
        showError('email', 'Este correo ya está registrado');
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

    // Simular proceso de registro
    setTimeout(() => {
        // Crear nuevo usuario
        const newUser = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            phone,
            address,
            password,
            newsletter: document.getElementById('newsletter').checked,
            createdAt: new Date().toISOString(),
            purchases: []
        };

        // Agregar usuario a la "base de datos"
        users.push(newUser);
        localStorage.setItem('huertohogar_users', JSON.stringify(users));

        // Guardar sesión automáticamente
        localStorage.setItem('huertohogar_currentUser', JSON.stringify(newUser));

        showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');

        // Redireccionar después de 2 segundos
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
    }, 1500);
}

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