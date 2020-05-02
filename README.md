<p align="center">
<img width="300" alt="Sellflow Logo" src="https://user-images.githubusercontent.com/369384/73599036-f5cfcf00-44f3-11ea-9696-91e9c56b6e49.png">
</p>

<h3 align="center">An open-source, pre-built mobile app for your <a href="https://help.shopify.com/en/api/storefront-api">Shopify storefront</a>!</h3>

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

## Screenshots

<p>
<img width="220" alt="Collection Details" src="https://user-images.githubusercontent.com/54926653/72737192-ad4e1280-3bd1-11ea-9248-0251445692ee.gif">
<img width="220" alt="Home" src="https://user-images.githubusercontent.com/54926653/72893965-e2cb3b00-3d4c-11ea-99c9-be5f9945b52c.gif">
</p>

![Product details iPad](https://user-images.githubusercontent.com/48467219/73233342-c9951500-41b8-11ea-8e77-e35f3f4d296c.gif)

<p>
<img alt="Search iPhone" src="https://user-images.githubusercontent.com/35681237/73165352-3a3f2180-4126-11ea-8849-2bdfe26c8c34.gif">
<img width="200" alt="Search iPhone" src="https://user-images.githubusercontent.com/54882003/72884116-28c9d400-3d38-11ea-88ee-409eb2d78074.gif">
</p>

## Getting Started

Prerequisites:

- Make sure you have [Node.js](https://nodejs.org) installed
- Install the latest version of [Expo](https://expo.io/learn)
  `npm install --global expo-cli@latest`
- [Recommended] Install [yarn](https://legacy.yarnpkg.com/docs/install)
  `curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.21.1`
  Note: This will install [v1.x](https://github.com/yarnpkg/yarn/releases) since v2 is not yet compatible with React Native.
- [Get an API key](https://help.shopify.com/en/api/getting-started/authentication/private-authentication#generate-credentials-from-the-shopify-admin) for the Shopify Storefront API for your Shopify store.

Clone the repository:

```sh
git clone git@github.com:sellflow/sellflow.git
cd sellflow
```

Make a file `.env.json` in the root of the project, based on [the example file](https://github.com/sellflow/sellflow/tree/master/.env-example.json). This will contain your Shopify API Key (mentioned above).

```sh
cp .env-example.json .env.json
```

Install dependencies:

```sh
yarn && yarn apollo:generate
```

Run the app:

```sh
yarn start
```

## Background and Motivation

Imagine you’re a store owner and you sell products online using the Shopify platform. Life is good, you have a fantastic website and customers love your products. Shopify provides you with an incredible administrative interface to manage your site’s content, products, pricing, photos, inventory and orders. But you don’t have a native mobile app on iOS or Android!

Customers have asked you about a mobile app but so far you’ve told them to just use the website from their phone. Your web-store is mobile friendly and it works pretty well, but it’s not the true mobile experience your customers expect.

Sellflow is a pre-built mobile app that you can customize to fit your brand and then deploy your own custom mobile commerce app to the Apple App Store or Google Play Store. You can think of it like a “template” that you might use to build your mobile app.

Sellflow is just the “frontend” — the customer interface — it works with Shopify’s “headless mode”, technically the [Storefront API](https://help.shopify.com/en/api/storefront-api). You as the merchant still use Shopify’s admin interface as normal to manage your products, inventory and orders.

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
