# TaskMate

A task management app built with Expo Router, TypeScript, NativeWind, Zustand, and Firebase (Auth + Firestore). Runs on iOS, Android, and web.

## Tech stack

- **Expo SDK 57** / React Native 0.86 / React 19, with Expo Router for file-based navigation
- **NativeWind** (Tailwind CSS) for styling, Plus Jakarta Sans font
- **Zustand** for state management
- **Firebase** Authentication and Cloud Firestore
- **EAS** for cloud builds and submission

## Running the app

```bash
npm install
npx expo start
```

Copy `.env.example` to `.env` and fill in your Firebase config (`EXPO_PUBLIC_FIREBASE_*`). Set `EXPO_PUBLIC_USE_FIREBASE_EMULATOR=true` to run against the local Firebase Emulator Suite instead of a real project:

```bash
npx firebase-tools emulators:start --only auth,firestore
```

Other scripts: `npm run ios`, `npm run android`, `npm run web`, `npm run lint`. Type-check with `npx tsc --noEmit`.

## Building with EAS

Profiles are defined in `eas.json`:

```bash
npx eas-cli@latest build --profile development   # dev client (internal)
npx eas-cli@latest build --profile preview       # internal APK / ad-hoc build
npx eas-cli@latest build --profile production    # store build (auto-increment version)
npx eas-cli@latest submit --profile production
```

## Routes

| Route | Screen | Notes |
| --- | --- | --- |
| `/onboarding` | Onboarding | Shown once, on first launch only |
| `/(auth)/login` | Login | |
| `/(auth)/register` | Register | |
| `/` (Tasks tab) | Task list | Bottom tab |
| `/profile` (Profile tab) | Profile | Bottom tab |
| `/(app)/edit-profile` | Edit profile | Pushed above the tabs |
| `/(app)/task/new` | Create task | Modal, pushed above the tabs |
| `/(app)/task/[id]` | Edit task | Modal, pushed above the tabs |

## Features

- **Auth** — email/password sign-up and login via Firebase Authentication, with form validation and a session persisted across restarts.
- **Tasks** — create, edit, delete, and mark tasks complete, with priority and due date. Synced live via Firestore.
- **Search, filter, and sort** — search by title/description, filter by priority and completion status (with an active-filter badge), and sort by earliest due date (tasks without a due date go last).
- **Onboarding** — a one-time welcome screen shown before the auth flow on first launch. The completed flag is persisted in AsyncStorage, so it's never shown again on that device, but it never bypasses authentication — an unauthenticated user is always routed to login regardless of onboarding status.
- **Profile** — shows the signed-in user's avatar (initials), display name, and email; a dedicated edit-profile screen updates the display name (backed by Firebase's `updateProfile`); shows a live task summary (total/completed/pending) computed from the same task data the Tasks tab uses; and signs out with a confirmation step.
- **Bottom tabs** — Tasks and Profile live in a bottom tab bar; creating/editing a task opens as a modal on top of the tabs, not as a third tab.
- **Design system** — shared TaskMate theme (`src/theme`), logo, and reusable components (buttons, inputs, date field, confirm dialog, empty/loading states).

## Architecture

- `src/app/` — Expo Router routes only (thin files that re-export a screen component). Route groups: `(auth)` for signed-out screens, `(app)` for signed-in screens (containing the `(tabs)` group plus the task modals and edit-profile).
- `src/features/<name>/` — screens, stores (Zustand), services, and types for each feature (`auth`, `tasks`, `onboarding`, `profile`).
- `src/components/` — shared UI components used across features.
- `src/services/firebase/` — Firebase app, Auth (AsyncStorage persistence), and Firestore setup, plus emulator wiring.
- `src/theme/` — color palette and design tokens shared with the Tailwind config.
- `src/utils/` — date formatting, task filtering/sorting, and grouping helpers.
- Auth state and the onboarding-completed flag both gate navigation via `Stack.Protected` in `src/app/_layout.tsx`.

## Security

Tasks live in the `tasks` Firestore collection and are private to their owner: `firestore.rules` only allows a signed-in user to read, update, or delete documents whose `userId` matches their uid, and to create documents with their own `userId`. `EXPO_PUBLIC_*` values are baked into the bundle and aren't secret; the Firestore rules do the protecting.
