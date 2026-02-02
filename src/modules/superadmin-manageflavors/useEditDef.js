import { ref } from '@vue/composition-api'
import {required, minValue} from '@vuelidate/validators'
import {useVuelidate} from '@vuelidate/core'
import {useNamespacedActions} from 'vuex-composition-helpers'
import {MANAGEFLAVOR} from './namespace'
export const useEditDef = (props,context)=>{
    const Keys = ['total','price_per_month', 'price_per_hours']
    const Reference = Keys.map(x=>ref(''))
    const Validator = Keys.map(x=>({required, minValue: minValue(1)}))
    
    const $v = useVuelidate(
        Validator,
        Reference
    )
    const Composable = {}
    const Validation = {}
    Keys.forEach((key, index)=>{
        Composable[key] = Reference[index]
        Validation[key+'Validation'] = $v.value[index]
    })
    const { editdefaulinstanceprice } = useNamespacedActions(MANAGEFLAVOR,['editdefaulinstanceprice'])
   
   
    const EditDef = async (v)=>{
        $v.value.$touch()
        if($v.value.$errors.length)return Promise.reject("error")
        const Value = {}
        Value.id = props.item.id
        Keys.forEach(key=>{
            Value[key] = Composable[key].value
        })
        editdefaulinstanceprice(Value).then(()=>{
            context.emit('edited')
        })
      }
    return {
        ...Composable,
        ...Validation, EditDef
    }
}