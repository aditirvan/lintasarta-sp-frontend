import { ref } from '@vue/composition-api'
import { required, email } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useNamespacedActions } from 'vuex-composition-helpers'
import { NAMESPACE } from './namespace'

export const useAction = () => {
  const Keys = ['projectName', 'description', 'payment_method', 'selected_region', 'voucher_discount_code', 'vatid']
  const Reference = Keys.map(x => ref(''))
  const Validator = [{
    required, alpha: {
      $message: 'value must alpha or alphanumeric',
      $validator: (val) => {
        return /^[a-zA-Z0-9- ]+$/.test(val)
      }
    }
  }, { required }, { required }]

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
  const { save: Save } = useNamespacedActions(NAMESPACE, ['save'])
  return {
    ...Composable,
    ...Validation,
    save: async () => {
      $v.value.$touch()
      if ($v.value.$errors.length) return
      const Value = {}
      Keys.forEach(key => {
        Value[key] = Composable[key].value
      })      
      return Save(Value)      
    }
  }
}