# Erasmus Survival Kit

A comprehensive web application designed for Erasmus students to manage their journey abroad. Features personal dashboards, shared res2. **Database not loading**: Check Firestore rules and user permissionsrces, document management, and timeline tracking.

## 🌟 Features

### Authentication
- Email/Password authentication with Firebase Auth
- Pre-created accounts for team members
- Secure user management and session handling

### Personal Dashboard
- ✅ Personal checklist with progress tracking
- 📝 Notes section for personal thoughts
-  Progress visualization

### Common Section
- 📋 Shared checklist for group tasks
- 📚 Documents hub with essential Erasmus papers
- 💡 Tips & tricks for daily life abroad
- 📅 Timeline with important dates and deadlines

### Design
- 📱 Mobile-responsive design with Tailwind CSS
- 🎨 Clean, minimal interface
- 🔍 Search functionality
- 🌈 Color-coded sections (Blue for personal, Green for common)

## 🚀 Getting Started

### Prerequisites
- Firebase account
- GitHub account (for GitHub Pages hosting)
- Basic knowledge of HTML, CSS, JavaScript

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Follow the setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable Email/Password provider
   - Create user accounts for your 5 colleagues
   - Share credentials via messenger

3. **Set up Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

4. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Add a web app and copy the config object

### Configuration

1. **Update Firebase Config**
   - Open `js/firebase-config.js`
   - Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Common data is readable by all authenticated users
    // Only authenticated users can write to shared checklist
    match /common/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 📁 Project Structure

```
erasmus-track/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom CSS styles
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── auth.js             # Authentication logic
│   ├── database.js         # Database operations
│   └── app.js              # Main application logic
├── README.md
└── FIREBASE_SETUP.md
```

## 🚀 Deployment to GitHub Pages

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/erasmus-survival-kit.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to Pages section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save

3. **Update Firebase Authorized Domains**
   - Add your GitHub Pages URL to Firebase Auth authorized domains
   - Format: `yourusername.github.io`

## 👥 User Management

The app is designed for 5 users. Each user will have:
- Personal checklist and notes
- Access to shared resources

## 🔧 Customization

### Adding New Documents
Edit the `documents` array in `js/auth.js` `initializeCommonData()` function.

### Adding New Tips
Edit the `tips` array in `js/auth.js` `initializeCommonData()` function.

### Modifying Timeline
Edit the `timeline` array in `js/auth.js` `initializeCommonData()` function.

### Changing Departure Date
Update the date in `js/app.js` `startCountdown()` function.

## 🐛 Troubleshooting

### Common Issues
1. **Firebase not working**: Check console for errors, verify config is correct
2. **Authentication failing**: Ensure domains are authorized in Firebase
3. **Database not loading**: Check Firestore rules and user permissions
4. **Upload not working**: Verify Storage rules and Firebase Storage is enabled

### Debug Mode
Open browser developer tools (F12) and check the Console tab for error messages.

## 📱 Mobile Optimization

The app is fully responsive and optimized for mobile devices. All features work seamlessly on phones and tablets.

## 🔒 Security

- User data is isolated per user ID
- Firestore security rules prevent unauthorized access
- Shared data is read-only protected

## 🎯 Future Enhancements

- Push notifications for deadline reminders
- PDF generation for checklists
- Multi-language support
- Offline functionality
- Chat feature between group members

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📄 License

This project is open source and available under the MIT License.
