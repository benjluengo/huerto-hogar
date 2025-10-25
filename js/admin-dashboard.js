// Funciones de gestión de usuarios
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }

        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar usuarios');
    }
}

function displayUsers(users) {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = users.map(user => `
        <tr data-user-id="${user.id}">
            <td>${user.name || 'No especificado'}</td>
            <td>${user.email}</td>
            <td>${user.phoneNumber || 'No especificado'}</td>
            <td>${user.address || 'No especificada'}</td>
            <td>${user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}</td>
            <td>
                <button class="action-btn" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function saveNewUser() {
    const firstName = document.getElementById('newUserFirstName').value.trim();
    const lastName = document.getElementById('newUserLastName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const phone = document.getElementById('newUserPhone').value.trim();
    const address = document.getElementById('newUserAddress').value.trim();
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;

    if (!firstName || !lastName || !email || !phone || !address || !password || !role) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const userData = {
        name: `${firstName} ${lastName}`,
        email,
        password,
        phoneNumber: phone,
        address,
        role
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Error al crear usuario');
        }

        alert('Usuario creado exitosamente');
        document.getElementById('addUserForm').style.display = 'none';
        clearUserForm();
        loadUsers(); // Recargar la lista de usuarios
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el usuario');
    }
}

function clearUserForm() {
    const inputs = ['newUserFirstName', 'newUserLastName', 'newUserEmail', 
                   'newUserPhone', 'newUserAddress', 'newUserPassword'];
    inputs.forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('newUserRole').value = 'USER';
}

function showAddUserForm() {
    const form = document.getElementById('addUserForm');
    const title = document.querySelector('#addUserForm h3');
    const saveButton = document.getElementById('saveUserBtn');
    
    title.textContent = 'Agregar Nuevo Usuario';
    saveButton.textContent = 'Guardar';
    saveButton.onclick = saveNewUser;
    form.dataset.mode = 'create';
    
    clearUserForm();
    form.style.display = 'block';
}

function cancelAddUser() {
    document.getElementById('addUserForm').style.display = 'none';
    clearUserForm();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.toggle-password i');
    
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

async function deleteUser(userId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }

        alert('Usuario eliminado exitosamente');
        loadUsers(); // Recargar la lista
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
    }
}

async function editUser(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos del usuario');
        }

        const user = await response.json();
        
        // Separar el nombre completo en nombre y apellido
        const [firstName = '', ...lastNameParts] = user.name ? user.name.split(' ') : ['', ''];
        const lastName = lastNameParts.join(' ');

        // Llenar el formulario con los datos del usuario
        document.getElementById('newUserFirstName').value = firstName;
        document.getElementById('newUserLastName').value = lastName;
        document.getElementById('newUserEmail').value = user.email;
        document.getElementById('newUserPhone').value = user.phoneNumber || '';
        document.getElementById('newUserAddress').value = user.address || '';
        document.getElementById('newUserRole').value = user.role;
        document.getElementById('newUserPassword').value = ''; // No mostrar la contraseña actual
        
        // Cambiar el título y el botón del formulario
        const form = document.getElementById('addUserForm');
        const title = document.querySelector('#addUserForm h3');
        const saveButton = document.getElementById('saveUserBtn');
        
        title.textContent = 'Editar Usuario';
        saveButton.textContent = 'Actualizar';
        saveButton.onclick = () => updateUser(userId);
        form.dataset.mode = 'edit';
        form.dataset.userId = userId;
        
        form.style.display = 'block';
        document.getElementById('newUserPhone').value = user.phoneNumber || '';
        document.getElementById('newUserAddress').value = user.address || '';
        document.getElementById('newUserRole').value = user.role;
        document.getElementById('newUserPassword').value = ''; // No mostramos la contraseña actual

        // Mostrar el formulario
        document.getElementById('addUserForm').style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del usuario');
    }
}

async function updateUser(userId) {
    const firstName = document.getElementById('newUserFirstName').value.trim();
    const lastName = document.getElementById('newUserLastName').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const phone = document.getElementById('newUserPhone').value.trim();
    const address = document.getElementById('newUserAddress').value.trim();
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;

    if (!firstName || !lastName || !email || !phone || !address || !role) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    const userData = {
        name: `${firstName} ${lastName}`,
        email,
        phoneNumber: phone,
        address,
        role
    };

    // Solo incluir la contraseña si se ha ingresado una nueva
    if (password) {
        userData.password = password;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar usuario');
        }

        alert('Usuario actualizado exitosamente');
        document.getElementById('addUserForm').style.display = 'none';
        // Restaurar el formulario al estado original
        showAddUserForm();

    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el usuario');
    }
}

// Funciones de navegación
function showProducts() {
    document.getElementById('sectionProducts').style.display = 'block';
    document.getElementById('sectionUsers').style.display = 'none';
    document.getElementById('navProducts').classList.add('active');
    document.getElementById('navUsers').classList.remove('active');
    document.getElementById('addProductForm').style.display = 'none';
    loadProducts();
}

function showUsers() {
    document.getElementById('sectionProducts').style.display = 'none';
    document.getElementById('sectionUsers').style.display = 'block';
    document.getElementById('navProducts').classList.remove('active');
    document.getElementById('navUsers').classList.add('active');
    loadUsers();
}

// Funciones de gestión de productos
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar productos');
        }

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar productos');
    }
}

function displayProducts(products) {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = products.map(product => {
        const categoryMap = {
            'PLANTAS': 'Plantas',
            'HERRAMIENTAS': 'Herramientas',
            'MACETAS': 'Macetas',
            'SUSTRATOS': 'Sustratos',
            'FERTILIZANTES': 'Fertilizantes'
        };

        return `
        <tr>
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString('es-CL')}</td>
            <td>${product.stock}</td>
            <td>${categoryMap[product.category] || product.category || 'No especificada'}</td>
            <td>
                <button class="action-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `}).join('');
}

function showAddProductForm() {
    const form = document.getElementById('addProductForm');
    const title = document.querySelector('#addProductForm h3');
    const saveButton = document.getElementById('saveProductBtn');
    
    title.textContent = 'Agregar Nuevo Producto';
    saveButton.textContent = 'Guardar';
    form.dataset.mode = 'create';
    
    clearProductForm();
    form.style.display = 'block';
}

function clearProductForm() {
    const inputs = ['productName', 'productDescription', 'productPrice', 
                   'productStock', 'productImageUrl'];
    inputs.forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('productCategory').value = 'PLANTAS';
}

function cancelAddProduct() {
    document.getElementById('addProductForm').style.display = 'none';
    clearProductForm();
}

async function saveNewProduct() {
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;
    const category = document.getElementById('productCategory').value;
    const imageUrl = document.getElementById('productImageUrl').value.trim();

    if (!name || !description || !price || !stock || !category || !imageUrl) {
        alert('Por favor, complete todos los campos');
        return;
    }

    if (price < 0) {
        alert('El precio no puede ser negativo');
        return;
    }

    if (stock < 0) {
        alert('El stock no puede ser negativo');
        return;
    }

    const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        image: imageUrl
    };

    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error('Error al crear producto');
        }

        alert('Producto creado exitosamente');
        document.getElementById('addProductForm').style.display = 'none';
        clearProductForm();
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear el producto');
    }
}

async function editProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos del producto');
        }

        const product = await response.json();
        
        // Llenar el formulario con los datos del producto
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productImageUrl').value = product.image;
        
        // Cambiar el título y el botón del formulario
        const form = document.getElementById('addProductForm');
        const title = document.querySelector('#addProductForm h3');
        const saveButton = document.getElementById('saveProductBtn');
        
        title.textContent = 'Editar Producto';
        saveButton.textContent = 'Actualizar';
        form.dataset.mode = 'edit';
        form.dataset.productId = productId;
        
        form.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del producto');
    }
}

async function updateProduct(productId) {
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;
    const category = document.getElementById('productCategory').value;
    const imageUrl = document.getElementById('productImageUrl').value.trim();

    if (!name || !description || !price || !stock || !category || !imageUrl) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    const productData = {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        image: imageUrl
    };

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar producto');
        }

        alert('Producto actualizado exitosamente');
        showAddProductForm();
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar el producto');
    }
}

async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar producto');
        }

        alert('Producto eliminado exitosamente');
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación de administrador
    if (!localStorage.getItem('huertohogar_adminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Configurar navegación
    document.getElementById('navProducts').addEventListener('click', showProducts);
    document.getElementById('navUsers').addEventListener('click', showUsers);
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('huertohogar_adminLoggedIn');
        window.location.href = 'admin-login.html';
    });

    // Configurar botones
    document.getElementById('addUserBtn').addEventListener('click', showAddUserForm);
    document.getElementById('saveUserBtn').addEventListener('click', () => {
        const form = document.getElementById('addUserForm');
        if (form.dataset.mode === 'edit') {
            updateUser(form.dataset.userId);
        } else {
            saveNewUser();
        }
    });

    document.getElementById('saveProductBtn').addEventListener('click', () => {
        const form = document.getElementById('addProductForm');
        if (form.dataset.mode === 'edit') {
            updateProduct(form.dataset.productId);
        } else {
            saveNewProduct();
        }
    });

    // Mostrar productos por defecto
    showProducts();
});