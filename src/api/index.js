import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API || 'https://dev-dot-innova-dot-artem-296122.uc.r.appspot.com'
})

export default api
