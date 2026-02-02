import axios from 'axios'
const instance = axios.create(
    {
        baseURL: 'https://secure-castle-54667.herokuapp.com/',
        responseType: 'blob'
    }
)
export default async(headers:any, items:any)=>{
    return await instance.post('',{
        headers, items
    })
}