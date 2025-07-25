# Firebase Setup Guide

This application now uses Firebase for authentication and data storage. Follow these steps to set up Firebase for your project.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Follow the setup wizard to create your project

## 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Enable **Email/Password** authentication
4. Save your changes

## 3. Set up Firestore Database

1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** for now (you can configure security rules later)
4. Select a location for your database
5. Click **Done**

## 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon in the left sidebar)
2. Scroll down to the **Your apps** section
3. Click on **Web app** icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Replace the placeholder values with your actual Firebase configuration:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 6. Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Go to the registration page and create a new account
3. Try logging in with your new account
4. Create a story post to test Firestore integration

## Features Implemented

✅ **Firebase Authentication**: Users can register and login using email/password
✅ **Firestore Integration**: Stories are saved to Firestore database
✅ **Auto-sync**: User authentication state is automatically managed
✅ **Real-time Data**: Posts are fetched from Firestore in real-time

## What happens when you click "Login"
- The app redirects to the login page
- Users enter their email and password
- Firebase Authentication verifies the credentials
- Upon successful login, users are redirected to the dashboard

## What happens when you post a story
- The story data is collected from the form
- Firebase Authentication verifies the user is logged in
- The story is saved to Firestore with a timestamp
- The user is redirected to the dashboard to see their post

## Security Notes

- The app is currently in development mode with test security rules
- For production, you should configure proper Firestore security rules
- Environment variables are properly prefixed with `NEXT_PUBLIC_` for client-side use
- Firebase handles all authentication securely