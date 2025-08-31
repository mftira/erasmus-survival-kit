// Database operations for Firestore

// Personal Checklist Functions
async function loadPersonalChecklist() {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        const checklist = userData.checklist || [];
        
        const checklistContainer = document.getElementById('personalChecklist');
        checklistContainer.innerHTML = '';
        
        checklist.forEach((item, index) => {
            const itemElement = createChecklistItem(item, index, 'personal');
            checklistContainer.appendChild(itemElement);
        });
        
        updatePersonalProgress();
    } catch (error) {
        console.error('Error loading personal checklist:', error);
        showToast('Failed to load personal checklist', 'error');
    }
}

async function addPersonalTask() {
    const taskText = prompt('Enter new task:');
    if (!taskText || !currentUser) return;
    
    try {
        const userRef = db.collection('users').doc(currentUser.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const checklist = userData.checklist || [];
        
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        checklist.push(newTask);
        
        await userRef.update({ checklist });
        await loadPersonalChecklist();
        showToast('Task added successfully!', 'success');
    } catch (error) {
        console.error('Error adding task:', error);
        showToast('Failed to add task', 'error');
    }
}

async function togglePersonalTask(index) {
    if (!currentUser) return;
    
    try {
        const userRef = db.collection('users').doc(currentUser.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const checklist = userData.checklist || [];
        
        if (checklist[index]) {
            checklist[index].completed = !checklist[index].completed;
            await userRef.update({ checklist });
            await loadPersonalChecklist();
        }
    } catch (error) {
        console.error('Error toggling task:', error);
        showToast('Failed to update task', 'error');
    }
}

async function deletePersonalTask(index) {
    if (!currentUser || !confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const userRef = db.collection('users').doc(currentUser.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const checklist = userData.checklist || [];
        
        checklist.splice(index, 1);
        await userRef.update({ checklist });
        await loadPersonalChecklist();
        showToast('Task deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Failed to delete task', 'error');
    }
}

// Notes Functions
async function loadPersonalNotes() {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        const notes = userData.notes || '';
        
        document.getElementById('personalNotes').value = notes;
    } catch (error) {
        console.error('Error loading notes:', error);
        showToast('Failed to load notes', 'error');
    }
}

async function saveNotes() {
    if (!currentUser) return;
    
    const notes = document.getElementById('personalNotes').value;
    
    try {
        await db.collection('users').doc(currentUser.uid).update({ notes });
        showToast('Notes saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving notes:', error);
        showToast('Failed to save notes', 'error');
    }
}

// Shared Checklist Functions
async function loadSharedChecklist() {
    try {
        const commonDoc = await db.collection('common').doc('data').get();
        const commonData = commonDoc.data();
        const sharedChecklist = commonData.sharedChecklist || [];
        
        const checklistContainer = document.getElementById('sharedChecklist');
        checklistContainer.innerHTML = '';
        
        sharedChecklist.forEach((item, index) => {
            const itemElement = createChecklistItem(item, index, 'shared');
            checklistContainer.appendChild(itemElement);
        });
        
        updateSharedProgress(sharedChecklist);
    } catch (error) {
        console.error('Error loading shared checklist:', error);
        showToast('Failed to load shared checklist', 'error');
    }
}

async function addSharedTask() {
    const taskText = prompt('Enter new shared task:');
    if (!taskText || !currentUser) return;
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data() || {};
        const sharedChecklist = commonData.sharedChecklist || [];
        
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.email
        };
        
        sharedChecklist.push(newTask);
        
        await commonRef.set({ ...commonData, sharedChecklist }, { merge: true });
        await loadSharedChecklist();
        showToast('Shared task added successfully!', 'success');
    } catch (error) {
        console.error('Error adding shared task:', error);
        showToast('Failed to add shared task', 'error');
    }
}

async function toggleSharedTask(index) {
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data();
        const sharedChecklist = commonData.sharedChecklist || [];
        
        if (sharedChecklist[index]) {
            sharedChecklist[index].completed = !sharedChecklist[index].completed;
            await commonRef.update({ sharedChecklist });
            await loadSharedChecklist();
        }
    } catch (error) {
        console.error('Error toggling shared task:', error);
        showToast('Failed to update shared task', 'error');
    }
}

async function deleteSharedTask(index) {
    if (!currentUser || !confirm('Are you sure you want to delete this shared task?')) return;
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data();
        const sharedChecklist = commonData.sharedChecklist || [];
        
        sharedChecklist.splice(index, 1);
        await commonRef.update({ sharedChecklist });
        await loadSharedChecklist();
        showToast('Shared task deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting shared task:', error);
        showToast('Failed to delete shared task', 'error');
    }
}

// Documents Functions
async function loadDocumentsHub() {
    try {
        const commonDoc = await db.collection('common').doc('data').get();
        const commonData = commonDoc.data();
        const documents = commonData.documents || [];
        
        const documentsContainer = document.getElementById('documentsHub');
        documentsContainer.innerHTML = '';
        
        documents.forEach((doc, index) => {
            const docElement = createDocumentCard(doc, index);
            documentsContainer.appendChild(docElement);
        });
    } catch (error) {
        console.error('Error loading documents:', error);
        showToast('Failed to load documents', 'error');
    }
}

async function addDocument() {
    const title = prompt('Enter document title:');
    if (!title) return;
    
    const description = prompt('Enter document description:');
    if (!description) return;
    
    const url = prompt('Enter document URL:');
    if (!url) return;
    
    const category = prompt('Enter category (e.g., Visa, Housing, Academic):');
    if (!category) return;
    
    const iconOptions = 'Available icons: fas fa-passport, fas fa-home, fas fa-university, fas fa-file-alt, fas fa-id-card, fas fa-plane';
    const icon = prompt(`Enter icon class (${iconOptions}):`);
    
    if (!currentUser) return;
    
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
            createdBy: currentUser.email
        };
        
        documents.push(newDocument);
        
        await commonRef.set({ ...commonData, documents }, { merge: true });
        await loadDocumentsHub();
        showToast('Document added successfully!', 'success');
    } catch (error) {
        console.error('Error adding document:', error);
        showToast('Failed to add document', 'error');
    }
}

async function deleteDocument(index) {
    if (!currentUser || !confirm('Are you sure you want to delete this document?')) return;
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data();
        const documents = commonData.documents || [];
        
        documents.splice(index, 1);
        await commonRef.update({ documents });
        await loadDocumentsHub();
        showToast('Document deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting document:', error);
        showToast('Failed to delete document', 'error');
    }
}

// Tips Functions
async function loadTips() {
    try {
        const commonDoc = await db.collection('common').doc('data').get();
        const commonData = commonDoc.data();
        const tips = commonData.tips || [];
        
        const tipsContainer = document.getElementById('tipsContainer');
        tipsContainer.innerHTML = '';
        
        tips.forEach((tip, index) => {
            const tipElement = createTipCard(tip, index);
            tipsContainer.appendChild(tipElement);
        });
    } catch (error) {
        console.error('Error loading tips:', error);
        showToast('Failed to load tips', 'error');
    }
}

async function addTip() {
    const title = prompt('Enter tip title:');
    if (!title) return;
    
    const content = prompt('Enter tip content:');
    if (!content) return;
    
    const category = prompt('Enter category (e.g., Food, Transport, Social, Academic):');
    if (!category) return;
    
    const iconOptions = 'Available icons: fas fa-utensils, fas fa-bus, fas fa-users, fas fa-book, fas fa-lightbulb, fas fa-heart';
    const icon = prompt(`Enter icon class (${iconOptions}):`);
    
    if (!currentUser) return;
    
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
            createdBy: currentUser.email
        };
        
        tips.push(newTip);
        
        await commonRef.set({ ...commonData, tips }, { merge: true });
        await loadTips();
        showToast('Tip added successfully!', 'success');
    } catch (error) {
        console.error('Error adding tip:', error);
        showToast('Failed to add tip', 'error');
    }
}

async function deleteTip(index) {
    if (!currentUser || !confirm('Are you sure you want to delete this tip?')) return;
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data();
        const tips = commonData.tips || [];
        
        tips.splice(index, 1);
        await commonRef.update({ tips });
        await loadTips();
        showToast('Tip deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting tip:', error);
        showToast('Failed to delete tip', 'error');
    }
}

// Timeline Functions
async function loadTimeline() {
    try {
        const commonDoc = await db.collection('common').doc('data').get();
        const commonData = commonDoc.data();
        const timeline = commonData.timeline || [];
        
        // Sort timeline by date
        timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const timelineContainer = document.getElementById('timelineContainer');
        timelineContainer.innerHTML = '';
        
        timeline.forEach((event, index) => {
            const eventElement = createTimelineEvent(event, index);
            timelineContainer.appendChild(eventElement);
        });
    } catch (error) {
        console.error('Error loading timeline:', error);
        showToast('Failed to load timeline', 'error');
    }
}

async function addTimelineEvent() {
    const title = prompt('Enter event title:');
    if (!title) return;
    
    const description = prompt('Enter event description:');
    if (!description) return;
    
    const date = prompt('Enter event date (YYYY-MM-DD):');
    if (!date || !isValidDate(date)) {
        alert('Please enter a valid date in YYYY-MM-DD format');
        return;
    }
    
    const priority = prompt('Enter priority (high, medium, low):') || 'medium';
    if (!['high', 'medium', 'low'].includes(priority)) {
        alert('Priority must be high, medium, or low');
        return;
    }
    
    if (!currentUser) return;
    
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
            createdBy: currentUser.email
        };
        
        timeline.push(newEvent);
        
        await commonRef.set({ ...commonData, timeline }, { merge: true });
        await loadTimeline();
        showToast('Timeline event added successfully!', 'success');
    } catch (error) {
        console.error('Error adding timeline event:', error);
        showToast('Failed to add timeline event', 'error');
    }
}

async function deleteTimelineEvent(index) {
    if (!currentUser || !confirm('Are you sure you want to delete this timeline event?')) return;
    
    try {
        const commonRef = db.collection('common').doc('data');
        const commonDoc = await commonRef.get();
        const commonData = commonDoc.data();
        const timeline = commonData.timeline || [];
        
        timeline.splice(index, 1);
        await commonRef.update({ timeline });
        await loadTimeline();
        showToast('Timeline event deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting timeline event:', error);
        showToast('Failed to delete timeline event', 'error');
    }
}

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Search Functions
function setupSearchFunctionality() {
    // Documents search
    const documentsSearch = document.getElementById('documentsSearch');
    if (documentsSearch) {
        documentsSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const documentCards = document.querySelectorAll('#documentsHub .document-card');
            
            documentCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Tips search
    const tipsSearch = document.getElementById('tipsSearch');
    if (tipsSearch) {
        tipsSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const tipCards = document.querySelectorAll('#tipsContainer .tip-card');
            
            tipCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}
