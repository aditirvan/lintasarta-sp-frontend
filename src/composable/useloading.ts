import {ref} from '@vue/composition-api'
export const useLoading = (props:any,context:{emit:any})=>{
    const loading = ref(false)
    return {
        loading
    }
}