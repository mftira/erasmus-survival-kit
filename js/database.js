// Database operations for Firestore

// Shared Checklist Functions
async function loadSharedChecklist() {
    try {
        const commonDoc = await db.collection('common').doc('data').get();
        const commonData = commonDoc.data();
        const sharedChecklist = commonData.sharedChecklist || [];
        
        const checklistContainer = document.getElementById('sharedChecklist');
        checklistContainer.innerHTML = '';
        
        sharedChecklist.forEach((item, index) => {
            const itemElement = createChecklistItem(item, index);
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
