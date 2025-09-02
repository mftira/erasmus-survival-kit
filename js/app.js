// Main Application Logic
let currentSection = 'home';

// Navigation functions
function showHome() {
    hideAllSections();
    document.getElementById('homeSection').classList.remove('hidden');
    currentSection = 'home';
    startCountdown();
    // Close mobile menu if open
    closeMobileMenu();
}

function showCommon() {
    hideAllSections();
    document.getElementById('commonSection').classList.remove('hidden');
    currentSection = 'common';
    showCommonTab('documents');
    // Close mobile menu if open
    closeMobileMenu();
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
    div.className = 'document-card bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200';
    
    const iconClass = doc.icon ? (doc.icon.includes('text-') ? doc.icon : doc.icon + ' text-blue-600') : 'fas fa-file text-blue-600';
    
    div.innerHTML = `
        <div class="flex items-start">
            <div class="text-2xl md:text-3xl ${iconClass} mr-3 md:mr-4 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
                <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2 truncate">${doc.title}</h3>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${doc.description}</p>
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span class="category text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded self-start">${doc.category}</span>
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
    div.className = 'tip-card bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200';
    
    div.innerHTML = `
        <div class="flex items-start">
            <div class="text-xl md:text-2xl ${tip.icon} text-green-600 mr-3 md:mr-4 mt-1 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <h3 class="text-base md:text-lg font-semibold text-gray-800 truncate">${tip.title}</h3>
                    <div class="flex items-center space-x-2 flex-shrink-0">
                        <span class="category text-xs bg-green-100 text-green-800 px-2 py-1 rounded">${tip.category}</span>
                        <button onclick="deleteTip(${index})" 
                                class="text-red-600 hover:text-red-800 text-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="text-gray-600 text-sm md:text-base leading-relaxed">${tip.content}</p>
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
        <div class="bg-white p-4 md:p-4 rounded-lg shadow-md border border-gray-200">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                <h3 class="text-base md:text-lg font-semibold text-gray-800">${event.title}</h3>
                <div class="flex items-center justify-between sm:justify-end gap-2">
                    <div class="text-left sm:text-right">
                        <div class="text-sm text-gray-500">${formatDate(eventDate)}</div>
                        ${event.priority ? `<span class="text-xs ${priorityColor} font-medium">${event.priority}</span>` : ''}
                    </div>
                    <button onclick="deleteTimelineEvent(${index})" 
                            class="text-red-600 hover:text-red-800 text-sm flex-shrink-0">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-600 text-sm md:text-base mb-2">${event.description}</p>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
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
function getUserDisplayName() {
    if (!currentUser) return 'Unknown User';
    
    // Try display name first
    if (currentUser.displayName) {
        return currentUser.displayName;
    }
    
    // Extract name from email
    if (currentUser.email) {
        const emailName = currentUser.email.split('@')[0];
        return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'Erasmus Student';
}

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
    
    // Setup mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Setup modal form handlers
    setupModalForms();
});

// Setup modal form handlers
function setupModalForms() {
    // Document form
    const docForm = document.getElementById('addDocumentForm');
    if (docForm) {
        docForm.addEventListener('submit', handleAddDocument);
    }
    
    // Task form
    const taskForm = document.getElementById('addTaskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', handleAddTask);
    }
    
    // Tip form
    const tipForm = document.getElementById('addTipForm');
    if (tipForm) {
        tipForm.addEventListener('submit', handleAddTip);
    }
    
    // Event form
    const eventForm = document.getElementById('addEventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleAddEvent);
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('bg-opacity-50')) {
            const modals = ['addDocumentModal', 'addTaskModal', 'addTipModal', 'addEventModal'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && !modal.classList.contains('hidden')) {
                    closeModal(modalId);
                }
            });
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = ['addDocumentModal', 'addTaskModal', 'addTipModal', 'addEventModal'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && !modal.classList.contains('hidden')) {
                    closeModal(modalId);
                }
            });
        }
    });
}

// Modal management functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        // Focus on first input
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        // Reset form
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Form submission handlers
async function handleAddDocument(e) {
    e.preventDefault();
    
    const title = document.getElementById('docTitle').value.trim();
    const description = document.getElementById('docDescription').value.trim();
    const url = document.getElementById('docUrl').value.trim();
    const category = document.getElementById('docCategory').value;
    const icon = document.getElementById('docIcon').value;
    
    if (!title || !description || !url || !category) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (!currentUser) {
        showToast('You must be logged in to add documents', 'error');
        return;
    }
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data() || {};
        const documents = commonData.documents || [];
        
        const newDocument = {
            id: Date.now().toString(),
            title,
            description,
            url,
            category,
            icon: icon || 'fas fa-file-alt',
            createdAt: new Date().toISOString(),
            createdBy: getUserDisplayName()
        };
        
        documents.push(newDocument);
        
        await commonRef.set({ ...commonData, documents }, { merge: true });
        await loadDocumentsHub();
        closeModal('addDocumentModal');
        showToast('Document added successfully!', 'success');
    } catch (error) {
        console.error('Error adding document:', error);
        showToast('Failed to add document', 'error');
    }
}

async function handleAddTask(e) {
    e.preventDefault();
    
    const text = document.getElementById('taskText').value.trim();
    const priority = document.getElementById('taskPriority').value;
    
    if (!text) {
        showToast('Please enter a task description', 'error');
        return;
    }
    
    if (!currentUser) {
        showToast('You must be logged in to add tasks', 'error');
        return;
    }
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data() || {};
        const sharedChecklist = commonData.sharedChecklist || [];
        
        const newTask = {
            id: Date.now().toString(),
            text,
            completed: false,
            priority,
            createdAt: new Date().toISOString(),
            createdBy: getUserDisplayName()
        };
        
        sharedChecklist.push(newTask);
        
        await commonRef.set({ ...commonData, sharedChecklist }, { merge: true });
        await loadSharedChecklist();
        closeModal('addTaskModal');
        showToast('Shared task added successfully!', 'success');
    } catch (error) {
        console.error('Error adding shared task:', error);
        showToast('Failed to add shared task', 'error');
    }
}

async function handleAddTip(e) {
    e.preventDefault();
    
    const title = document.getElementById('tipTitle').value.trim();
    const content = document.getElementById('tipContent').value.trim();
    const category = document.getElementById('tipCategory').value;
    const icon = document.getElementById('tipIcon').value;
    
    if (!title || !content || !category) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (!currentUser) {
        showToast('You must be logged in to add tips', 'error');
        return;
    }
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data() || {};
        const tips = commonData.tips || [];
        
        const newTip = {
            id: Date.now().toString(),
            title,
            content,
            category,
            icon: icon || 'fas fa-lightbulb',
            createdAt: new Date().toISOString(),
            createdBy: getUserDisplayName()
        };
        
        tips.push(newTip);
        
        await commonRef.set({ ...commonData, tips }, { merge: true });
        await loadTips();
        closeModal('addTipModal');
        showToast('Tip added successfully!', 'success');
    } catch (error) {
        console.error('Error adding tip:', error);
        showToast('Failed to add tip', 'error');
    }
}

async function handleAddEvent(e) {
    e.preventDefault();
    
    const title = document.getElementById('eventTitle').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const date = document.getElementById('eventDate').value;
    const priority = document.getElementById('eventPriority').value;
    
    if (!title || !description || !date) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    if (!currentUser) {
        showToast('You must be logged in to add events', 'error');
        return;
    }
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data() || {};
        const timeline = commonData.timeline || [];
        
        const newEvent = {
            id: Date.now().toString(),
            title,
            description,
            date,
            priority,
            createdAt: new Date().toISOString(),
            createdBy: getUserDisplayName()
        };
        
        timeline.push(newEvent);
        
        await commonRef.set({ ...commonData, timeline }, { merge: true });
        await loadTimeline();
        closeModal('addEventModal');
        showToast('Timeline event added successfully!', 'success');
    } catch (error) {
        console.error('Error adding timeline event:', error);
        showToast('Failed to add timeline event', 'error');
    }
}

// Mobile menu toggle function
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const icon = mobileMenuBtn.querySelector('i');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        mobileMenu.classList.add('hidden');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const icon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;
    
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
}
