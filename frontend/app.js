const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'http://54.227.95.214:30007';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkHealth();
    loadUsers();
    loadProducts();
    
    // Setup form handlers
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
});

// Health check
async function checkHealth() {
    try {
        const response = await fetch(`${API_URL.replace('/api', '')}/health`);
        const data = await response.json();
        
        document.getElementById('backendStatus').textContent = 'Connected';
        document.getElementById('backendStatus').className = 'status-value success';
        document.getElementById('dbStatus').textContent = 'Connected';
        document.getElementById('dbStatus').className = 'status-value success';
    } catch (error) {
        console.error('Health check failed:', error);
        document.getElementById('backendStatus').textContent = 'Disconnected';
        document.getElementById('backendStatus').className = 'status-value error';
        document.getElementById('dbStatus').textContent = 'Unknown';
        document.getElementById('dbStatus').className = 'status-value error';
    }
}

// Tab switching
function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// ============= USER FUNCTIONS =============

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        
        const usersList = document.getElementById('usersList');
        
        if (users.length === 0) {
            usersList.innerHTML = '<div class="empty-state">No users found. Add your first user!</div>';
            return;
        }
        
        usersList.innerHTML = users.map(user => `
            <div class="data-item">
                <div class="data-item-info">
                    <h3>${user.name}</h3>
                    <p>📧 ${user.email}</p>
                    <p>🎂 Age: ${user.age || 'Not specified'}</p>
                    <p>📍 City: ${user.city || 'Not specified'}</p>
                    <p>📅 Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="data-item-actions">
                    <button onclick="deleteUser('${user._id}')" class="btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
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
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            document.getElementById('userForm').reset();
            loadUsers();
            showNotification('User added successfully!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Error adding user', 'error');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showNotification('Error adding user. Please try again.', 'error');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadUsers();
            showNotification('User deleted successfully!', 'success');
        } else {
            showNotification('Error deleting user', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Error deleting user. Please try again.', 'error');
    }
}

// ============= PRODUCT FUNCTIONS =============

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        const productsList = document.getElementById('productsList');
        
        if (products.length === 0) {
            productsList.innerHTML = '<div class="empty-state">No products found. Add your first product!</div>';
            return;
        }
        
        productsList.innerHTML = products.map(product => `
            <div class="data-item">
                <div class="data-item-info">
                    <h3>${product.name}</h3>
                    <p>💰 $${product.price.toFixed(2)}</p>
                    <p>📁 Category: ${product.category || 'Uncategorized'}</p>
                    <p>📝 ${product.description || 'No description'}</p>
                    <p>📦 ${product.inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>
                </div>
                <div class="data-item-actions">
                    <button onclick="deleteProduct('${product._id}')" class="btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
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
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            document.getElementById('productForm').reset();
            document.getElementById('productInStock').checked = true;
            loadProducts();
            showNotification('Product added successfully!', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Error adding product', 'error');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showNotification('Error adding product. Please try again.', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadProducts();
            showNotification('Product deleted successfully!', 'success');
        } else {
            showNotification('Error deleting product', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Error deleting product. Please try again.', 'error');
    }
}

// Notification system
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
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
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
