# Crum - Augmented Reality Mobile Application

Develop by Thomas Zhang, Mark Czernyk, Apirl(TianXin) Angland and Peter(CHAOHUI) Chen

# SetUp

Note: iPhone 6s and newer is recommended for optimal performance on Crum

- Run `git clone https://github.com/TeamKnown/Crum.git` and open up the project in your code editor of choice
- On your phone, Download Expo Client in the Apple App Store
- In your code editor, from the root directory, run `npm install`
- Run `brew cask install ngrok` then run `ngrok http 19001` and you will be provided a “Forwarding” link similar to `http://bf5e2801.ngrok.io`
- Copy this link and navigate to secretDom.js in the project root directory
- Set “export const BASE_URL” to that ngrok forwarding link
- Leave ngrok open in this terminal
- In a new terminal, run `npm run start-dev` to be redirected to localhost
- On localhost, you will see a QR code. Open up the camera on your iPhone and scan this code
- Once the QR code is detected, you will receive a push notification to open the “exp” link, click on this and Expo will start downloading the JavaScript bundle
- Log in or sign up and drop some Crums!

## Tech Stack

# Front-End

- [Expo](https://expo.io/learn)
- [Expo-Three](https://github.com/expo/expo-three)
- [React](https://facebook.github.io/react/)
- [React-Native](https://github.com/facebook/react-native)
- [Redux](https://redux.js.org/)

# Back-end

- [Node.js](https://nodejs.org/en/)
- [Express](http://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

#### Demo chat features

## Features

## Project Challenges

## Learning Takeaways

## Features - time permitting and stretch goals
