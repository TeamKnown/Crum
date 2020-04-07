# Crum - Augmented Reality Mobile Application

An augmented reality and social media application which allows users to create and collect messages with png images in a shared augmented reality space. We refer to a message with a png image as a “crum”.

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

Front-End

- [Expo](https://expo.io/learn)
- [Expo-Three](https://github.com/expo/expo-three)
- [React](https://facebook.github.io/react/)
- [React-Native](https://github.com/facebook/react-native)
- [React-Native-Navigation](https://github.com/wix/react-native-navigation)
- [React-Native-Maps](https://github.com/react-native-community/react-native-maps)
- [Redux](https://redux.js.org/)

Back-end

- [Node.js](https://nodejs.org/en/)
- [Express](http://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

#### Demo chat features

# Features

## Profile

#### Login

<p float="left">
  <img src="public/Profile.gif">
  <img src="public/Device.gif">
</p>

## Public Crum

#### Profile

<p float="left">
<img src="public/Public_1.gif">
<img src="public/Public_2.gif">
<img src="public/Public_3.gif">
<img src="public/Public_4.gif">

## Private Crum

<p float="left">
<img src="public/Private_1.gif">
<img src="public/Private_2.gif">
</p>

<!--
## Drop Crum
#### Drop Crum


<p float="left">
  <img src="public/Drop_Public_Crum.gif">
  <img src="public/Drop_Private_Crum.gif">
</p>

#### Collect Crum

<p float="left">
  <img src="public/Drop_Public_Crum.gif">
  <img src="public/Drop_Private_Crum.gif">
</p> -->

#### Map

<p float="left">
  <img src="public/Map.gif">
  <img src="public/Direction.gif">
</p>

#### Direction Finder

#### Devide info detection

## Project Challenges

- Render Crums in the most precise way. We initially render the crums using longitute and latitude, but that did not give use very precise result. For example, if a crum is south of a user, and the user is facing left, then crum should show up behind the user. We need to know which way the phone is facing by accesssing to the iphone internal compass, and derive where in the camera view to populate the crum.

# Learning Takeaways

# Features - time permitting and stretch goals

- socket.io integration
