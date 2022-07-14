import axios from 'axios'
import { Permission } from '../models/entities/permission'
const baseUrl = import.meta.env.VITE_HOST_URL
const api_get = "/api/permission"

export const getAll = async () => {
    return new Promise<Array<Permission>>((resolve, reject) => {
        axios.get(baseUrl + api_get)
            .then(resp => {
                if (resp.status != 200) {
                    reject(resp.statusText)
                    return;
                }
                resolve(resp.data)
            })
            .catch(err => reject(err))
    })
}

export const update = async (data: Permission) => {
    return new Promise((resolve, reject) => {
        axios.put(baseUrl + api_get, data)
            .then(resp => {
                if (resp.status != 200) {
                    reject(resp.statusText)
                    return;
                }
                resolve(resp.data)
            })
            .catch(err => {
                if (err.response) {

                    console.log(err.response)

                } else if (err.request) {

                    console.log(err.request)

                } else if (err.message) {

                    console.log(err.message)

                }
                reject(err)
            })
    })
}

export const create = async (data: Permission) => {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + api_get, data)
            .then(resp => {
                if (resp.status != 200) {
                    reject(resp.statusText)
                    return;
                }
                resolve(resp.data)
            })
            .catch(err => {
                if (err.response) {

                    console.log(err.response)

                } else if (err.request) {

                    console.log(err.request)

                } else if (err.message) {

                    console.log(err.message)

                }
            })
    })
}

export const deletePermission = async (id: number) => {
    return new Promise((resolve, reject) => {
        axios.delete(baseUrl + api_get + "?id=" + id)
            .then(resp => {
                if (resp.status != 200) {
                    reject(resp.statusText)
                    return;
                }
                resolve(resp.data)
            })
            .catch(err => {
                if (err.response) {

                    console.log(err.response)

                } else if (err.request) {

                    console.log(err.request)

                } else if (err.message) {

                    console.log(err.message)

                }
                reject(err)
            })
    })
}
