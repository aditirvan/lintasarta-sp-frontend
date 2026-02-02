import { required, alpha, alphaNum, or, minLength } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core';
import { ref, computed } from '@vue/composition-api'
import localstorage from '@/lib/localstorage'
import { useNamespacedActions, useNamespacedMutations, useNamespacedState } from 'vuex-composition-helpers';
import { values } from 'lodash';
export const useCreateOpenstack = () => {
    const selected_region = ref('')
    const $v = useVuelidate({ 
        selected_region: { required },   
    }, {
        selected_region
    })

    
    // const regValidation = $v.value.selected_region
    const { createOpenstack } = useNamespacedActions('PROJECT', ['createOpenstack'])
    
    const CreateOpenstack = async () => {
        $v.value.$touch()
        if ($v.value.$errors.length) return Promise.reject('error')

        const currentProj = JSON.parse(localStorage.getItem('currentProj'))

        const Value: any = {
            organization_id: currentProj.organization_id,
            project_id: currentProj.id,
            region: selected_region.value['name'],
        }
        return await createOpenstack(Value).then((res:any) => {
            localstorage.setItem('currentProj', JSON.stringify(res.data.data))
        })
    }
    return {
        $v,
        // regValidation,
        CreateOpenstack,
        selected_region,
    }
}