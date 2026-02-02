import { Module, ActionContext } from 'vuex'
import axios from '@/lib/axios' 
export interface Organization {
    name: string,
    desc: string,
    id: string,
}
export interface State {
    organizations : Array<Organization>,
    projects: Array<any>,
    pagination: any,
    currentOrg: any,
    organizationsall: Array<Organization>,
}
const store: Module<State, any> = {
    namespaced:true,
    state:{
        organizations: [],
        pagination: {},
        projects:[],
        currentOrg: null,
        organizationsall: [],
    },
    mutations:{
        setcurrentOrg: (state:State, payload:any)=>state.currentOrg = payload,
        setorganizations: (state:State,payload:Array<any>)=>{
            state.organizations = payload
        },
        setprojects: (state: State, payload:Array<any>)=>{
            state.projects = payload
        },
        setpagination : (state: State, payload: any)=> state.pagination = payload
    },
    actions:{
        editorganization:async(context:ActionContext<State, any>, payload: any)=>{
            return await axios.instance.put(`/user/organization/edit/${payload.id}`,payload)
        },
        fetchorganizationByUser: async(context:ActionContext<State, any>)=>{
            return await axios.instance.get('/user/organization').then(response=>{
                const data  = response.data.data
                return data
            }).catch(e => {
                context.commit('HOMEPAGE/setToastmessage','ERROR ON GET ORGANIZATION DATA', {root:true})
                context.commit('HOMEPAGE/setToast', true, {root:true})
                return Promise.reject(e)
            })
           
            
        },
        fetchorganizations: async(context:ActionContext<State, any>)=>{
            return []
            // return axios.instance.get('/user/organization').then(response=>{
            //     const data  = response.data.data
            //     const {organizations, pagination} = data
            //     console.log(organizations)
            //     context.commit('setorganizations', organizations)
            //     context.commit('setpagination', pagination)
            // })
            
        },
    }
}

export default store