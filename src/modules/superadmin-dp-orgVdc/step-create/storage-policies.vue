<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Storage Policies</p> </v-col>
          </v-row>
        </div>

        <div class="d-flex">
          <v-row class="">
            <v-col>
              <v-data-table
              v-model="value.selectedItems"
              :headers="headers"
              :items="listStoragePolice"
              :items-per-page="10"
              :server-items-length="TotalRowsStoragePolice"
              class="elevation-0 scroll"
              hide-default-footer
              show-select
              :single-select="isSinggle"
              item-key="href"
              >
                <template v-slot:item.allocated_storage="{ item }">
                  <div v-if="value.selectedItems.find((e) => e.href == item.href)">
                    <v-text-field
                    type="number"
                    maxlength="50"
                    placeholder="Allocated Storage"
                    single-line
                    outlined
                    dense
                    suffix="GB"
                    v-model="item.allocatedStorage"
                    ></v-text-field>
                  </div>
                </template>

                <template v-slot:item.available_storage="{ item }">
                  <!-- {{ item.networkBackings.values[0]. }} -->
                  {{ formatSize((item.storageTotalMB-item.storageUsedMB)*1024*1024) }}
                </template>

                <template v-slot:item.storageTotalMB="{ item }">
                  <!-- {{ item.networkBackings.values[0]. }} -->
                  {{ formatSize(item.storageTotalMB*1024*1024) }}
                </template>

                <template v-slot:item.allocation_type="{ item }">
                  <!-- {{ item.networkBackings.values[0]. }} -->
                  {{ item.type ? 'Unlimited' : 'Limited' }}
                </template>

                <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                  @input="
                    (val) => {
                      changePageTable(val)
                    }
                  "
                  :props="props" />
                </template>
              </v-data-table>
              <p class="font-italic red--text" v-if="$v.rule.selectedItems.$errors.length">{{ $v.rule.selectedItems.$errors[0].$message }}</p>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-column">
          <v-row class="">
            <v-col md="6">
              <p class="font-weight-bold">Default instantiation policy</p>
              <v-select
              class="mt-0"
              v-model="value.defaultPolicy"
              :items="value.selectedItems"
              outlined
              dense
              single-line
              item-text="name"
              item-value="name"
              return-object
              :error-messages="$v.rule.defaultPolicy.$errors.length ? $v.rule.defaultPolicy.$errors[0].$message : ''"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="8" class="py-0">
              <v-switch
              class="pt-0 mb-1"
              inset
              hide-details
              v-model="value.thinProv"
              :label="`Thin Provisioning`">
              </v-switch>
              <p>Enabling thin provisioning will save storage space by committing it on demand. This will allow over-allocation of storage.</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col md="8" class="py-0">
              <v-switch
              class="pt-0"
              inset
              hide-details
              v-model="value.fastProv"
              :label="`Fast Provisioning`">
              </v-switch>
              <p>Enabling fast provisioning can reduce the time it takes to create virtual machines by using vSphere linked clones. If you disable fast provisioning, all provisioning operations will result in full clones.</p>
            </v-col>
          </v-row>

        </div>
        <!-- </div> -->

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-12 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 6" class="white--text fz-12" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
            </v-col>
          </v-row>
        </div>
        
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { ORGVDC } from '../namespace'
import { formatSize } from "@/lib/formatSize"
import useVuelidate from '@vuelidate/core';
import { required, minLength, helpers  } from '@vuelidate/validators'

export default {
  props: ['value', 'step', "provider",],
  setup(props, context) {
    const { fetchStoragePolice } = useNamespacedActions(ORGVDC, ["fetchStoragePolice"])
    const { listStoragePolice, TotalRowsStoragePolice, isLoading } = useNamespacedGetters(ORGVDC, ["listStoragePolice", "TotalRowsStoragePolice", "isLoading"])
    
    onMounted(async() => {
      // console.log(props.provider)
      // if(!props.value.selectedItems.length){
        let href = props.provider.href
        let replaceHref = href.replace("https://", '')
        let splitHref = replaceHref.split("/")
        // let providerId = splitHref[4]
        providerId.value = splitHref[4]
        await fetchStoragePolice({ ...options.value, providerId: providerId.value})
      // }
    })
   
    const selectedItems = ref([])
    const defaultPolicy = ref([])
    const defaultPolicyItems = ref([])
    const isSinggle = ref(false)
    const providerId = ref()
    const headers = ref([
      { text: "Storage Policy", value: "name", sortable: false },
      { text: "Available Storage", value: "available_storage", sortable: false },
      { text: "Total Storage", value: "storageTotalMB", sortable: false },
      { text: "Allocation Type", value: "allocation_type", sortable: false },
      { text: "Allocated Storage", value: "allocated_storage", sortable: false },

    ])
    const dummyOrg = ref([
      {id: 1, storage_policy: 'Jihan', available_storage: 'Jihan Lugas', total_storage: 'Jihan Lugas', allocation_type: 'Jihan Lugas', allocated_storage: 0 },
      {id: 2, storage_policy: 'Lugas', available_storage: 'Jihan Lugas', total_storage: 'Jihan Lugas', allocation_type: 'Jihan Lugas', allocated_storage: 80},
      {id: 3, storage_policy: 'Dekaprime', available_storage: 'Jihan Lugas', total_storage: 'Jihan Lugas', allocation_type: 'Jihan Lugas', allocated_storage: 100},

    ])
    const row = ref(-1)

    const options = ref({
      page: 1,
      itemsPerPage: 10,
    })

    watch(options,async (val) => {
      try {
          // await fetchApplications(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const $v = useVuelidate(
      {
        rule: {
          selectedItems: { minLength: helpers.withMessage(
              "This field should be at least 1 long",
              val => { 
                let valid = true
                if(val.length == 0){
                  valid = false
                } else{
                  valid = true
                }
                return valid
              }
            ) },
           defaultPolicy: { required } 
        }
      },
      {
        rule: props.value
        // selectedItems, defaultPolicy
      })

    const changePageTable = async(val) => {
      let newVal = { ...val, providerId: providerId.value }
      await fetchStoragePolice(newVal)
    }

    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };

    return{
      selectedItems,
      headers,
      options,
      isSinggle,
      next,
      prev,
      dummyOrg,
      row,
      listStoragePolice,
      TotalRowsStoragePolice,
      changePageTable,
      formatSize,
      defaultPolicy,
      defaultPolicyItems,
      $v,
    }
  },
}
</script>

<style lang="scss" scoped>
// .pointer{
//   cursor: pointer;
// }

::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
  // font-weight: bold;
}

.scroll {
  max-height: 350px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}
</style>