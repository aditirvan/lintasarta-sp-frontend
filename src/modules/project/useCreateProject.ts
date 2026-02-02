import { required, alpha, alphaNum, or, minLength } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core';
import { ref, computed } from '@vue/composition-api'
import localstorage from '@/lib/localstorage'
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers';
import { values } from 'lodash';
export const useCreateProject = () => {
    const typeUser = localStorage.getItem("type");
    const name = ref('')
    const description = ref('')
    const payment_method = ref(typeUser == "P" ? "prepaid" : "postpaid")
    const selected_region = ref('')
    const voucher_discount_code = ref('')
    const vatid = ref('')
    let alph = or(alphaNum, alpha) as any
    const $v = useVuelidate({
        name: {
            required, alpha: {
                $message: 'value must alpha or alphanumeric',
                $validator:(v)=>{
                    let val = v as string
                    return /^[a-zA-Z0-9- ]+$/.test(val)
                }
            },
            minLength: minLength(5),
        },
        description: { required },
        payment_method: { required },     
        selected_region: { required },   
        vatid: { required },
    }, {
        name, description, payment_method, selected_region, vatid
    })

    const $vUserAdmin = useVuelidate({
        name: {
            required, alpha: {
                $message: 'value must alpha or alphanumeric',
                $validator:(v)=>{
                    let val = v as string
                    return /^[a-zA-Z0-9- ]+$/.test(val)
                }
            },
            minLength: minLength(5),
        },
        description: { required },
    }, {
        name, description
    })

    const nameValidation = $v.value.name
    const descValidation = $v.value.description
    const payment_methodValidation = $v.value.payment_method
    const regValidation = $v.value.selected_region
    const vatidValidation = $v.value.vatid
    const { createModal } = useNamespacedState('PROJECT', ['createModal'])
    const { addproject } = useNamespacedActions('PROJECT', ['addproject'])
    const { setcreatemodal } = useNamespacedMutations('PROJECT', ['setcreatemodal'])
    const CrateModal = computed({
        get: () => createModal.value,
        set: (val) => setcreatemodal(val)
    })
    const CreateProject = async () => {
        name.value = name.value.trim()
        $v.value.$touch()
        if ($v.value.$errors.length) return Promise.reject('error')

        const organisation = localStorage.getItem('currentOrg')
        const organisationID = organisation ? JSON.parse(organisation).id : null

        const Value: any = {
            organization_id: organisationID,
            name: name.value,
            description: description.value,
            payment_method: payment_method.value,
            region: selected_region.value['name'],
            voucher_discount_code: voucher_discount_code.value,
            vat_id: vatid.value,
        }
        return await addproject(Value).then((res:any) => {
            localstorage.setItem('projectid', res.data.data.project_code)
            localstorage.setItem('projectname', name.value)
            CrateModal.value = false
        })
    }
    return {
        $v,
        name, nameValidation,
        description, descValidation,
        payment_method, payment_methodValidation,        
        selected_region, regValidation,
        voucher_discount_code,
        vatid, vatidValidation,
        CreateProject, CrateModal, $vUserAdmin
    }
}