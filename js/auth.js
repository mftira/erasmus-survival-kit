// Authentication Management
let currentUser = null;

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        showMainContent();
        initializeUserData();
    } else {
        currentUser = null;
        showLoginSection();
    }
});

// Show login section
function showLoginSection() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('navbar').classList.add('hidden');
}

// Show main content
function showMainContent() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('navbar').classList.remove('hidden');
    showHome();
}

// Email/Password Authentication
document.getElementById('emailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast('Successfully signed in!', 'success');
    } catch (error) {
        console.error('Email auth error:', error);
        let errorMessage = 'Authentication failed';
        
        // Provide user-friendly error messages
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email. Please check your credentials.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
            default:
                errorMessage = 'Login failed. Please check your credentials and try again.';
        }
        
        showToast(errorMessage, 'error');
    }
});

// Logout
async function logout() {
    try {
        await auth.signOut();
        showToast('Successfully signed out!', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Failed to sign out: ' + error.message, 'error');
    }
}

// Initialize user data when they first sign in
async function initializeUserData() {
    if (!currentUser) return;
    
    try {
        // Check if user document exists
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        
        if (!userDoc.exists) {
            // Create initial user document with minimal data
            await db.collection('users').doc(currentUser.uid).set({
                email: currentUser.email,
                displayName: currentUser.displayName || 'Erasmus Student',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('User document created');
        }
        
        // Initialize common data if it doesn't exist
        await initializeCommonData();
        
    } catch (error) {
        console.error('Error initializing user data:', error);
        showToast('Error setting up your account. Please try again.', 'error');
    }
}

// Initialize common data (run once for the app)
async function initializeCommonData() {
    try {
        // Check if common data exists
        const commonDoc = await db.collection('common').doc('data').get();
        
        if (!commonDoc.exists) {
            // Create initial common data
            await db.collection('common').doc('data').set({
                sharedChecklist: [
                    { id: 'register-uni', text: 'Register at university', completed: false, priority: 'high' },
                    { id: 'open-bank', text: 'Open bank account', completed: false, priority: 'high' },
                    { id: 'health-insurance', text: 'Arrange health insurance', completed: false, priority: 'high' },
                    { id: 'housing-contract', text: 'Sign housing contract', completed: false, priority: 'medium' },
                    { id: 'sim-card', text: 'Get local SIM card', completed: false, priority: 'medium' },
                    { id: 'transport-card', text: 'Get public transport card', completed: false, priority: 'low' },
                    { id: 'student-id', text: 'Obtain student ID card', completed: false, priority: 'medium' },
                    { id: 'library-access', text: 'Register for library access', completed: false, priority: 'low' }
                ],
                documents: [
                    {
                        id: 'dorm-contract',
                        title: 'Dormitory Contract Template',
                        description: 'Standard contract template for university dormitories',
                        category: 'Housing',
                        url: '#',
                        icon: 'fas fa-home'
                    },
                    {
                        id: 'bank-forms',
                        title: 'Bank Account Opening Forms',
                        description: 'Required forms for opening a student bank account',
                        category: 'Banking',
                        url: '#',
                        icon: 'fas fa-university'
                    },
                    {
                        id: 'insurance-guide',
                        title: 'Health Insurance Guide',
                        description: 'Complete guide to health insurance options',
                        category: 'Health',
                        url: '#',
                        icon: 'fas fa-heart'
                    },
                    {
                        id: 'uni-forms',
                        title: 'University Registration Forms',
                        description: 'Forms required for university registration',
                        category: 'University',
                        url: '#',
                        icon: 'fas fa-graduation-cap'
                    },
                    {
                        id: 'visa-info',
                        title: 'Visa Information',
                        description: 'Visa requirements and application process',
                        category: 'Legal',
                        url: '#',
                        icon: 'fas fa-passport'
                    },
                    {
                        id: 'tax-info',
                        title: 'Tax Information for Students',
                        description: 'Tax obligations and benefits for international students',
                        category: 'Legal',
                        url: '#',
                        icon: 'fas fa-file-invoice'
                    }
                ],
                tips: [
                    {
                        id: 'groceries',
                        title: 'Grocery Shopping',
                        content: 'Best supermarkets: Lidl (budget), Rewe (quality), Aldi (basics). Shop on Sundays before 8 PM as most stores close. Look for student discounts!',
                        category: 'Daily Life',
                        icon: 'fas fa-shopping-cart'
                    },
                    {
                        id: 'transport',
                        title: 'Public Transport',
                        content: 'Get a semester ticket from your university - it often covers the entire city and region. Download the local transport app for real-time schedules.',
                        category: 'Transport',
                        icon: 'fas fa-bus'
                    },
                    {
                        id: 'sim-cards',
                        title: 'Mobile Phone Plans',
                        content: 'Consider prepaid plans from Aldi Talk, O2, or Telekom. Compare data packages. EU roaming is usually included.',
                        category: 'Communication',
                        icon: 'fas fa-mobile-alt'
                    },
                    {
                        id: 'banking',
                        title: 'Banking Tips',
                        content: 'Most banks offer free student accounts. Popular choices: DKB, ING, Commerzbank. Avoid fees by using the right ATMs.',
                        category: 'Banking',
                        icon: 'fas fa-credit-card'
                    },
                    {
                        id: 'emergencies',
                        title: 'Emergency Contacts',
                        content: 'Police: 110, Fire/Medical: 112, Poison Control: 19240. Save your insurance emergency number and university contact.',
                        category: 'Safety',
                        icon: 'fas fa-exclamation-triangle'
                    },
                    {
                        id: 'social',
                        title: 'Making Friends',
                        content: 'Join ESN (Erasmus Student Network), university sports clubs, language tandems. Attend welcome week events and international student meetups.',
                        category: 'Social',
                        icon: 'fas fa-users'
                    }
                ],
                timeline: [
                    {
                        id: 'arrival',
                        date: '2025-09-22',
                        title: 'Arrival Day',
                        description: 'Land in your destination city',
                        status: 'upcoming',
                        priority: 'high'
                    },
                    {
                        id: 'orientation',
                        date: '2025-09-23',
                        title: 'Orientation Week Begins',
                        description: 'University orientation and welcome activities',
                        status: 'upcoming',
                        priority: 'high'
                    },
                    {
                        id: 'registration',
                        date: '2025-09-25',
                        title: 'University Registration Deadline',
                        description: 'Complete all registration formalities',
                        status: 'upcoming',
                        priority: 'high'
                    },
                    {
                        id: 'classes-start',
                        date: '2025-10-01',
                        title: 'Classes Begin',
                        description: 'First day of academic semester',
                        status: 'upcoming',
                        priority: 'high'
                    },
                    {
                        id: 'housing-deadline',
                        date: '2025-10-05',
                        title: 'Housing Contract Deadline',
                        description: 'Final deadline for housing arrangements',
                        status: 'upcoming',
                        priority: 'medium'
                    },
                    {
                        id: 'midterm',
                        date: '2025-11-15',
                        title: 'Midterm Period',
                        description: 'Midterm examinations period',
                        status: 'upcoming',
                        priority: 'medium'
                    },
                    {
                        id: 'winter-break',
                        date: '2025-12-20',
                        title: 'Winter Break Begins',
                        description: 'Winter holiday period starts',
                        status: 'upcoming',
                        priority: 'low'
                    },
                    {
                        id: 'spring-semester',
                        date: '2026-01-15',
                        title: 'Spring Semester Starts',
                        description: 'Beginning of spring semester',
                        status: 'upcoming',
                        priority: 'medium'
                    },
                    {
                        id: 'finals',
                        date: '2026-05-20',
                        title: 'Final Examinations',
                        description: 'Final exam period',
                        status: 'upcoming',
                        priority: 'high'
                    },
                    {
                        id: 'graduation',
                        date: '2026-06-30',
                        title: 'Program Completion',
                        description: 'End of Erasmus program',
                        status: 'upcoming',
                        priority: 'high'
                    }
                ]
            });
            
            console.log('Common data initialized');
        }
    } catch (error) {
        console.error('Error initializing common data:', error);
    }
}
