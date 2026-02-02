import { reactive, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers'

import { GODMODEMANAGEUSER } from './namespace'
export const useMember = () => {
    const memberselected: any = ref('')
    const membersselected: any = ref([])
    const { fetchmembers, addmember, deletemember, resendemail } = useNamespacedActions(GODMODEMANAGEUSER, ['addmember', 'fetchmembers', 'deletemember', 'resendemail'])
    
    const { members, pagination } = useNamespacedState(GODMODEMANAGEUSER, ['members', 'pagination'])
    const options = ref({ search: '', page:1, organization_id:'', role_id:'' })
    const search = ref("")
    let timeouts: number = setTimeout(()=>{},500);
   
    
    watch(search, val => {
        clearTimeout(timeouts)
        timeouts = setTimeout(() => {
            options.value.search = val
            options.value.page = 1
        }, 500)
    })
    watch(options, val => {
        fetchmembers(val)
    }, {deep:true})
    const {
        setopendialogcommonsuccess,
      } = useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
      ]);
    const deletememberselected = async () => {
        deletemember(memberselected.value).then(()=>{
            fetchmembers(options.value)
            setopendialogcommonsuccess(true)
        })
    }

    const resendinvitememberselected = async () => {
        resendemail(memberselected.value).then(()=>{
            fetchmembers(options.value)
            setopendialogcommonsuccess(true)
        })
    }

    
  
    const refreshmembers = ()=>{
        fetchmembers(options.value)
    }
    return {
        members, pagination, options, search,
        fetchmembers,
        addmember,
        membername: ref(''),
        emailmember: ref(''),
        memberselected, membersselected,
        resendinvitememberselected,
        deletememberselected,
        refreshmembers,
    }
}