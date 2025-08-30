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

// Documents Functions
async function loadDocumentsHub() {
    try {
        const commonDoc = await db.collection('common').doc('data').get();
        const commonData = commonDoc.data();
        const documents = commonData.documents || [];
        
        const documentsContainer = document.getElementById('documentsHub');
        documentsContainer.innerHTML = '';
        
        documents.forEach(doc => {
            const docElement = createDocumentCard(doc);
            documentsContainer.appendChild(docElement);
        });
    } catch (error) {
        console.error('Error loading documents:', error);
        showToast('Failed to load documents', 'error');
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
        
        tips.forEach(tip => {
            const tipElement = createTipCard(tip);
            tipsContainer.appendChild(tipElement);
        });
    } catch (error) {
        console.error('Error loading tips:', error);
        showToast('Failed to load tips', 'error');
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
        
        timeline.forEach(event => {
            const eventElement = createTimelineEvent(event);
            timelineContainer.appendChild(eventElement);
        });
    } catch (error) {
        console.error('Error loading timeline:', error);
        showToast('Failed to load timeline', 'error');
    }
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
