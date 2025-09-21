document.addEventListener('DOMContentLoaded', () => {
    // Parse orderId from query string
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (!orderId) return;

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('huertohogar_currentUser') || 'null');
    if (!currentUser || !currentUser.purchases) return;

    // Find order by id
    const order = currentUser.purchases.find(p => p.id === orderId);
    if (!order) return;

    // Populate order details
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('orderDate').textContent = new Date(order.date).toLocaleDateString('es-CL');
    document.getElementById('orderDeliveryDate').textContent = new Date(order.deliveryDate).toLocaleDateString('es-CL');
    document.getElementById('orderTotal').textContent = order.total.toLocaleString('es-CL');
    document.getElementById('orderStatus').textContent = order.status === 'pending' ? 'Pendiente' :
        order.status === 'shipped' ? 'Enviada' : 'Completada';

    const orderItemsList = document.getElementById('orderItems');
    orderItemsList.innerHTML = '';
    order.items.forEach(itemName => {
        const li = document.createElement('li');
        li.textContent = itemName;
        orderItemsList.appendChild(li);
    });
});
