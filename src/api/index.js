import axios from 'axios'

const api = axios.create({
  baseURL:
    process.env.REACT_APP_PRIVATE_KEY ||
    'https://dev-dot-innova-dot-artem-296122.uc.r.appspot.com',
})

export default api
