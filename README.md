# Crum - Augmented Reality Mobile Application

An augmented reality and social media application which allows users to create, collect, and interact with "Crums" - digital images with personalized messages. Users express themselves by sharing Crums, superimposing these objects into the augmented reality space.

Developed by Thomas Zhang, Mark Czernyk, Apirl(TianXin) Angland and Peter(CHAOHUI) Chen

# SetUp

Note: iPhone 6s and newer is recommended for optimal performance on Crum

- Run `git clone https://github.com/TeamKnown/Crum.git` and open up the project in your code editor of choice
- On your phone, Download Expo Client in the Apple App Store
- In your code editor, from the project root directory, run `npm install`
- Run `brew cask install ngrok` then run `ngrok http 19001` and you will be provided a “Forwarding” link formatted as such: `http://bf5e2801.ngrok.io`
- Copy this link and navigate to secretDom.js in the project root directory
- Set “export const BASE_URL” to your ngrok forwarding link
- Leave ngrok open in this terminal
- In a new terminal, run `npm run start-dev` to be redirected to localhost
- In localhost, you will see a QR code. Open up the camera on your iPhone and scan this code
- Once the QR code is detected, you will receive a push notification to open the “exp” link, click on this and Expo will start downloading the JavaScript bundle
- Log in or sign up and start dropping some Crums!

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
- [Ngrok](https://ngrok.com/)

# Features

## Profile

#### Login

To account for AR compatability on different phone models, we automatically detect the user's phone model. However, the user also has the ability to modify these settings.

<p float="left">
  <img src="public/Device.gif">
</p>

## Public Crum

User can drop a crum to the public and specify the number of time it can be collected.

The public Crum is available for all users to collect, but no one is allowed to collect the same Crum twice. After the last Crum is collected, it will disappear from the AR view

<p float="left">
<em minWidth=’24%’>Exhibit 1: April taps anywhere within the AR view, selects a Crum, specifies the amount, incluides a message, and confirms the drop. Users can then comment on, or collect the Crum.</em><br/>
<em minWidth=‘24%’>Exhibit 2: Mark leaves a comment and collects the Crum, which is then reflected in his user profile.</em><br/>
<em minWidth=‘24%’>Exhibit 3: Peter comes across the same Crum, he also comments and collects it.</em><br/>
<em minWidth=‘24%’>Exhibit 4: Thomas picks up the last Crum, so it immediately dissapears from the AR view.</em><br/>
</p >

<p float="left">
<img width='24%' src="public/Public_1.gif">
<img width='24%'src="public/Public_2.gif">
<img width='24%'src="public/Public_3.gif">
<img width='24%'src="public/Public_4.gif">
</p >

Dropped and Collected Crums will be recorded in the user's profile

<p float="left">
<em minWidth=’24%’>Exhibit 1: April is able to check her history of dropped Crums in her user profile. She can also see which user has collected her Crum.</em><br/>
<em minWidth=‘24%’>Exhibit 2: Mark, Peter and Thomas checks his history of collected Crums.</em><br/>
</p >

<p float="left">
<img width='24%' src="public/Public_5.gif">
<img width='24%' src="public/Public_6.gif">
<img width='24%' src="public/Public_7.gif">
<img width='24%' src="public/Public_8.gif">
</p>

## Private Crum

A user who drops a private Crum must specify a designated recipient. We differentiate private Crums from public Crums by adding a colored ring around them. Users who drop a private Crum will see a purple ring around it. The recipient of the private Crum will see a teal ring around it. Private Crums will also be immediately removed from the AR view once collected.

<p float="left">
<em minWidth=’24%’>Exhibit 1: Peter wants to send some healthy snacks to just Thomas. She selects the private Crum option, specifies the recipient name, and confirms the drop.</em><br/>
<em minWidth=‘24%’>Exhibit 2: Thomas comes across a teal-bordered Crum, so he knows it was personally dropped for him. Since he is the recipient, he is able to collect the Crum.</em><br/>
</p >

<p float="left">
<img width='30%' src="public/Private_1.gif">
<img width='30%' src="public/Private_2.gif">
</p>

Similar to the AR view, Privately Dropped and Collected Crums wiil be recorded in the user's profile with its respective purple and teal bordered rings.

<p float="left">
<img width='30%' src="public/Private_3.gif">
<img width='30%' src="public/Private_4.gif">
</p>

#### Map

The map view will show all nearby public and private Crums, indicated by color. Swiping through the carousel of Crums will navigate the user to it's respective location on the map and display an estimated time of arrival.

<p float="left">
<em minWidth=’30%’>Exhibit 1: Thomas swipes through the carousel of nearby Crums to see what users have been dropping.</em><br/>
<em minWidth=‘30%’>Exhibit 2: Each Crum is displayed with an ETA along with a brief description.</em><br/>
</p >

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
- Socket.io integration to allow users to see Crum updates in realtime
- Add a friend's list component to the user profile that would allow users to add, edit, and delete other users
- Chat functionality to allow users to communicate with each other
- Render 3D objects to the AR view

