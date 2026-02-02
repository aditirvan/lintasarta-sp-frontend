import { onMounted, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
import { GODMODEMANAGEUSER } from './namespace'
export const useUser = () => {
    const name = ref('')
    const phone = ref('')
    const email = ref('')
    const org = ref('')
    const orgs = ref([])
    const role = ref('')
    const status = ref('')
    
    const { addmember, editmember } = useNamespacedActions(GODMODEMANAGEUSER, ['addmember', 'editmember'])
    
    return {
        name, phone, email, org, orgs, role, status,
        editmember,addmember
       
    }
}