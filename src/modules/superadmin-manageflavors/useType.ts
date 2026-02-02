import { reactive, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers'
import { MANAGEFLAVOR } from './namespace'
export const useType = () => {
    const typeselected: any = ref('')
    const typessselected: any = ref([])
    const { fetchflavorstype, addFlavortype, editFlavortype, deleteFlavortype } 
    = useNamespacedActions(MANAGEFLAVOR, ['fetchflavorstype','addFlavortype','editFlavortype','deleteFlavortype'])
    
    const { flavorstype, paginationtype } = useNamespacedState(MANAGEFLAVOR, ['flavorstype', 'paginationtype'])
    
    const options = ref({ search: '', page:1, })
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
        fetchflavorstype(val)
    }, {deep:true})
    const {
        setopendialogcommonsuccess,
      } = useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
      ]);
    const deletetypeselected = async () => {
        console.log(typeselected.value);
        console.log(typessselected.value);
        console.log(options.value);

        deleteFlavortype(typeselected.value).then(()=>{
            fetchflavorstype(options.value)
            setopendialogcommonsuccess(true)
        })
    }

  

    
  
    const refreshType = ()=>{
        fetchflavorstype(options.value)
    }
    return {
        flavorstype, paginationtype, options, search,
        fetchflavorstype,
        addFlavortype,
        editFlavortype,
        typeselected, typessselected,
        deletetypeselected,
        refreshType,
    }
}