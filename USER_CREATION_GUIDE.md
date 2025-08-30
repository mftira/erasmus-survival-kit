# User Account Creation Guide

## Creating Accounts for Your Erasmus Team

Since you'll be managing user accounts yourself, here's a step-by-step guide to create accounts for your 5 colleagues:

### 1. Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Erasmus Survival Kit project
3. Navigate to **Authentication** > **Users**

### 2. Create User Accounts

For each of your 5 colleagues:

1. Click **"Add user"** button
2. Fill in the details:
   - **Email**: Use their actual email address
   - **Password**: Create a secure password (suggestion: ErasmusXXXX where XXXX is a 4-digit number)
   - **User UID**: Leave empty (Firebase will generate automatically)
3. Click **"Add user"**

### 3. Suggested Account Structure

Here's a suggested naming convention for easy management:

```
colleague1@yourdomain.com  |  Erasmus2025!
colleague2@yourdomain.com  |  Erasmus2026!
colleague3@yourdomain.com  |  Erasmus2027!
colleague4@yourdomain.com  |  Erasmus2028!
colleague5@yourdomain.com  |  Erasmus2029!
```

Or use their actual emails:
```
john.doe@email.com    |  ErasmusJohn123
jane.smith@email.com  |  ErasmusJane456
...
```

### 4. Share Credentials Securely

**Via Messenger (as you mentioned):**

Create a message template like this:

```
🎓 Erasmus Survival Kit Access

Hey [Name]! Your Erasmus app is ready!

🌐 Website: https://yourusername.github.io/erasmus-survival-kit
📧 Email: [their-email]
🔑 Password: [their-password]

This app will help us manage our Erasmus journey together - personal tasks, shared checklists, documents, and tips!

Questions? Just ask! 😊
```

### 5. Security Best Practices

- **Use strong passwords** (at least 8 characters with mix of letters, numbers, symbols)
- **Don't reuse passwords** from other accounts
- **Tell users to change their password** after first login (they can do this in most browsers)
- **Keep a secure backup** of the credentials (in a password manager or encrypted file)

### 6. Test the Accounts

Before sharing:
1. Try logging in with each account
2. Verify they can access both personal and shared sections
3. Test basic functionality (adding tasks, saving notes)

### 7. User Instructions

Send this to your colleagues along with their credentials:

```
Welcome to the Erasmus Survival Kit! 🎓

This app helps you manage your Erasmus experience:

🔵 PERSONAL DASHBOARD:
- Track your personal checklist
- Save private notes
- Upload your documents (passport, visa, etc.)

🟢 COMMON SECTION:
- View shared group tasks
- Access important Erasmus documents
- Get tips for daily life abroad
- Check timeline with important dates

📱 The app works great on phones too!

💡 TIP: Bookmark the website on your phone's home screen for quick access.
```

### 8. Managing Users Later

- **To reset a password**: Go to Authentication > Users, click on the user, then "Reset password"
- **To disable a user**: Click on the user and select "Disable user"
- **To delete a user**: Click on the user and select "Delete user" (this will also delete their data)

### 9. Monitoring Usage

You can see user activity in:
- **Authentication > Users**: Last sign-in times
- **Firestore Database**: User data and activity
- **Firebase Console > Analytics**: Overall app usage (if enabled)

---

**Need Help?**
- Check the main README.md for troubleshooting
- Refer to FIREBASE_SETUP.md for detailed Firebase configuration
- Firebase documentation: https://firebase.google.com/docs/auth
