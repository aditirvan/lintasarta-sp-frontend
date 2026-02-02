import {computed, ref} from '@vue/composition-api'
import { required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { useNamespacedState, useNamespacedActions, useNamespacedMutations } from 'vuex-composition-helpers'
import {State} from '../organization/organization.store'
import { SUPERADMINMANAGEORG } from '../superadmin-manageorganization/namespace'
import { SUPERADMIN } from './namespace'
export const useaddproj = (props: any, context: any)=>{
    const projname = ref('')
    const org = ref()
    const projdesc = ref('')
    const projorgname:any = ref(null)
    const { organizations } = useNamespacedState<State>(SUPERADMINMANAGEORG,['organizations'])
    const { fetchorganizations, addproject } = useNamespacedActions(SUPERADMINMANAGEORG,['fetchorganizations','addproject'])
    const $v = useVuelidate({
        projname: {required},
        projdesc: {required}
    },{projname, projdesc})
    const projnameErrors = computed(()=>{
        return $v.value.projname.$errors
    })
    const projdescErrors = computed(()=>{
        return $v.value.projdesc.$errors
    })
    const {currentOrg} = useNamespacedState(SUPERADMIN,['currentOrg'])
    const {
        setopendialogcommonsuccess,
      } = useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
      ]);
    const submitproj = async()=>{
        $v.value.$touch()
        console.log($v.value)
        if($v.value.$errors.length) return Promise.reject("error")
        let org = currentOrg.value as any
        const Value = {
            name: projname.value,
            description: projdesc.value,
            organization_id: org.id
        }
        return await addproject(Value).then(()=>{
            setopendialogcommonsuccess(true)
        })
      }
    return{
        projname, projdesc, projorgname, submitproj,
        projnameErrors, projdescErrors,
    }
}
