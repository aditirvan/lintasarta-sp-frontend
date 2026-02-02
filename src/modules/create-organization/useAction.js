import {ref} from '@vue/composition-api'
import {required, email} from '@vuelidate/validators'
import {useVuelidate} from '@vuelidate/core'
import {useNamespacedActions} from 'vuex-composition-helpers'
import {NAMESPACE} from './namespace'

export const useAction = () => {
  const Keys = ['name', 'details', 'address', 'country', 'city', 'phone', 'sales_id']
  const Reference = Keys.map(x => ref(''))
  const Validator = Keys.map(x => ({required}))

  const $v = useVuelidate(
    Validator,
    Reference
  )

  const Validation = {}
  const Composable = {}

  Keys.forEach((key, index) => {
    Composable[key] = Reference[index]
    Validation[key + 'Validation'] = $v.value[index]
  })

  const {submit: Submit} = useNamespacedActions(NAMESPACE, ['submit'])
  const {profile: Profile} = useNamespacedActions(NAMESPACE, ['profile'])
  const region = ref('');
  const zip = ref('');
  // const selectedcountrycode = ref('+62');

  return {
    ...Composable,
    ...Validation,
    region,
    zip,
    // selectedcountrycode,
    save: async (payload) => {
      $v.value.$touch()
      if ($v.value.$errors.length) return
      const Value = {}
      Keys.forEach(key => {
        Value[key] = Composable[key].value
      })
      Value['phone'] = "+62" + Value['phone'].replaceAll(' ','')
      Value['region'] = region.value
      Value['zip'] = zip.value
      // Value['prefix_bussiness_phone_number'] = selectedcountrycode.value

      let submit = await Submit(Value)
      return submit
    },
    profile: async () => {
      return await Profile()
    }
  }
}