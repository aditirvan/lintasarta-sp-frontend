import { ref, watch } from '@vue/composition-api'
import {required} from '@vuelidate/validators'
import {useVuelidate} from '@vuelidate/core'
import {useNamespacedActions, useNamespacedMutations} from 'vuex-composition-helpers'
import {MANAGEFLAVOR} from './namespace'
export const useCreateVol = (props,{emit})=>{
    // console.log(props.volume, "props.volume")
    const volumesizealreadyexist = ref('')
    // let Keys = ['volume_size', 'price_per_month', 'price_per_hours', 'type_id']
    let Keys = ['volume_size', 'price_per_month', 'type_id']

    // const Keys = ['volume_size', 'price_per_month']

    const Reference = Keys.map(x=>ref(''))

    // const Validator = [{required, conditional: {
    //     $message: "Volume size already exist",
    //     $validator: () => !volumesizealreadyexist.value,
    // },}, {required}]

    let Validator = [{required, conditional: {
        $message: "Volume size already exist",
        $validator: () => !volumesizealreadyexist.value,
      },}, {required}, {required}]

    if (props.volume) {
        Keys = ['volume_size', 'price_per_month', 'price_per_hours']
        Validator = [{required, conditional: {
            $message: "Volume size already exist",
            $validator: () => !volumesizealreadyexist.value,
        },}, {required}]
    }
    
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

    watch(Composable["volume_size"], (val)=>{
        volumesizealreadyexist.value = ""
        $v.value[0].$reset()
    })

    const {
        setopendialogcommonsuccess,
    } = useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonsuccess",
    ]);

    const { addVolume, editVolume } = useNamespacedActions(MANAGEFLAVOR,['addVolume','editVolume'])
    
    const CreateVol = ()=>{
        $v.value.$touch()
        if($v.value.$errors.length)return
        const Value = {}
        Keys.forEach(key=>{
            Value[key] = Composable[key].value
        })
        addVolume(Value).then(()=>{
            return fetchdefaultstoragesize()
        }).then(()=>{
            return fetchstoragesizes()
        }).then(()=>{
            emit('input', false)
            setopendialogcommonsuccess(true)
        }).catch(e=>{
            if(e.response.data.data == "Volume size alredy exist"){
                volumesizealreadyexist.value = "Volume size already exist"
            }
        })
    }

    const {fetchdefaultstoragesize, fetchstoragesizes} = useNamespacedActions(MANAGEFLAVOR,
        ['fetchdefaultstoragesize','fetchstoragesizes'])

    const EditVol = async (v)=>{
        // const Keys2 = ['volume_size', 'price_per_month']
        // const Reference2 = Keys.map(x=>ref(''))
        // const Validator2 = [{required, conditional: {
        //     $message: "Volume size already exist",
        //     $validator: () => !volumesizealreadyexist.value,
        //   },}, {required}]
        
        // const $v2 = useVuelidate(
        //     Validator2,
        //     Reference2
        // )
        // const Composable2 = {}
        // const Validation2 = {}
        // Keys2.forEach((key, index)=>{
        //     Composable2[key] = Reference[index]
        //     Validation2[key+'Validation'] = $v.value[index]
        // })

        $v.value.$touch()

        if($v.value.$errors.length) {
            return Promise.reject("error")
        }

        const Value = {}
        
        Keys.forEach(key=>{
            Value[key] = Composable[key].value
        })
        
        Value.id = v.id
        
        return await editVolume(Value)
      }
    return {
        ...Composable,
        ...Validation,
        CreateVol, EditVol
    }
}