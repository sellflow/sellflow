<p align="center">
<img width="300" alt="Sellflow Logo" src="https://user-images.githubusercontent.com/369384/73599036-f5cfcf00-44f3-11ea-9696-91e9c56b6e49.png">
</p>
<h3 align="center">An open-source, pre-built mobile app for your <a href="https://www.shopify.com/plus/solutions/headless-commerce">Headless Shopify app</a>!</h3>

## Get started
Prerequisites:

- Make sure you have [Node.js](https://nodejs.org) installed
- Download the [Headless App](https://apps.shopify.com/headless)
1. Enter Environment Variables
  ```bash
  EXPO_PUBLIC_STORE_TOKEN=
  EXPO_PUBLIC_STORE_DOMAIN=
  EXPO_PUBLIC_ENCRYPTION_KEY=
  EXPO_PUBLIC_CUSTOMER_STORE_ENDPOINT=
  EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_TOKEN=
  EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_ENDPOINT=
  ```
  All environment variables are prefixed with EXPO_PUBLIC to be available through the expo client this may change in the future. All of these variable names are also subject to change because the naming is terrible.
  - `STORE_TOKEN` is your Storefront Public API Token
  - `STORE_DOMAIN` is the domain given to you from the Headless app
  - `ENCRYPTION_KEY` random string used by [MMKV](https://github.com/mrousavy/react-native-mmkv) to encrypt user data.
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
- User Auth
- Search & Filtering
- Checkout Page
- Plugs directly into your existing Shopify store
- Android, iPhone and iPad, Web
- Customizable to your brand's look and feel
- Responsive layout: supports phones and tablets
- Internationalization ready: all strings localized and ready to be translated into your customers' language.
- Free and open source!
- Commercial support available

Checkout Sheet Demo:
![android_checkout_sheet_demo-_online-video-cutter com_](https://github.com/user-attachments/assets/b71ed105-011a-4508-8d7e-293f161aec33)
Search & Filtering Demo: 
![product_filtering_demo](https://github.com/user-attachments/assets/f69d6483-f9a4-44f9-a09e-0a818f81f4af)

Add to Cart Bottom Sheet for Multi-Variant Products:
![Add to Cart dropdown Video](https://github.com/user-attachments/assets/b97841e9-e54f-4c25-82d1-1035260c3477)


## How to Contribute

- Fork the repository.
- Follow the Getting Started instructions above.
- Use your favorite code editor to develop a feature or fix.
- Commit your change to a branch.
- Push to your fork and create a PR.


## Professional Support

With official support, you get expert help straight from the core team. We provide dedicated support, prioritize feature requests, deployment strategies, advice on best practices, design decisions, and team augmentation. Reach out to us for consulting at support@kodefox.com.

## License

MIT. Copyright (c) [KodeFox, Inc.](https://github.com/kodefox)
