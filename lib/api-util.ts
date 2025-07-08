import axios from 'axios'

const backendFetch = axios.create({
  baseURL: '/',
  withCredentials: true,
})

export default backendFetch
