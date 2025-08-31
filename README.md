# Erasmus Survival Kit

A comprehensive web application designed for Erasmus students to manage their journey abroad. Features personal dashboards, shared resources, and timeline tracking.

🌐 **Live App:** https://mftira.github.io/erasmus-survival-kit

## 🌟 Features

### Authentication
- Email/Password authentication with Firebase Auth
- Pre-created accounts for team members
- Secure user management and session handling

### Personal Dashboard
- ✅ Personal checklist with progress tracking
- 📝 Notes section for personal thoughts
- 📊 Progress visualization

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

## 📁 Project Structure

```
erasmus-track/
├── index.html                    # Main application
├── manifest.json                 # PWA manifest
├── README.md                     # This file
├── .gitignore                    # Git ignore rules
├── css/
│   └── styles.css               # Custom CSS styles
└── js/
    ├── firebase-config-production.js  # Production Firebase config
    ├── firebase-config-actual.js      # Local Firebase config (not committed)
    ├── auth.js                        # Authentication logic
    ├── database.js                    # Database operations
    └── app.js                         # Main application logic
```

## 🚀 Deployment Status

✅ **DEPLOYED AND LIVE:** https://mftira.github.io/erasmus-survival-kit

The app is fully functional with:
- Firebase Authentication configured
- Firestore Database connected
- All features working
- Mobile-optimized interface

## 👥 User Management

The app supports 5 team members, each with:
- Personal checklist and notes
- Access to shared resources
- Real-time synchronization

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
2. **Authentication failing**: Ensure user accounts are created in Firebase
3. **Database not loading**: Check Firestore rules and user permissions

### Debug Mode
Open browser developer tools (F12) and check the Console tab for error messages.

## 📱 Mobile Optimization

The app is fully responsive and optimized for mobile devices. All features work seamlessly on phones and tablets.

## 🔒 Security

- User data is isolated per user ID
- Firestore security rules prevent unauthorized access
- Firebase configuration properly secured

## 🎯 Ready-to-Use Content

### Pre-loaded Features
- **8 essential Erasmus documents** (dorm contracts, bank forms, insurance guides, etc.)
- **8 shared tasks** (university registration, bank account, SIM card, etc.)
- **6 helpful tips** (groceries, transport, phone plans, emergencies, etc.)
- **10 timeline events** (arrival, orientation, deadlines, exams, etc.)
- **Countdown timer** to departure (September 22, 2025)

## 🌍 Team Usage

Your Erasmus team can now:
1. **Access the app** at https://mftira.github.io/erasmus-survival-kit
2. **Sign in** with provided credentials
3. **Manage personal tasks** and notes
4. **Collaborate** on shared checklists
5. **Stay organized** throughout the Erasmus journey

## 📄 License

This project is open source and available under the MIT License.

---

**🎓 Ready for your Erasmus adventure!** The app is deployed, functional, and ready for your team to use.
