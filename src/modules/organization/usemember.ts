import { ref,watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers'
import { namespace } from './memberstore'
import { SUPERADMINMANAGEORG} from '../superadmin-manageorganization/namespace'
import localstorage from '@/lib/localstorage'
export const useMember = ()=>{
    const user_role = localstorage.getItem('role')
    const store = (user_role == 'Superadmin')? SUPERADMINMANAGEORG: namespace
    const memberselected : any = ref('')

    const membersselected: any = ref([])

    const {fetchmembers, addmember, deletemember, editmember,resendemail} = useNamespacedActions(store, 
        ['addmember','fetchmembers','deletemember','editmember','resendemail'])
    const deletememberselected =  async()=>{
        return await deletemember(memberselected.value)
    }
 
    const {
        setopendialogcommonsuccess,
      } = useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
      ]);
    
    const resendinvitememberselected =  async()=>{
        console.log(memberselected.value);
        return await resendemail(memberselected.value)
    }

    const {members, memberpagination: pagination} = useNamespacedState(store,['members','memberpagination'])
    return {

        resendinvitememberselected,
        members, pagination,
        fetchmembers,
        addmember, editmember,
        membername: ref(''),
        phone_number :ref(''),
        emailmember: ref(''),
        memberselected,
        deletememberselected
    }
}