import axios from '@/lib/axios'
import { async } from 'rxjs'
import {ActionContext, Module} from 'vuex'
import Vue from 'vue'

interface State{
    // currentOrg: any,
    // currentProj: any,
    // organizations: Array<any>
}
export const store: Module<State, any> = {
    namespaced: true,
    // state:{
    //     currentOrg: null,
    //     currentProj: null,
    //     organizations: []
    // },
    mutations:{
        // setCurrentOrg:(state:State, Org:any)=>{
        //     state.currentProj = null
        //     state.currentOrg = Org
        //     localStorage.setItem('currentOrg', JSON.stringify(Org))
        //     localStorage.removeItem('currentProj')
        // },
        // setCurrentProj:(state:State,Proj:any)=>{
        //     console.log(state)
        //     state.currentProj = Proj
        //     console.log(Proj);
        //     localStorage.setItem('projectid', Proj.id)
        //     localStorage.setItem('currentProj', JSON.stringify(Proj))
        //     // const vm = new Vue() as any
        //     // let url = `${process.env.VUE_APP_WS_BASE_URL}/instances_status?project_id=${state.currentProj.id}`
        //     // vm.$connect(url);
        // },
        // setorganizations: (state:State, payload)=> state.organizations = payload
    },
    actions:{
        // updateCurrentProj:(context: ActionContext<State, any>,payload)=>{
        //     context.commit('setCurrentProj', payload)
        //     context.dispatch('ORGANIZATION/fetchprojects',null,{root:true})
        // },
        // fetchorganizations: async(context: ActionContext<State, any>, payload)=>{
        //     return await axios.instance.get('/superadmin/list/manageorg',{params:{limit:-1}}).then((response)=>{
        //         const {organizations, pagination} = response.data.data
        //         context.commit('setorganizations', organizations)
        //     })
        // }
    }
}