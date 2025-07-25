# Zuetani Earth Tribe - Firebase Configuration

A Next.js social platform for mindful travelers and earth tribe communities, now configured with Firebase backend services.

## 🔥 Firebase Services

This project is configured with the following Firebase services:

- **Authentication** - User registration, login, and profile management
- **Firestore** - Real-time database for posts, users, groups, and comments
- **Storage** - File uploads for avatars, post images, and group images
- **Hosting** - Static site hosting for the built application

## 🚀 Quick Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo>
cd zuetani-earth-tribe
npm install --legacy-peer-deps
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "zuetani-earth-tribe")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 3. Enable Firebase Services

#### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Optionally enable other providers (Google, Facebook, etc.)

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in "test mode" (we'll deploy rules later)
4. Choose a location closest to your users

#### Storage
1. Go to Storage
2. Click "Get started"
3. Start in "test mode" (we'll deploy rules later)
4. Choose the same location as Firestore

### 4. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" > Web app
4. Register your app with a nickname
5. Copy the `firebaseConfig` object

### 5. Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your Firebase config values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
   ```

### 6. Initialize Firebase CLI

```bash
# Login to Firebase
npm run firebase:login

# Initialize Firebase in your project
npm run firebase:init
```

When prompted, select:
- ✅ Firestore
- ✅ Hosting
- ✅ Storage
- Choose your existing project
- Use default files (firestore.rules, firestore.indexes.json, etc.)
- Configure as a single-page app: **Yes**
- Set up automatic builds and deploys with GitHub: **No** (for now)

### 7. Deploy Firebase Rules and Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage:rules
```

### 8. Start Development

```bash
npm run dev
```

Your app should now be running at `http://localhost:3000` with Firebase integration!

## 🛠 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Firebase commands
npm run firebase:login      # Login to Firebase CLI
npm run firebase:init       # Initialize Firebase project
npm run firebase:deploy     # Deploy to Firebase Hosting
npm run firebase:emulators  # Start Firebase emulators for local development

# Export static files
npm run export             # Export static files for hosting
```

## 🏗 Project Structure

```
├── lib/
│   ├── firebase.ts          # Firebase configuration and initialization
│   ├── firebase-auth.ts     # Firebase Authentication service
│   ├── firebase-storage.ts  # Firebase Storage utilities
│   └── auth.ts              # Legacy auth (can be removed after migration)
├── components/
│   ├── auth-guard.tsx       # Authentication guard component
│   ├── navbar.tsx           # Navigation component
│   └── ui/                  # UI components
├── app/
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── dashboard/           # User dashboard
│   ├── profile/             # User profile
│   ├── create-post/         # Create post page
│   ├── search/              # Search functionality
│   └── groups/              # Groups feature
├── firebase.json            # Firebase project configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore database indexes
├── storage.rules            # Firebase Storage security rules
└── .env.local.example       # Environment variables template
```

## 🔒 Security Rules

The project includes comprehensive security rules for:

- **Firestore**: Users can only read/write their own data and read public content
- **Storage**: Users can upload to their own folders, public read access for posts

## 🧪 Local Development with Emulators

For local development without affecting production data:

```bash
# Start Firebase emulators
npm run firebase:emulators
```

This will start:
- Authentication Emulator: `http://localhost:9099`
- Firestore Emulator: `http://localhost:8080`
- Storage Emulator: `http://localhost:9199`
- Hosting Emulator: `http://localhost:5000`
- Firebase UI: `http://localhost:4000`

Update your `.env.local` to use emulators:
```env
# Add these for emulator development
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
npm run firebase:deploy
```

This will:
1. Build the Next.js application
2. Export static files
3. Deploy to Firebase Hosting
4. Deploy Firestore rules and indexes
5. Deploy Storage rules

### Deploy to Vercel (Alternative)

The project is also compatible with Vercel deployment:

```bash
npm run build
```

Then deploy to Vercel with your Firebase environment variables configured.

## 📱 Features

- **User Authentication**: Email/password registration and login
- **User Profiles**: Customizable profiles with avatars and bio
- **Posts**: Create, read, and interact with posts
- **Image Uploads**: Upload images for posts and avatars
- **Groups**: Community groups with discussions
- **Search**: Search posts and users
- **Real-time Updates**: Live updates using Firestore

## 🔧 Migration from Mock Data

The project now uses Firebase but maintains backward compatibility. To fully migrate:

1. Update imports in components from `lib/auth` to `lib/firebase-auth`
2. Test all functionality with Firebase
3. Remove `lib/auth.ts` once migration is complete

## 🆘 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env.local` exists and variables start with `NEXT_PUBLIC_`
   - Restart the development server

2. **Firebase Configuration Errors**
   - Double-check all environment variables
   - Ensure Firebase project is properly set up

3. **Permission Denied Errors**
   - Check Firestore and Storage security rules
   - Ensure user is authenticated

4. **Build Errors**
   - Run `npm install --legacy-peer-deps` if you encounter dependency conflicts
   - Check for TypeScript errors

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Console](https://console.firebase.google.com/)

## 📄 License

This project is private and proprietary.