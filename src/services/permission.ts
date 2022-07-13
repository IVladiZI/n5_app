import axios from 'axios'
const baseUrl = import.meta.env.BASE_URL
const api_get = "/api/Permission"
export const getAll = async () =>{
    const request = axios.get(`${baseUrl}${baseUrl}`)
    return request.then(response => response.data)
}
