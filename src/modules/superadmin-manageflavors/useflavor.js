import { computed, onMounted, ref, watch } from '@vue/composition-api'
import { required, helpers } from "@vuelidate/validators"
import useVuelidate from "@vuelidate/core"
import { MANAGEFLAVOR } from './namespace'
import { useNamespacedActions, useNamespacedState, useNamespacedMutations } from 'vuex-composition-helpers'
import { INSTANCE } from "@/modules/instance/namespace";

export const Keys = ['type_id', 'flavor_name', 'vcpu', 'ram', 'root_disk', 'ephermeral_disk', 'swap_disk', 'gpu',
  'rx_tx', 'price_per_month', 'price_per_hours', 'instanceFlavorRegion', 'processor']
  // 'rx_tx', 'price_per_month', 'price_per_hours', 'meta_data_gpu', 'instanceFlavorRegion']
export const useFlavor = (props, context) => {
  const {
    addFlavor,
    editFlavor,
    fetchflavors,
    fetchdefaultstoragesize,
    fetchstoragesizes,
    fetchflavorById,
    fetchdefaulinstanceprice,
    fetchS3Flavors,
    createS3Flavor,
    deleteS3Flavor,
    fetchS3DefaultPrice,
  } = useNamespacedActions(MANAGEFLAVOR,[
    'addFlavor',
    'editFlavor',
    'fetchflavors',
    'fetchdefaultstoragesize',
    'fetchstoragesizes',
    'fetchflavorById',
    'fetchdefaulinstanceprice',
    'fetchS3DefaultPrice',
    'fetchS3Flavors',
    'createS3Flavor',
    'deleteS3Flavor',
  ])

  onMounted(() => {
    fetchdefaulinstanceprice()
  })

  const {
    flavors,
    defaultstoragesize,
    storagesizes,
    paginationstorage,
    defaultcpu, defaultram, defaultdisk, defaultgpu,
    s3Flavors,
    s3Pagination,
    s3Default,
  } = useNamespacedState(MANAGEFLAVOR,[
    'flavors',
    'defaultstoragesize',
    'storagesizes',
    'paginationstorage', 
    'defaultcpu', 
    'defaultram', 
    'defaultdisk',
    'defaultgpu',
    's3Flavors',
    's3Pagination',
    's3Default'
  ])

  const { fetchType, fetchMasterInstances } = useNamespacedActions(INSTANCE, ['fetchType', 'fetchMasterInstances'])

  fetchType();
  const { type, masterInstances } = useNamespacedState(INSTANCE, ['type', 'masterInstances'])

  const Reference = Keys.map(x => ref(''))
  const plans = computed(() => {
    let data = [];
    type.value.map(e => {
      data.push({
        value: e.id,
        text: e.name
      });
    })
    return data;
  })

  
  const processor = ref('')
  const instanceFlavorRegion = ref('')
  const insufficientCPU = ref(false)
  const insufficientRAM = ref(false)

  const planSelected = ref({});
  const usageUnlimited = ref(false)
  const instancesizealreadyexist = ref("")
  const instancenamealreadyexist = ref("")
  const $flavorValidator = useVuelidate(
    {
      ...Keys.map(x => {
        switch (x) {
          // case 'meta_data_gpu':
          case 'id':
          case 'ephermeral_disk':
          case 'swap_disk':
          case 'gpu':
          case 'rx_tx':
            return {}
          case 'price_per_month':
          case 'price_per_hours':
          case 'type_id':
            return { required }
          case 'processor':
            return { required }
          case 'flavor_name':
            return { required, conditional: {
              $message: 'Instance name already exist',
              $validator: (val) => {
                return instancenamealreadyexist.value == ""
              }
            },
            custom:{
              $message: "value min 5 number",
              $validator: (val)=>val.length >= 5
            } }
          case 'instanceFlavorRegion': 
            return { 
              required: helpers.withMessage('Value is required', () => instanceFlavorRegion.value)
            }
          case 'vcpu': 
            return {
              required,
              insufficientCPU: helpers.withMessage('Insufficient amount of resource in this region', (val) => {
                return instanceFlavorRegion.value && val <= (instanceFlavorRegion.value.cpu_limit - instanceFlavorRegion.value.cpu_usage)
              }),
            }
          case 'ram': 
            return {
              required,
              insufficientRAM: helpers.withMessage('Insufficient amount of resource in this region', (val) => {
                return instanceFlavorRegion.value && val <= (instanceFlavorRegion.value.ram_limit - instanceFlavorRegion.value.ram_usage)
              })
            }
          default:
            return {
              required, conditional: {
                $message: 'Instance size already exist',
                $validator: (val) => {
                  return instancesizealreadyexist.value == ""
                }
              }
            }
        }
      })
    },
    Reference
  )
  const resetinstancesizealreadyexist = () => {
    instancesizealreadyexist.value = ""
    $flavorValidator.value.$reset()
  }
  const resetinstancenamelreadyexist = () => {
    instancenamealreadyexist.value = ""
    $flavorValidator.value.$reset()
  }

  const Composable = {}
  const Validation = {}
  Keys.forEach((key, index) => {
    Composable[key] = Reference[index]
    Validation[key + 'Validation'] = $flavorValidator.value[index]
    // let noconditional = ['id', 'ephermeral_disk', 'swap_disk', 'gpu', 'meta_data_gpu', 'rx_tx', 'price_per_month', 'price_per_hours', 'type_id', 'flavor_name' ]
    let noconditional = ['id', 'ephermeral_disk', 'swap_disk', 'gpu', 'rx_tx', 'price_per_month', 'price_per_hours', 'type_id', 'flavor_name', 'processor' ]
    if (!noconditional.includes([key])) {
      watch(Composable[key], val => {
        resetinstancesizealreadyexist()
      })
    }

  })
  watch(Composable['flavor_name'],val=>{
    resetinstancenamelreadyexist()
  })
  const {
    setopendialogcommonsuccess,
    setmessagecommonwarning,
    setopendialogcommonwarning
  } = useNamespacedMutations("DASHBOARD", [
    "setopendialogcommonsuccess", "setmessagecommonwarning",
    "setopendialogcommonwarning"
  ]);
  const createPackage = async () => {
    $flavorValidator.value.$touch()
    if ($flavorValidator.value.$errors.length) return
    const Value = {}
    Keys.forEach((key) => {
      if (Composable[key].value) {
        Value[key] = Composable[key].value
      }
    })
    Value.region = instanceFlavorRegion.value.name
    Value.usage_limit = -1 // unlimited
    
    delete Value.instanceFlavorRegion
    delete Value.usageLimit

    const response = await addFlavor(Value)
    if (response.status == 200) {
      context.root.$router.go(-1)
      setopendialogcommonsuccess(true)
    }
  }
  const instance = ref('')
  const editPackage = async (flavorbeingedit) => {
    $flavorValidator.value.$touch()
    if ($flavorValidator.value.$errors.length) return
    const Value = {}
    Keys.forEach((key) => {
      if (Composable[key].value) {
        Value[key] = Composable[key].value
      }
    })
    Value.id = flavorbeingedit.id
    return await editFlavor(Value).then(() => {
      context.root.$router.go(-1)
      setopendialogcommonsuccess(true)
    })
  }
  const s3Options = ref({})
  // Watchd
  watch(s3Options, val => {
    fetchS3Flavors(val)
  })
  
  const optionsstorage = ref({})

  // Watchd
  watch(optionsstorage, val => {
    fetchstoragesizes(val)
  })

  // Return Data
  return {
    instancesizealreadyexist,
    $flavorValidator,
    flavors,
    instance,
    masterInstances,
    fetchflavors,
    fetchdefaultstoragesize,
    defaultstoragesize,
    ...Composable,
    ...Validation,
    usageUnlimited,
    plans,
    planSelected,
    createPackage,
    editPackage,
    fetchstoragesizes,
    storagesizes,
    fetchflavorById,
    paginationstorage,
    optionsstorage,
    defaultcpu, 
    defaultram, 
    defaultdisk,
    defaultgpu,
    fetchS3DefaultPrice,
    fetchS3Flavors,
    deleteS3Flavor,
    createS3Flavor,
    s3Flavors,
    s3Pagination,
    s3Default,
    s3Options,
    instanceFlavorRegion,
    insufficientCPU,
    insufficientRAM,
  }
}