import axios from 'axios'

export const devAxios = axios.create({
  // baseURL: 'http://1b85c921.ngrok.io' // peter's server
  // baseURL: 'http://21e06df5.ngrok.io' // April server
  baseURL: 'http://c78e4eaa.ngrok.io' // Mark server
})
