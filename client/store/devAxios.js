import axios from 'axios'
import {BASE_URL} from '../../secretDom'

// console.log(Object.keys(process.env))
export const devAxios = axios.create({
  // ngrok can publish your local host http://localhost:19001
  // to a public link http://*******/.ngrok.io'
  // so everyone can have access to it, even if they are in the other side of the city
  // install ngrok by "brew cask install ngrok"
  // get your ngrok link by running "ngrok http 19001"
  // if you user your own server, make sure you run "npm run start-server" so that your server is on
  // if you change this, make sure you re-start your front end by running "npm start"

  baseURL: BASE_URL
  // baseURL: 'http://21e06df5.ngrok.io'
  // baseURL: 'http://1b0f7a72.ngrok.io' // peter's server
  // baseURL: 'http://21e06df5.ngrok.io' // April server
  // baseURL: 'http://ba5b697c.ngrok.io' // Mark server
  // baseURL: 'http://51f195a4.ngrok.io' // THOMAS server

})
