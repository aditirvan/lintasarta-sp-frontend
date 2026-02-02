import { reactive, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers'
import { SUPERADMINMANAGEUSER } from './namespace'
export const useCreator = () => {
 
    const creatorselected: any = ref([])
    const org = ref('')
    const idSelect: any = ref([])
    const { fetchcreator } = useNamespacedActions(SUPERADMINMANAGEUSER, ['fetchcreator'])
    
    const { paginationC, creators } = useNamespacedState(SUPERADMINMANAGEUSER, ['paginationC','creators'])
    // const {creator, paginationC} = data
    const optionsCreator = ref({ search: '', page:1, organization_id:org })

    const searchC = ref("")
    let timeouts: number = setTimeout(()=>{},500);
   
    watch(searchC, val => {
        clearTimeout(timeouts)
        timeouts = setTimeout(() => {
            optionsCreator.value.search = val
            optionsCreator.value.page = 1
        }, 500)
    })

    
    watch(optionsCreator, val => {
        fetchcreator(val)
    }, {deep:true})

    const {
        setopendialogcommonsuccess,
      } = useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
      ]);
    
  
    const refreshcreators = ()=>{
        fetchcreator(optionsCreator.value)
    }
    const { tfcreator } = useNamespacedActions(SUPERADMINMANAGEUSER, ['tfcreator'])

    return {
        tfcreator,
        paginationC, optionsCreator, searchC,creators,
        fetchcreator,
        creatorselected,      
        org,
        idSelect,
        refreshcreators,

    }
}