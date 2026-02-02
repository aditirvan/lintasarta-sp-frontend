import { ActionContext, Module } from 'vuex'
interface State {
    osversions: [],
    selectos: Array<any>,
    selectbit: Array<any>,
    pagination: any,
}
import axios from '@/lib/axios'
const store: Module<State,any>= {
    namespaced: true,
    state:{
        osversions: [],
        selectos:[],
        selectbit:[],
        pagination:{}
    },
    mutations:{
        setpagination:(state:State,payload:any)=>state.pagination=payload,
        setselectbit:(state:State,payload:any)=>state.selectbit=payload,
        setselectos:(state:State,payload:any)=>state.selectos=payload,
        setosversions:(state:State,payload:any)=>state.osversions=payload
    },
    actions:{
        addNewVersion:async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.post('/flavor/image', payload).then((response) => {
                context.dispatch('fetchosversions')
                context.dispatch('HOMEPAGE/showProcessToastWS', 'Importing Image with URL', { root: true })
            })
        },
        editVersion:async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.put(`/flavor/image/${payload.id}`, payload)
        },
        deleteVersion:async(context: ActionContext<State, any>, payload: any)=>{
            return await axios.instance.delete(`/flavor/image/${payload.id}`)
        },
        fetchosversions:async(context: ActionContext<State, any>,payload:any={page:1,itemsPerPage:10})=>{
            return await axios.instance.get('/flavor/image',{params:{page:payload.page,limit:payload.itemsPerPage, os_id:payload.os_id, search:payload.search, sortBy: payload.sortBy, sortDesc: payload.sortDesc}}).then((response)=>{
                const data = response.data.data
                const {image, pagination} = data
                context.commit('setosversions',image)
                context.commit('setpagination',pagination)
                return data
            })
        },
        // fetchCustomImages: async ({ commit, rootState }) => {
        //     // TODO: Ferry - Fase 1
        //     const currentProj = rootState.SUPERADMIN.currentProj
        //     let params = {}
        //     if (currentProj) {
        //         params = {
        //             pro_id: currentProj.id
        //         }
        //     }
        //     commit('setIsLoading', true)
        //     commit('setCustomImages', [])
        //     let response = await axios.instance.get('/user/images', {params});
        //     commit('setCustomImages', response.data.data)
        //     commit('setIsLoading', false)
        // },

        fetchos:async(context: ActionContext<State, any>)=>{
            return await axios.instance.get('/flavor/image/os').then((response)=>{
                const data = response.data.data
                context.commit('setselectos',data)

            })
        },
        fetchbitversion:async(context: ActionContext<State, any>)=>{
            console.log('fetchbitversion')
            return await axios.instance.get('/flavor/image/version').then((response)=>{
                const data = response.data.data
                context.commit('setselectbit',data)
            })
        }
    }
}

export default store