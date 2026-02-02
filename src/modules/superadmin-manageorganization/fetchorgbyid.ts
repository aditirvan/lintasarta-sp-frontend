import Vue from 'vue'
import {iVue} from '@/modules/type'
import axios from '@/lib/axios'
export const fetchorgbyid = async (id: string)=>{
    const v : iVue = Vue as any
    return await axios.instance.get(`/superadmin/manageorg/${id}`)
}