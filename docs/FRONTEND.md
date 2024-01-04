# Frontend

This is the frontend project for the starter. It was created with `create-expo-stack` and has been modified to work with the backend.

We are using the `expo-dev-client` with Expo. So, the first step is setting up your package name. We also need to set up EAS along with this, which stands for Expo Application Services. EAS allows us to build, update, and submit our app without ever touching native code. This doesn't mean, however, that we need to pay for Expo. Even though EAS offers a generous free tier, we can use the `--local` flag to build our app locally. 

So, the first time you run `eas build`, Expo will prompt you to complete various steps in the terminal. This includes setting up the `ios.bundleIdentifier` in `app.json` as well as `eas.projectId`.