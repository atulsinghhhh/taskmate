# WhatBytes Task Manager

A task management app built with Expo Router, TypeScript, Zustand, and Firebase (Auth + Firestore).

## Running the app

```bash
npm install
npx expo start
```

Copy `.env.example` to `.env` (or edit `.env` directly) with your Firebase config. Set `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true` to run against the local Firebase Emulator Suite instead of a real project:

```bash
npx firebase-tools emulators:start --only auth,firestore
```

## Routes

| Route | Screen | Notes |
| --- | --- | --- |
| `/onboarding` | Onboarding | Shown once, on first launch only |
| `/(auth)/login` | Login | |
| `/(auth)/register` | Register | |
| `/` (Tasks tab) | Task list | Bottom tab |
| `/profile` (Profile tab) | Profile | Bottom tab |
| `/(app)/task/new` | Create task | Modal, pushed above the tabs |
| `/(app)/task/[id]` | Edit task | Modal, pushed above the tabs |

## Features

- **Auth** — email/password sign-up and login via Firebase Authentication, session persisted across restarts.
- **Tasks** — create, edit, delete, and mark tasks complete, with priority and due date. Synced live via Firestore, filterable by priority/completion.
- **Onboarding** — a one-time welcome screen shown before the auth flow on first launch. The completed flag is persisted in AsyncStorage, so it's never shown again on that device, but it never bypasses authentication — an unauthenticated user is always routed to login regardless of onboarding status.
- **Profile** — shows the signed-in user's avatar (initials), display name, and email; lets them edit their display name (backed by Firebase's `updateProfile`); shows a live task summary (total/completed/pending) computed from the same task data the Tasks tab uses; and signs out with a confirmation step.
- **Bottom tabs** — Tasks and Profile live in a bottom tab bar; creating/editing a task opens as a modal on top of the tabs, not as a third tab.

## Architecture

- `src/app/` — Expo Router routes only (thin files that re-export a screen component). Route groups: `(auth)` for signed-out screens, `(app)` for signed-in screens (containing the `(tabs)` group plus the task modals).
- `src/features/<name>/` — screens, stores (Zustand), services, and types for each feature (`auth`, `tasks`, `onboarding`, `profile`).
- `src/components/` — shared UI components used across features.
- Auth state and the onboarding-completed flag both gate navigation via `Stack.Protected` in `src/app/_layout.tsx`.
