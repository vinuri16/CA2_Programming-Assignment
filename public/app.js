const API_URL = '/api/plants';

// DOM Elements
const plantList = document.getElementById('plantList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const addPlantBtn = document.getElementById('addPlantBtn');
const plantModal = document.getElementById('plantModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const plantForm = document.getElementById('plantForm');
const modalTitle = document.getElementById('modalTitle');
const plantIdInput = document.getElementById('plantId');

// State
let isEditing = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchPlants();
});

searchInput.addEventListener('input', debounce(() => fetchPlants(), 300));
sortSelect.addEventListener('change', () => fetchPlants());

addPlantBtn.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
plantForm.addEventListener('submit', handleFormSubmit);

// Fetch Plants
async function fetchPlants() {
    const search = searchInput.value;
    const sort = sortSelect.value;
    
    // Build query string
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);

    try {
        const response = await fetch(`${API_URL}?${params}`);
        if (!response.ok) throw new Error('Failed to fetch plants');
        
        const plants = await response.json();
        renderPlants(plants);
    } catch (error) {
        console.error('Error:', error);
        plantList.innerHTML = '<p class="error">Error loading plants. Please try again.</p>';
    }
}

// Render Plants
function renderPlants(plants) {
    if (plants.length === 0) {
        plantList.innerHTML = '<p class="no-results">No plants found.</p>';
        return;
    }

    plantList.innerHTML = plants.map(plant => `
        <div class="plant-card">
            <div class="card-header">
                <div>
                    <h3 class="plant-name">${escapeHtml(plant.name)}</h3>
                    <span class="plant-type">${escapeHtml(plant.type)}</span>
                </div>
                <div class="plant-price">$${plant.price.toFixed(2)}</div>
            </div>
            
            <div class="card-details">
                <div class="detail-row">
                    <span>Stock:</span>
                    <span class="stock-badge ${getStockClass(plant.stockLevel)}">
                        ${plant.stockLevel} units
                    </span>
                </div>
                <div class="detail-row">
                    <span>Supplier:</span>
                    <span>${escapeHtml(plant.supplier || 'N/A')}</span>
                </div>
            </div>

            <div class="card-actions">
                <button class="btn btn-edit" onclick="editPlant('${plant._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deletePlant('${plant._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Form Submit (Create or Update)
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        price: parseFloat(document.getElementById('price').value),
        stockLevel: parseInt(document.getElementById('stockLevel').value),
        supplier: document.getElementById('supplier').value
    };

    try {
        let response;
        if (isEditing) {
            const id = plantIdInput.value;
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        if (!response.ok) throw new Error('Operation failed');

        closeModal();
        fetchPlants();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save plant. Please check your inputs.');
    }
}

// Edit Plant
window.editPlant = async function(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Plant not found');
        
        const plant = await response.json();
        
        // Populate form
        plantIdInput.value = plant._id;
        document.getElementById('name').value = plant.name;
        document.getElementById('type').value = plant.type;
        document.getElementById('price').value = plant.price;
        document.getElementById('stockLevel').value = plant.stockLevel;
        document.getElementById('supplier').value = plant.supplier || '';

        openModal(true);
    } catch (error) {
        console.error('Error:', error);
        alert('Could not load plant details');
    }
};

// Delete Plant
window.deletePlant = async function(id) {
    if (!confirm('Are you sure you want to delete this plant?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Delete failed');
        
        fetchPlants();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete plant');
    }
};

// Modal Helpers
function openModal(editing = false) {
    isEditing = editing;
    modalTitle.textContent = editing ? 'Edit Plant' : 'Add New Plant';
    plantModal.classList.remove('hidden');
    // slight delay to allow display:block to apply before opacity transition
    setTimeout(() => plantModal.classList.add('visible'), 10);
    
    if (!editing) {
        plantForm.reset();
        plantIdInput.value = '';
    }
}

function closeModal() {
    plantModal.classList.remove('visible');
    setTimeout(() => plantModal.classList.add('hidden'), 300);
}

// Utils
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getStockClass(stock) {
    if (stock === 0) return 'stock-out';
    if (stock < 5) return 'stock-low';
    return '';
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
