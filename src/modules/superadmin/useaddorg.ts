import {computed, ref} from '@vue/composition-api'
import { required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { useNamespacedActions } from 'vuex-composition-helpers'
export const useaddorg = ()=>{
    const orgname = ref('')
    const orgdesc = ref('')
    
    const $v = useVuelidate({
        orgname: {required},
        orgdesc: {required}
    },{orgname, orgdesc})

    const orgnameErrors = computed(()=>{
        return $v.value.orgname.$errors
    })
    const orgdescErrors = computed(()=>{
        return $v.value.orgdesc.$errors
    })
    const {addorganization} = useNamespacedActions('ORGANIZATION',['addorganization'])
    const submitorg = async()=>{
        $v.value.$touch()
        if($v.value.orgdesc.$invalid || $v.value.orgname.$invalid) return
        return addorganization({
            name: orgname.value,
            desc: orgdesc.value
        }).then(()=>{
            orgname.value = ''
            orgdesc.value = ''
            $v.value.$reset()
        })
      }
    return{
        orgname, orgdesc, submitorg, $v,
        orgnameErrors, orgdescErrors
    }
}
