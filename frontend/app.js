// ====================== CONFIG ======================
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'http://backend:5000/api';  // Use Docker service name inside containers

// ====================== INIT ======================
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();
    loadUsers();
    loadProducts();

    // Setup form handlers
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
});

// ====================== HEALTH CHECK ======================
async function checkHealth() {
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/health`);
        if (!response.ok) throw new Error('Health check failed');
        const data = await response.json();

        setStatus('backendStatus', 'Connected', true);
        setStatus('dbStatus', 'Connected', true);
    } catch (err) {
        console.error('Health check failed:', err);
        setStatus('backendStatus', 'Disconnected', false);
        setStatus('dbStatus', 'Unknown', false);
    }
}

function setStatus(elementId, text, success) {
    const el = document.getElementById(elementId);
    el.textContent = text;
    el.className = `status-value ${success ? 'success' : 'error'}`;
}

// ====================== TAB SWITCHING ======================
function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// ====================== USERS ======================
async function loadUsers() {
    try {
        const res = await fetch(`${API_URL}/users`);
        const users = await res.json();

        const list = document.getElementById('usersList');
        if (!users || users.length === 0) {
            list.innerHTML = '<div class="empty-state">No users found. Add your first user!</div>';
            return;
        }

        list.innerHTML = users.map(u => `
            <div class="data-item">
                <div class="data-item-info">
                    <h3>${u.name}</h3>
                    <p>📧 ${u.email}</p>
                    <p>🎂 Age: ${u.age || 'Not specified'}</p>
                    <p>📍 City: ${u.city || 'Not specified'}</p>
                    <p>📅 Joined: ${new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="data-item-actions">
                    <button onclick="deleteUser('${u._id}')" class="btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading users:', err);
        document.getElementById('usersList').innerHTML =
            '<div class="empty-state" style="color: #f56565;">Error loading users. Please try again.</div>';
    }
}

async function handleUserSubmit(event) {
    event.preventDefault();
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        age: document.getElementById('userAge').value || undefined,
        city: document.getElementById('userCity').value || undefined
    };

    try {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (res.ok) {
            document.getElementById('userForm').reset();
            loadUsers();
            showNotification('User added successfully!', 'success');
        } else {
            const err = await res.json();
            showNotification(err.error || 'Error adding user', 'error');
        }
    } catch (err) {
        console.error('Error adding user:', err);
        showNotification('Error adding user. Please try again.', 'error');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadUsers();
            showNotification('User deleted successfully!', 'success');
        } else showNotification('Error deleting user', 'error');
    } catch (err) {
        console.error('Error deleting user:', err);
        showNotification('Error deleting user. Please try again.', 'error');
    }
}

// ====================== PRODUCTS ======================
async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();

        const list = document.getElementById('productsList');
        if (!products || products.length === 0) {
            list.innerHTML = '<div class="empty-state">No products found. Add your first product!</div>';
            return;
        }

        list.innerHTML = products.map(p => `
            <div class="data-item">
                <div class="data-item-info">
                    <h3>${p.name}</h3>
                    <p>💰 $${p.price.toFixed(2)}</p>
                    <p>📁 Category: ${p.category || 'Uncategorized'}</p>
                    <p>📝 ${p.description || 'No description'}</p>
                    <p>📦 ${p.inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>
                </div>
                <div class="data-item-actions">
                    <button onclick="deleteProduct('${p._id}')" class="btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error loading products:', err);
        document.getElementById('productsList').innerHTML =
            '<div class="empty-state" style="color: #f56565;">Error loading products. Please try again.</div>';
    }
}

async function handleProductSubmit(event) {
    event.preventDefault();
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value || undefined,
        description: document.getElementById('productDescription').value || undefined,
        inStock: document.getElementById('productInStock').checked
    };

    try {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (res.ok) {
            document.getElementById('productForm').reset();
            document.getElementById('productInStock').checked = true;
            loadProducts();
            showNotification('Product added successfully!', 'success');
        } else {
            const err = await res.json();
            showNotification(err.error || 'Error adding product', 'error');
        }
    } catch (err) {
        console.error('Error adding product:', err);
        showNotification('Error adding product. Please try again.', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadProducts();
            showNotification('Product deleted successfully!', 'success');
        } else showNotification('Error deleting product', 'error');
    } catch (err) {
        console.error('Error deleting product:', err);
        showNotification('Error deleting product. Please try again.', 'error');
    }
}

// ====================== NOTIFICATIONS ======================
function showNotification(message, type) {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 6px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
    `;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ====================== ANIMATIONS ======================
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);
