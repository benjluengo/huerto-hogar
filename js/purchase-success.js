document.addEventListener('DOMContentLoaded', () => {
    // Parse orderId from query string
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (!orderId) return;

    // Fetch order details from API
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.error('No auth token found');
        return;
    }

    fetch(`${API_URLS.ORDERS}/${orderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }
        return response.json();
    })
    .then(order => {
        // Populate order details
        document.getElementById('orderId').textContent = order.id;
        document.getElementById('orderDate').textContent = new Date(order.orderDate).toLocaleDateString('es-CL');
        document.getElementById('orderDeliveryDate').textContent = new Date(order.deliveryDate).toLocaleDateString('es-CL');
        document.getElementById('orderTotal').textContent = order.totalAmount.toLocaleString('es-CL');
        document.getElementById('orderStatus').textContent = order.status === 'PENDING' ? 'Pendiente' :
            order.status === 'SHIPPED' ? 'Enviada' : 'Completada';

        const orderItemsList = document.getElementById('orderItems');
        orderItemsList.innerHTML = '';
        order.orderItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.product.name} - Cantidad: ${item.quantity} - Precio: $${item.price.toLocaleString('es-CL')}`;
            orderItemsList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error fetching order details:', error);
        // Fallback: show basic message
        document.getElementById('orderId').textContent = orderId;
        document.getElementById('orderDate').textContent = 'No disponible';
        document.getElementById('orderDeliveryDate').textContent = 'No disponible';
        document.getElementById('orderTotal').textContent = 'No disponible';
        document.getElementById('orderStatus').textContent = 'No disponible';
        document.getElementById('orderItems').innerHTML = '<li>No se pudieron cargar los detalles</li>';
    });
});
