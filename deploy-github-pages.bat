@echo off
echo 🚀 GitHub Pages Deployment with Secure Firebase Config
echo ====================================================

REM Check if firebase config exists
if not exist "js\firebase-config-actual.js" (
    echo ❌ Firebase configuration not found!
    echo Please run setup-firebase-config.bat first.
    pause
    exit /b 1
)

echo.
echo 📋 Deployment Options:
echo 1. Deploy with environment variables (Recommended)
echo 2. Deploy with manual config replacement
echo.
set /p choice="Choose option (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo 🔧 Creating deployment version with environment variables...
    
    REM Create a temporary deployment directory
    if exist "deploy-temp" rmdir /s /q "deploy-temp"
    mkdir "deploy-temp"
    
    REM Copy all files except firebase-config-actual.js
    xcopy /E /I /Q . "deploy-temp" /EXCLUDE:deploy-exclude.txt
    
    REM Create environment-based config
    (
        echo // Firebase Configuration for GitHub Pages
        echo // Using environment variables for security
        echo const firebaseConfig = {
        echo     apiKey: window.FIREBASE_API_KEY ^|^| "demo-api-key",
        echo     authDomain: window.FIREBASE_AUTH_DOMAIN ^|^| "demo-project.firebaseapp.com", 
        echo     projectId: window.FIREBASE_PROJECT_ID ^|^| "demo-project",
        echo     storageBucket: window.FIREBASE_STORAGE_BUCKET ^|^| "demo-project.appspot.com",
        echo     messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID ^|^| "123456789",
        echo     appId: window.FIREBASE_APP_ID ^|^| "demo-app-id"
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
    ) > "deploy-temp\js\firebase-config-actual.js"
    
    echo ✅ Environment-based config created!
    echo.
    echo 📝 Manual steps for GitHub Pages:
    echo 1. Go to your repository settings
    echo 2. Navigate to Pages section  
    echo 3. Set up GitHub Pages
    echo 4. Add the following to your repository secrets:
    echo    - FIREBASE_API_KEY
    echo    - FIREBASE_AUTH_DOMAIN  
    echo    - FIREBASE_PROJECT_ID
    echo    - FIREBASE_STORAGE_BUCKET
    echo    - FIREBASE_MESSAGING_SENDER_ID
    echo    - FIREBASE_APP_ID
    echo.
    
) else if "%choice%"=="2" (
    echo.
    echo ⚠️  WARNING: This will temporarily include your Firebase config in the commit.
    echo You should change your Firebase keys after deployment for security.
    echo.
    set /p confirm="Continue? (y/n): "
    if /i not "%confirm%"=="y" (
        echo Deployment cancelled.
        pause
        exit /b 0
    )
    
    REM Temporarily copy actual config for deployment
    copy "js\firebase-config-actual.js" "js\firebase-config-deploy.js"
    
    echo 🚀 Deploying to GitHub...
)

REM Continue with git operations
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
    git branch -M main
) else (
    echo ✅ Git repository already initialized
)

REM Check if remote origin exists  
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Please add your GitHub repository as remote origin:
    echo     git remote add origin https://github.com/yourusername/erasmus-survival-kit.git
    echo.
    set /p created="Have you created a GitHub repository? (y/n): "
    if /i "%created%"=="y" (
        set /p repo_url="Enter your GitHub repository URL: "
        git remote add origin "%repo_url%"
        echo ✅ Remote origin added
    ) else (
        echo ❌ Please create a GitHub repository first and run this script again
        pause
        exit /b 1
    )
) else (
    echo ✅ Remote origin already configured
)

REM Stage files (excluding sensitive config)
echo 📦 Staging files for commit...
git add .
git reset js/firebase-config-actual.js

REM Commit changes
echo 💾 Committing changes...
git diff --staged --quiet
if errorlevel 1 (
    git commit -m "Deploy Erasmus Survival Kit (secure config)"
    echo ✅ Changes committed
) else (
    echo ⚠️  No changes to commit
)

REM Push to main branch
echo 🚀 Pushing to GitHub...
git push -u origin main

if "%choice%"=="2" (
    REM Clean up temporary deployment file
    if exist "js\firebase-config-deploy.js" del "js\firebase-config-deploy.js"
    echo.
    echo ⚠️  SECURITY REMINDER:
    echo Your Firebase config was temporarily included in the deployment.
    echo Consider rotating your Firebase keys for better security.
    echo Go to Firebase Console > Project Settings > Service accounts > Generate new private key
)

echo.
echo 🎉 Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Go to your GitHub repository settings
echo 2. Navigate to Pages section
echo 3. Select 'Deploy from a branch'
echo 4. Choose 'main' branch and '/ (root)' folder
echo 5. Save the settings
echo.
echo 🔗 Your app will be available at:
echo    https://yourusername.github.io/erasmus-survival-kit
echo.
pause
