<p align="center">
<img width="300" alt="Sellflow Logo" src="https://user-images.githubusercontent.com/369384/73599036-f5cfcf00-44f3-11ea-9696-91e9c56b6e49.png">
</p>
<h3 align="center">An open-source, pre-built mobile app for your <a href="https://www.shopify.com/plus/solutions/headless-commerce">Headless Shopify app</a>!</h3>

> [!Warning]
> This project is currently under development and is not intended for production use.

## Get started
Prerequisites:

- Make sure you have [Node.js](https://nodejs.org) installed
- [Get an API key](https://help.shopify.com/en/api/getting-started/authentication/private-authentication#generate-credentials-from-the-shopify-admin) for the Shopify Storefront API for your Shopify store.

1. Enter Environment Variables
  ```bash
  EXPO_PUBLIC_STORE_TOKEN=
  EXPO_PUBLIC_STORE_DOMAIN=
  EXPO_PUBLIC_AUTH_STATE_KEY=
  EXPO_PUBLIC_AUTH_REFRESH_KEY=
  EXPO_PUBLIC_CUSTOMER_STORE_ENDPOINT=
  EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_TOKEN=
  ```
  All environment variables are prefixed with EXPO_PUBLIC to be available through the expo client this may change in the future. All of these variable names are also subject to change because the naming is terrible.
  - `STORE_TOKEN` is your Storefront Public API Token
  - `STORE_DOMAIN` is the domain given to you from the Headless app
  - `AUTH_STATE` and `AUTH_REFRESH` are both random strings used to access the authentication tokens the value can be whatever you choose
  - `CUSTOMER_STORE_ENDPOINT` is the endpoint given to you from the Shopify Headless app in the Customer Account API section
  - `CUSTOMER_ACCOUNT_API_TOKEN` is the Client ID of your Customer API Endpoint


2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Features

- 100% [React Native](https://facebook.github.io/react-native/) and [TypeScript](http://typescriptlang.org) built on [Expo](https://expo.io)
- Plugs directly into your existing Shopify store
- Android, iPhone and iPad
- Customizable to your brand's look and feel
- Responsive layout: supports phones and tablets
- Internationalization ready: all strings localized and ready to be translated into your customers' language.
- Free and open source!
- Maintained by a dedicated team
- Commercial support available

## How to Contribute

- Fork the repository.
- Follow the Getting Started instructions above.
- Use your favorite code editor to develop a feature or fix.
- Commit your change to a branch.
- Run the tests:
  `yarn test-full`
- Push to your fork and create a PR.


## Professional Support

With official support, you get expert help straight from the core team. We provide dedicated support, prioritize feature requests, deployment strategies, advice on best practices, design decisions, and team augmentation. Reach out to us for consulting at support@kodefox.com.

## License

MIT. Copyright (c) [KodeFox, Inc.](https://github.com/kodefox)
