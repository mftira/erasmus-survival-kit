# Firebase Setup Guide for Erasmus Survival Kit

## Step-by-Step Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `erasmus-survival-kit` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### 2. Enable Authentication

1. In the Firebase Console, navigate to **Authentication**
2. Click on **Sign-in method** tab
3. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

4. In the **Settings** tab, add authorized domains:
   - `localhost` (for local development)
   - Your GitHub Pages domain: `yourusername.github.io`

#### Create User Accounts

1. Go to **Authentication** > **Users** tab
2. Click "Add user" to create accounts for your 5 colleagues
3. For each user:
   - Enter their email address
   - Create a secure password
   - Click "Add user"
4. Share the login credentials with your colleagues via messenger

### 3. Set up Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location (select closest to your users)
5. Click "Done"

#### Configure Firestore Rules

1. Go to **Rules** tab in Firestore
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow all authenticated users to read and write common data
    match /common/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

### 4. Get Configuration Keys

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web app (</> icon)
4. Enter app nickname: "Erasmus Survival Kit"
5. Don't check "Set up Firebase Hosting"
6. Click "Register app"
7. Copy the configuration object

### 5. Update Your Code

1. Open `js/firebase-config.js`
2. Replace the placeholder config with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...", // Your actual API key
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

## Testing Your Setup

### Local Testing

1. Open `index.html` in a web browser
2. Try signing in with the created user accounts
3. Check if you can:
   - Add personal tasks
   - Save notes
   - View common sections

### Firebase Console Verification

1. **Authentication**: Check if users appear in Authentication > Users
2. **Firestore**: Check if data appears in Firestore Database

## Common Issues and Solutions

### Issue: "Firebase not defined"
**Solution**: Check that Firebase scripts are loaded in `index.html`

### Issue: "Permission denied" errors
**Solution**: 
- Verify Firestore rules are set correctly
- Ensure user is authenticated before accessing data

### Issue: Email/Password login not working
**Solution**:
- Verify user accounts are created in Firebase Authentication
- Check that Email/Password provider is enabled
- Ensure correct credentials are being used

## Production Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Authentication providers enabled
- [ ] Firestore rules published
- [ ] Configuration keys updated in code
- [ ] GitHub Pages domain added to authorized domains
- [ ] Local testing completed successfully

## Security Best Practices

1. **Never commit Firebase config to public repos** (though config keys are considered public in web apps)
2. **Use proper Firestore rules** to secure user data
3. **Implement proper error handling** for failed requests
4. **Validate data** before storing in Firestore
5. **Monitor usage** in Firebase Console

## Firestore Data Structure

The app will create the following structure:

```
/users/{userId}
  ├── checklist: array
  ├── notes: string
  ├── email: string
  ├── displayName: string
  └── createdAt: timestamp

/common/data
  ├── sharedChecklist: array
  ├── documents: array
  ├── tips: array
  └── timeline: array
```

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase Console for data/authentication issues
3. Ensure all Firebase services are enabled
4. Check that rules are properly configured

Firebase documentation: https://firebase.google.com/docs
