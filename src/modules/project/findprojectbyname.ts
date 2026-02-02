import axios from "@/lib/axios"

export default async(id:string)=>{
    return await axios.instance.get(`/user/project/detail/${id}`).then(response=>{
        return response.data.data
    }).catch(e=>{
        return null
    })
}