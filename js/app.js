// Main Application Logic
let currentSection = 'home';

// Navigation functions
function showHome() {
    hideAllSections();
    document.getElementById('homeSection').classList.remove('hidden');
    currentSection = 'home';
    startCountdown();
}

function showCommon() {
    hideAllSections();
    document.getElementById('commonSection').classList.remove('hidden');
    currentSection = 'common';
    showCommonTab('documents');
}

function hideAllSections() {
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('commonSection').classList.add('hidden');
}

// Common section tabs
function showCommonTab(tabName) {
    // Hide all tab content
    document.querySelectorAll('.common-tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.common-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + 'Tab').classList.remove('hidden');
    
    // Add active class to selected tab button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load content based on tab
    switch(tabName) {
        case 'documents':
            loadDocumentsHub();
            break;
        case 'checklist':
            loadSharedChecklist();
            break;
        case 'tips':
            loadTips();
            break;
        case 'timeline':
            loadTimeline();
            break;
    }
    
    // Setup search functionality
    setTimeout(setupSearchFunctionality, 100);
}

// Countdown timer
function startCountdown() {
    const targetDate = new Date('2025-09-22T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = 'Departure Day is Here! 🎉';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('countdown').innerHTML = 
            `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateSharedProgress(checklist) {
    const completed = checklist.filter(item => item.completed).length;
    const total = checklist.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const progressBar = document.getElementById('sharedProgressBar');
    const progressText = document.getElementById('sharedProgress');
    
    if (progressBar && progressText) {
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${percentage}% Complete`;
    }
}

// UI Helper Functions
function createChecklistItem(item, index) {
    const div = document.createElement('div');
    div.className = `checklist-item ${item.completed ? 'completed' : ''}`;
    
    const priorityColor = item.priority === 'high' ? 'text-red-600' : 
                         item.priority === 'medium' ? 'text-yellow-600' : 'text-green-600';
    
    div.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
                <input type="checkbox" ${item.completed ? 'checked' : ''} 
                       onchange="sharedTaskToggle(${index})" 
                       class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                <span class="task-text flex-1 ${item.completed ? 'line-through text-gray-500' : ''}">${item.text}</span>
                ${item.priority ? `<span class="text-xs ${priorityColor} font-medium ml-2">${item.priority}</span>` : ''}
            </div>
            <button onclick="deleteSharedTask(${index})" 
                    class="ml-2 text-red-500 hover:text-red-700 text-sm">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        ${item.createdBy ? `<div class="text-xs text-gray-500 mt-1 ml-7">Added by: ${item.createdBy}</div>` : ''}
    `;
    
    return div;
}

function createDocumentCard(doc, index) {
    const div = document.createElement('div');
    div.className = 'document-card bg-white p-6 rounded-lg shadow-md border border-gray-200';
    
    const iconClass = doc.icon ? (doc.icon.includes('text-') ? doc.icon : doc.icon + ' text-blue-600') : 'fas fa-file text-blue-600';
    
    div.innerHTML = `
        <div class="flex items-start">
            <div class="text-3xl ${iconClass} mr-4"></div>
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">${doc.title}</h3>
                <p class="text-gray-600 text-sm mb-3">${doc.description}</p>
                <div class="flex justify-between items-center">
                    <span class="category text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${doc.category}</span>
                    <div class="flex space-x-2">
                        <a href="${doc.url}" target="_blank" 
                           class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            <i class="fas fa-external-link-alt mr-1"></i>Open
                        </a>
                        <button onclick="deleteDocument(${index})" 
                                class="text-red-600 hover:text-red-800 text-sm font-medium">
                            <i class="fas fa-trash mr-1"></i>Delete
                        </button>
                    </div>
                </div>
                ${doc.createdBy ? `<div class="text-xs text-gray-500 mt-2">Added by: ${doc.createdBy}</div>` : ''}
            </div>
        </div>
    `;
    
    return div;
}

function createTipCard(tip, index) {
    const div = document.createElement('div');
    div.className = 'tip-card bg-white p-6 rounded-lg shadow-md border border-gray-200';
    
    div.innerHTML = `
        <div class="flex items-start">
            <div class="text-2xl ${tip.icon} text-green-600 mr-4 mt-1"></div>
            <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold text-gray-800">${tip.title}</h3>
                    <div class="flex items-center space-x-2">
                        <span class="category text-xs bg-green-100 text-green-800 px-2 py-1 rounded">${tip.category}</span>
                        <button onclick="deleteTip(${index})" 
                                class="text-red-600 hover:text-red-800 text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="text-gray-600">${tip.content}</p>
                ${tip.createdBy ? `<div class="text-xs text-gray-500 mt-2">Added by: ${tip.createdBy}</div>` : ''}
            </div>
        </div>
    `;
    
    return div;
}

function createTimelineEvent(event, index) {
    const div = document.createElement('div');
    const eventDate = new Date(event.date);
    const now = new Date();
    const isUpcoming = eventDate > now;
    const isPast = eventDate < now;
    
    let statusClass = 'upcoming';
    if (isPast) statusClass = 'completed';
    if (event.status) statusClass = event.status;
    
    div.className = `timeline-item ${statusClass}`;
    
    const priorityColor = event.priority === 'high' ? 'text-red-600' : 
                         event.priority === 'medium' ? 'text-yellow-600' : 'text-green-600';
    
    div.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div class="flex justify-between items-start mb-2">
                <h3 class="text-lg font-semibold text-gray-800">${event.title}</h3>
                <div class="text-right flex items-center space-x-2">
                    <div>
                        <div class="text-sm text-gray-500">${formatDate(eventDate)}</div>
                        ${event.priority ? `<span class="text-xs ${priorityColor} font-medium">${event.priority}</span>` : ''}
                    </div>
                    <button onclick="deleteTimelineEvent(${index})" 
                            class="text-red-600 hover:text-red-800 text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-600">${event.description}</p>
            <div class="mt-2 flex justify-between items-center">
                <div class="text-xs text-gray-500">
                    ${isUpcoming ? `In ${Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24))} days` : 
                      isPast ? 'Completed' : 'Today'}
                </div>
                ${event.createdBy ? `<div class="text-xs text-gray-500">Added by: ${event.createdBy}</div>` : ''}
            </div>
        </div>
    `;
    
    return div;
}

// Utility Functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'bg-red-600' : 
                              type === 'success' ? 'bg-green-600' : 
                              type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Global task toggle functions
function sharedTaskToggle(index) {
    toggleSharedTask(index);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Erasmus Survival Kit initialized');
});
