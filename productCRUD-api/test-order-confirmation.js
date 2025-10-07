const fetch = require('node-fetch');

async function testOrderConfirmation() {
    try {
        // 1. Login to get token
        console.log('1. Logging in...');
        const loginResponse = await fetch('http://localhost:3001/api/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: "your_username",
                password: "your_password"
            })
        });
        const loginData = await loginResponse.json();
        const token = loginData.token;
        console.log('Login successful, got token');

        // 2. Create new order
        console.log('\n2. Creating new order...');
        const orderResponse = await fetch('http://localhost:3001/api/orders/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify([
                {
                    "id": "68dbb1075aefe52e684b992a",
                    "productName": "p06",
                    "price": 66,
                    "quantity": 3
                }
            ])
        });
        const orderData = await orderResponse.json();
        console.log('Order created:', orderData);

        // 3. Get all orders to find the ID of the new order
        console.log('\n3. Getting all orders to find the new order...');
        const ordersResponse = await fetch('http://localhost:3001/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await ordersResponse.json();
        const latestOrder = orders[orders.length - 1];
        console.log('Latest order:', latestOrder);

        // 4. Confirm the order
        console.log('\n4. Confirming the order...');
        const confirmResponse = await fetch(`http://localhost:3001/api/orders/${latestOrder.id}/confirm`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const confirmData = await confirmResponse.json();
        console.log('Order confirmed:', confirmData);

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the test
testOrderConfirmation();