<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container v-if="!isVoucherDiscountLoading">
      <div class="headline font-weight-bold font--text">Edit Voucher Discount</div>

      <div class="pt-6">
        <v-row>
          <v-col cols="6" class="pb-0">
            <p class="font-weight-bold">Type</p>
            <v-radio-group v-model="voucherDiscountType" row >
              <v-radio label="Internal" :value="VoucherDiscountType.INTERNAL" class="pe-4"/>
              <v-radio label="Reseller" :value="VoucherDiscountType.RESELLER"/>
            </v-radio-group>
          </v-col>
        </v-row>

        <div v-if="voucherDiscountType === VoucherDiscountType.INTERNAL">
          <v-row>
            <v-col cols="6">
              <p class="font-weight-bold">Name</p>
              <v-text-field
                v-model="name"
                :error-messages="
                  $v_internal.name.$errors.length ? $v_internal.name.$errors[0].$message : ''"
                outlined
                single-line
                placeholder="Name"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <p class="font-weight-bold">Sales Name</p>
              <v-select
                :disabled="true"
                label="Select Sales"
                :items="sales"
                v-model="selectedSales"
                item-text="fullname"
                return-object
                :error-messages="
                  $v_internal.selectedSales.$errors.length ? $v_internal.selectedSales.$errors[0].$message : ''
                "
                outlined>
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <p class="font-weight-bold">Quota</p>
              <v-text-field
                v-model="quota"
                outlined
                single-line
                placeholder="Quota"
                :error-messages="
                  $v_internal.quota.$errors.length ? $v_internal.quota.$errors[0].$message : ''
                "
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <p class="font-weight-bold">Expired Period</p>
              <v-text-field
                v-model.number="expiredPeriod"
                label="Expired Period"
                value="2"
                :suffix="$v_internal.expiredPeriod.$errors.length ? '' : 'Months'"
                outlined
                single-line
                :error-messages="
                  $v_internal.expiredPeriod.$errors.length ? $v_internal.expiredPeriod.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>
          
        </div>

        <div v-else-if="voucherDiscountType === VoucherDiscountType.RESELLER">
          <v-row>
            <v-col cols="6">
              <p class="font-weight-bold">Name</p>
              <v-text-field
                v-model="name"
                :error-messages="
                  $v_reseller.name.$errors.length ? $v_reseller.name.$errors[0].$message : ''"
                outlined
                single-line
                placeholder="Name"
              ></v-text-field>
            </v-col>

            <v-col cols="6">
              <p class="font-weight-bold">Sales Name</p>
              <v-select
                :disabled="true"
                label="Select Sales"
                :items="sales"
                v-model="selectedSales"
                item-text="fullname"
                return-object
                :error-messages="
                  $v_reseller.selectedSales.$errors.length ? $v_reseller.selectedSales.$errors[0].$message : ''
                "
                outlined>
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <p class="font-weight-bold">Quota</p>
              <v-text-field
                v-model="quota"
                outlined
                single-line
                placeholder="Quota"
                :error-messages="
                  $v_reseller.quota.$errors.length ? $v_reseller.quota.$errors[0].$message : ''
                "
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <p class="font-weight-bold">Expired Period</p>
              <v-text-field
                type="number"
                v-model.number="expiredPeriod"
                label="Expired Period"
                value="2"
                :suffix="$v_reseller.expiredPeriod.$errors.length ? '' : 'Months'"
                outlined
                single-line
                :error-messages="
                  $v_reseller.expiredPeriod.$errors.length ? $v_reseller.expiredPeriod.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <p class="font-weight-bold">Limit Discount</p>
              <v-text-field
                type="number"
                v-model.number="limitDiscount"
                :error-messages="
                  $v_reseller.limitDiscount.$errors.length ? $v_reseller.limitDiscount.$errors[0].$message : ''"
                outlined
                single-line
                placeholder="0"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
      </div>

      <v-divider />

      <div class="headline font-weight-bold font--text pt-8">Service Discount</div>
      
      <div class="pt-6">
        <div>
          <p class="font-weight-bold">Choose Type Instance</p>
          <v-radio-group v-model="voucherDiscountDetailType" row >
            <v-radio label="Instance Based" :value="VoucherDiscountDetailType.INSTANCE_BASED" class="pe-4"/>
            <v-radio label="Instance Flavor" :value="VoucherDiscountDetailType.INSTANCE_FLAVOR"/>
          </v-radio-group>
        </div>

        <div v-if="voucherDiscountDetailType === VoucherDiscountDetailType.INSTANCE_BASED">
          <v-row>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Instance Based</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountInstanceBased"
                suffix="%"
                :error-messages="
                  $v_discount_instance.discountInstanceBased.$errors.length ? $v_discount_instance.discountInstanceBased.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Root Disk</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountRootDisk"
                suffix="%"
                :error-messages="
                  $v_discount_instance.discountRootDisk.$errors.length ? $v_discount_instance.discountRootDisk.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount OS Charging</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountOSCharging"
                suffix="%"
                :error-messages="
                  $v_discount_instance.discountOSCharging.$errors.length ? $v_discount_instance.discountOSCharging.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Object Storage</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountObjectStorage"
                suffix="%"
                :error-messages="
                  $v_discount_instance.discountObjectStorage.$errors.length ? $v_discount_instance.discountObjectStorage.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Storage</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountStorage"
                suffix="%"
                :error-messages="
                  $v_discount_instance.discountStorage.$errors.length ? $v_discount_instance.discountStorage.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Snapshot</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountSnapshot"
                suffix="%"
                :error-messages="
                  $v_discount_instance.discountSnapshot.$errors.length ? $v_discount_instance.discountSnapshot.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Floating IP</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountFloatingIP"
                suffix="%"
                :error-messages="
                  $v_discount_instance.discountFloatingIP.$errors.length ? $v_discount_instance.discountFloatingIP.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div v-else-if="voucherDiscountDetailType === VoucherDiscountDetailType.INSTANCE_FLAVOR">
          <v-row>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Root Disk</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountRootDisk"
                suffix="%"
                :error-messages="
                  $v_discount_flavor.discountRootDisk.$errors.length ? $v_discount_flavor.discountRootDisk.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount OS Charging</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountOSCharging"
                suffix="%"
                :error-messages="
                  $v_discount_flavor.discountOSCharging.$errors.length ? $v_discount_flavor.discountOSCharging.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>
            
          <v-row>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Object Storage</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountObjectStorage"
                suffix="%"
                :error-messages="
                  $v_discount_flavor.discountObjectStorage.$errors.length ? $v_discount_flavor.discountObjectStorage.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Storage</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountStorage"
                suffix="%"
                :error-messages="
                  $v_discount_flavor.discountStorage.$errors.length ? $v_discount_flavor.discountStorage.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Snapshot</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountSnapshot"
                suffix="%"
                :error-messages="
                  $v_discount_flavor.discountSnapshot.$errors.length ? $v_discount_flavor.discountSnapshot.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pb-0 pt-0">
              <p class="font-weight-bold">Discount Floating IP</p>
              <v-text-field
                placeholder="0"
                outlined
                single-line
                type="number"
                v-model.number="discountFloatingIP"
                suffix="%"
                :error-messages="
                  $v_discount_flavor.discountFloatingIP.$errors.length ? $v_discount_flavor.discountFloatingIP.$errors[0].$message : ''
                  "
              ></v-text-field>
            </v-col>
          </v-row>

          <div class="pt-4">
            <p class="font-weight-bold">Discount Flavor</p>
            <v-row>
              <v-col cols="12" md="5" class="pt-0">
                <p>Flavor</p>
                <v-select
                  placeholder="Choose Instace Flavor"
                  :items="instanceFlavorsList"
                  v-model="selectedFlavor"
                  item-text="flavor_name"
                  return-object
                  outlined
                  :error-messages="
                  $v_instanceFlavor.selectedFlavor.$errors.length ? $v_instanceFlavor.selectedFlavor.$errors[0].$message : ''
                  "
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="5" class="pt-0">
                <p>Percentage</p>
                <v-text-field
                  placeholder="0"
                  outlined
                  single-line
                  type="number"
                  v-model.number="selectedFlavorDiscount"
                  suffix="%"
                  :error-messages="
                  $v_instanceFlavor.selectedFlavorDiscount.$errors.length ? $v_instanceFlavor.selectedFlavorDiscount.$errors[0].$message : ''
                  "
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2" class="mb-2 d-flex align-end">
                <v-btn
                  @click="addDiscountFlavor"
                  depressed
                  outlined
                  height="55"
                  width="100%"
                  class="secondary white--text"
                >
                  Add
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <v-data-table
            :headers="discountFlavorHeader"
            :items="discountInstanceFlavors"
          >
            <template v-slot:item.flavor_name="{ item }">
              <div>{{item.instance_flavor.flavor_name}}</div>
            </template>
            <template v-slot:item.discount="{ item }">
              <div>{{item.discount}} %</div>
            </template>
            <template v-slot:item.sn="{ index }">
              <v-btn
                @click="deleteDiscountFlavor(index)"
                depressed
                outlined
                height="55"
                width="150"
                class="error white--text"
              >
                Delete
              </v-btn>
            </template>
          </v-data-table>
        </div>
        
      </div>

      <v-row class="pt-8">
        <v-col>
          <v-btn
            height="58"
            depressed
            block
            color="accent"
            to="/manage-voucher/discount"
            exact
          >
            <span style="font-size: 16px"> Cancel</span>
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            @click="editVoucherDiscount"
            height="58"
            depressed
            block
            color="secondary"
          >
            <span style="font-size: 16px"> Edit Voucher Discount</span>
          </v-btn>
        </v-col>
      </v-row>

    </v-container>
  </v-card>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api"
import { VoucherDiscountType, VoucherDiscountDetailType } from "./type"
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "./namespace";
export default {
  setup(props, context) {

    const { id } = context.root.$route.params

    const { fetchSales, fetchInstanceFlavors, fetchVoucherDiscount, updateVoucherDiscount } = useNamespacedActions(MANAGEVOUCHER, [
      "fetchSales", "fetchInstanceFlavors", "fetchVoucherDiscount", "updateVoucherDiscount"
    ])

    const { sales, instanceFlavors, voucherDiscount, isVoucherDiscountLoading } = useNamespacedState(MANAGEVOUCHER, [
      "sales", "instanceFlavors", "voucherDiscount", "isVoucherDiscountLoading"
    ])

    const vouherDiscountID = ref("")
    const voucherDiscountType = ref(VoucherDiscountType.INTERNAL)
    const selectedSales = ref({})
    const name = ref("")
    const limitDiscount = ref(0)
    const quota = ref(null)
    const expiredPeriod = ref(0)

    const voucherDiscountDetailID = ref("")
    const voucherDiscountDetailType = ref(VoucherDiscountDetailType.INSTANCE_BASED)
    const discountInstanceBased = ref(0)
    const discountRootDisk = ref(0)
    const discountOSCharging = ref(0)
    const discountObjectStorage = ref(0)
    const discountStorage = ref(0)
    const discountSnapshot = ref(0)
    const discountFloatingIP = ref(0)
    const discountInstanceFlavors = ref([])

    const instanceFlavorsList = ref([])
    const selectedFlavor = ref({})
    const selectedFlavorDiscount = ref(0)

    const discountFlavorHeader = ref([
      { text: "Flavor Name", value: "flavor_name" },
      { text: "Percentage", value: "discount", align: 'end' },
      { text: "Action", value: "sn", align: 'center', width:"300" },
    ]);

    const notLessThanZero = helpers.withMessage('Cannot be minus', (val) => {
      return val >= 0 ? true : false
    })

    const shouldGreaterThanZero = helpers.withMessage('Should greater than 0', (val) => {
      return val > 0 ? true : false
    })

    const shouldLessThanDiscountLimit = helpers.withMessage('Must be less or equal than limit discount', (val) => {
      return (voucherDiscountType.value !== VoucherDiscountType.RESELLER || limitDiscount.value <= 0) || (val >= 0 && val <= limitDiscount.value)
    })

    const numericOnly = helpers.withMessage('Should be number or empty', (val) => {
      const reg = new RegExp("^[1-9][0-9]*$")
      if (val === null || val === "") return true
      else return reg.test(val)
    })

    const $v_internal = useVuelidate(
      {
        voucherDiscountType: { required },
        selectedSales: { 
          required,  
          $autoDirty: true,
          notEmpty: helpers.withMessage('Sales cannot be empty', (val) => {
            return val.id !== "" ? true : false
          }) 
        },
        name: {
          required,  
          $autoDirty: true,
        },
        quota: { 
          shouldGreaterThanZero,
          $autoDirty: true,
        },
        expiredPeriod: {
          shouldGreaterThanZero,
          $autoDirty: true,
        }
      },
      { voucherDiscountType, selectedSales, name, quota, expiredPeriod }
    )
    
    const $v_reseller = useVuelidate(
      {
        voucherDiscountType: { required },
        selectedSales: { 
          required,  
          $autoDirty: true,
          notEmpty: helpers.withMessage('Sales cannot be empty', (val) => {
            return val.id !== "" ? true : false
          }) 
        },
        name: {
          required,  
          $autoDirty: true,
        },
        quota: { 
          shouldGreaterThanZero,
          $autoDirty: true,
        },
        expiredPeriod: {
          shouldGreaterThanZero,
          $autoDirty: true,
        },
        limitDiscount: { notLessThanZero },
      },
      { voucherDiscountType, selectedSales, name, quota, expiredPeriod, limitDiscount }
    )

    const $v_discount_instance = useVuelidate(
      {
        voucherDiscountDetailType: { required },
        discountInstanceBased: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
         discountRootDisk: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
         discountOSCharging: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
        discountObjectStorage: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
        discountStorage: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
        discountSnapshot: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
        discountFloatingIP: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
      },
      { voucherDiscountDetailType, discountInstanceBased, discountRootDisk, discountOSCharging, discountObjectStorage, discountStorage, discountSnapshot, discountFloatingIP }
    )

    const $v_discount_flavor = useVuelidate(
      {
        voucherDiscountDetailType: { required },
         discountRootDisk: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
         discountOSCharging: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
        discountObjectStorage: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
        discountStorage: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
        discountSnapshot: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
        discountFloatingIP: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit,
         },
      },
      { voucherDiscountDetailType, discountInstanceBased, discountRootDisk, discountOSCharging, discountObjectStorage, discountStorage, discountSnapshot, discountFloatingIP }
    )

    const $v_instanceFlavor = useVuelidate(
      {
        selectedFlavor: { 
          required,  
          $autoDirty: true,
          notEmpty: helpers.withMessage('Instance flavor cannot be empty', (val) => {
            return val.id !== ""
          }) 
        },
        selectedFlavorDiscount: { 
          required,
          $autoDirty: true,
          notLessThanZero,
          shouldLessThanDiscountLimit, 
        },
      },
      { selectedFlavor, selectedFlavorDiscount }
    )

    const filterInstanceList = () => {
      const selectedInstanceIDs = discountInstanceFlavors.value.map(instance => instance.instance_flavor.id)
      instanceFlavorsList.value = instanceFlavors.value.filter(instance => !selectedInstanceIDs.includes(instance.id))
    }

    const addDiscountFlavor = () => {
      $v_instanceFlavor.value.$touch()
      if($v_instanceFlavor.value.$errors.length) return

      // push selected instance to list
      discountInstanceFlavors.value.push(
        {
          id: "",
          instance_flavor: selectedFlavor.value,
          discount: selectedFlavorDiscount.value,
        }
      )
      // reset input value
      selectedFlavor.value = {}
      selectedFlavorDiscount.value = 0

      // remove selected instance from list so user cannot choice the same item twice
      filterInstanceList()

      // reset error validation
      $v_instanceFlavor.value.$reset()
    }

    const deleteDiscountFlavor = index => {
      // remove selected instance from list
      discountInstanceFlavors.value = discountInstanceFlavors.value.filter((instance, i) => i !== index)

      // add selected instance back to list
      filterInstanceList()
    }

    const editVoucherDiscount = async () => {

      let data = {}

      // validate internal choiche
      if(voucherDiscountType.value === VoucherDiscountType.INTERNAL) {
        $v_internal.value.$touch()
        $v_instanceFlavor.value.$reset()
        if($v_internal.value.$errors.length) return

        data = {
          id: vouherDiscountID.value,
          type: voucherDiscountType.value,
          sales_id: selectedSales.value.id,
          name: name.value,
          quota: parseInt(quota.value),
          expired_period: expiredPeriod.value,
        }
      }

      // validate reseller choice
      if(voucherDiscountType.value === VoucherDiscountType.RESELLER) {
        $v_reseller.value.$touch()
        $v_instanceFlavor.value.$reset()
        if($v_reseller.value.$errors.length) return

        data = {
          id: vouherDiscountID.value,
          type: voucherDiscountType.value,
          sales_id: selectedSales.value.id,
          name: name.value,
          limit_discount: limitDiscount.value,
          quota: parseInt(quota.value),
          expired_period: expiredPeriod.value
        }
      }

      // validate discount
      if(voucherDiscountDetailType.value ===  VoucherDiscountDetailType.INSTANCE_BASED) {
        $v_discount_instance.value.$touch()
        $v_instanceFlavor.value.$reset()
        if($v_discount_instance.value.$errors.length) return
      } else {
        $v_discount_flavor.value.$touch()
        $v_instanceFlavor.value.$reset()
        if($v_discount_flavor.value.$errors.length) return
      }

      let voucherDiscountDetail = {
        id: voucherDiscountDetailID.value,
        type: voucherDiscountDetailType.value,
        root_disk: discountRootDisk.value,
        os_charging: discountOSCharging.value,
        storage: discountStorage.value,
        object_storage: discountObjectStorage.value,
        floating_ip: discountFloatingIP.value,
        snapshot: discountSnapshot.value,
      }

      if(voucherDiscountDetailType.value ===  VoucherDiscountDetailType.INSTANCE_BASED) {
        voucherDiscountDetail['instance_based'] = discountInstanceBased.value
      }

      if(voucherDiscountDetailType.value === VoucherDiscountDetailType.INSTANCE_FLAVOR) {
        const discount_flavors = discountInstanceFlavors.value.map(instance => ({
          id: instance.id,
          package_instance_id: instance.instance_flavor.id,
          discount: instance.discount
        }))

        voucherDiscountDetail = {
          ...voucherDiscountDetail,
          instance_flavors: discount_flavors
        }
      }

      data = {
        ...data,
        voucher_discount_detail: voucherDiscountDetail
      }

      const res = await updateVoucherDiscount({id, data})
      if(res.code == 200){
        context.root.$router.replace('/manage-voucher/discount')
      }
    }

    const setVoucherDiscount = (val) => {
      vouherDiscountID.value = val.id
      voucherDiscountType.value = val.type
      selectedSales.value = val.sales
      name.value = val.name
      limitDiscount.value = val.limit_discount
      quota.value = val.quota
      expiredPeriod.value = val.expired_period
      voucherDiscountDetailID.value = val.voucher_discount_detail.id
      voucherDiscountDetailType.value = val.voucher_discount_detail.type
      discountRootDisk.value = val.voucher_discount_detail.root_disk
      discountOSCharging.value = val.voucher_discount_detail.os_charging
      discountStorage.value = val.voucher_discount_detail.storage
      discountObjectStorage.value = val.voucher_discount_detail.object_storage
      discountFloatingIP.value = val.voucher_discount_detail.floating_ip
      discountSnapshot.value = val.voucher_discount_detail.snapshot

      if(val.voucher_discount_detail.type === VoucherDiscountDetailType.INSTANCE_BASED) {
        discountInstanceBased.value = val.voucher_discount_detail.instance_based
      }

      if(val.voucher_discount_detail.type === VoucherDiscountDetailType.INSTANCE_FLAVOR) {
        const instanceFlavorsData = val.voucher_discount_detail.instance_flavors.map(instance => ({
          id: instance.id,
          instance_flavor: instance.package_instance,
          discount: instance.discount
        }))
        discountInstanceFlavors.value = instanceFlavorsData
      }
    }

    onMounted(async () => {
      fetchSales()
      await fetchInstanceFlavors()

      if (id){
        await fetchVoucherDiscount(id)
        await setVoucherDiscount(voucherDiscount.value)
      }

      filterInstanceList()
    })
    
    return {
      $v_internal,
      $v_reseller,
      $v_discount_instance,
      $v_discount_flavor,
      $v_instanceFlavor,

      VoucherDiscountType,
      VoucherDiscountDetailType,

      voucherDiscountType,
      name,
      quota,
      expiredPeriod,
      limitDiscount,
      voucherDiscountDetailType,
      discountInstanceBased,
      discountRootDisk,
      discountOSCharging,
      discountObjectStorage,
      discountStorage,
      discountSnapshot,
      discountFloatingIP,
      discountInstanceFlavors,
      
      addDiscountFlavor,
      deleteDiscountFlavor,
      editVoucherDiscount,
      sales,
      selectedSales,
      instanceFlavorsList,
      selectedFlavor,
      selectedFlavorDiscount,

      discountFlavorHeader,
      voucherDiscount,
      isVoucherDiscountLoading
    };
  },
};
</script>
