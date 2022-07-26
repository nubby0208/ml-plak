import axios from 'axios'

export const HTTP = axios.create({
    baseURL: process.env.BACKEND_BASE_URL,
    headers: {
        Accept: 'application/json',
        // Authorization: `Bearer ${this.localStorage.getItem('token')}`
    }
})