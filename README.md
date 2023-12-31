# expo-trpc-firebase-auth-starter

This starter sets up a monorepo exactly the way I like working on projects. That is with the following stack:

- TypeScript everywhere, because obviously, it's 2023.
- React Native with Expo (managed workflow) on the frontend. This allows for quick iteration with Expo Go. (The frontend project was created with `create-expo-stack`)
- Firebase for authentication (it's the cheapest!)
- Express with tRPC for the backend. tRPC allows for a really great type-safe DX with the frontend, especially when used with Tanstack's React Query on the frontend.
- Any SQL database connected with Prisma. I prefer Planetscale because it's extremely fast and has a great branching workflow that scales well.
- ESLint and Prettier for linting and formatting.
- Bun as the package manager because it's fast.


### Getting started
1. Make a project on Firebase and enable phone authentication
2. Copy `.env.example` in the `frontend` repo to `.env` and fill in the values from Firebase
3. Copy `.env.example` in the `backend` repo to `.env` and fill in the values from Firebase. You also need to download an admin service account file from Firebase and put it in the `backend` folder.
4. Run `bun install` to install all dependencies
5. Run `bun dev` in the `backend` folder to start the backend server
6. Run `bun ios` or `bun android` in the `frontend` folder to start the frontend app. You can also run `bun start` and use the Expo Go app on your phone to scan the QR code.


### Features
- [x] Authentication
  - [x] Phone auth with Firebase
    - [ ] Country picker
  - [ ] Apple auth
  - [ ] Google auth
- [x] Navigation
  - [x] Tabs layout with React Navigation
  - [x] Auth flow handled
  - [ ] Onboarding flow
- [ ] API/backend
  - [x] Backend/frontend connected with tRPC and Tanstack's React Query
  - [x] Simpe backend structure with routers and services
  - [ ] Error handling
    - [x] Backend
    - [ ] Frontend with React Error Boundary
- [ ] Styling
  - [x] Tailwind
  - [ ] Native iOS colors
  - [ ] Custom font with primitive `<Text>` component
  - [ ] Primitive `<Button>` component with animations
  - [ ] Simple opinionated `<Box>` component