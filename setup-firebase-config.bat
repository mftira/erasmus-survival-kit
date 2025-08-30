@echo off
echo 🔧 Erasmus Survival Kit - Firebase Config Setup
echo ===============================================

echo.
echo This script will help you set up Firebase configuration securely.
echo.

REM Check if actual config exists
if exist "js\firebase-config-actual.js" (
    echo ✅ Firebase config file already exists
    set /p replace="Do you want to replace it with new config? (y/n): "
    if /i not "%replace%"=="y" (
        echo Setup cancelled.
        pause
        exit /b 0
    )
)

echo.
echo 📋 Please enter your Firebase configuration details:
echo (You can find these in Firebase Console > Project Settings > General > Your apps)
echo.

set /p apiKey="Enter API Key: "
set /p authDomain="Enter Auth Domain (project-id.firebaseapp.com): "
set /p projectId="Enter Project ID: "
set /p storageBucket="Enter Storage Bucket (project-id.firebasestorage.app): "
set /p messagingSenderId="Enter Messaging Sender ID: "
set /p appId="Enter App ID: "

echo.
echo 📝 Creating firebase-config-actual.js...

(
echo // Firebase Configuration - ACTUAL KEYS
echo // This file contains your real Firebase configuration
echo // DO NOT COMMIT THIS FILE TO GIT
echo.
echo const firebaseConfig = {
echo     apiKey: "%apiKey%",
echo     authDomain: "%authDomain%",
echo     projectId: "%projectId%",
echo     storageBucket: "%storageBucket%",
echo     messagingSenderId: "%messagingSenderId%",
echo     appId: "%appId%"
echo };
echo.
echo // Initialize Firebase
echo firebase.initializeApp^(firebaseConfig^);
echo.
echo // Initialize Firebase services
echo const auth = firebase.auth^(^);
echo const db = firebase.firestore^(^);
echo.
echo // Export for use in other files
echo window.firebaseServices = {
echo     auth,
echo     db
echo };
) > "js\firebase-config-actual.js"

echo ✅ Configuration file created successfully!
echo.
echo ⚠️  IMPORTANT SECURITY NOTES:
echo - The file js\firebase-config-actual.js contains your real Firebase keys
echo - This file is excluded from Git commits (.gitignore)
echo - Never share this file publicly
echo - For deployment, you'll need to upload this file manually to your server
echo.
echo 🚀 Your app is now ready to use!
echo.
pause
