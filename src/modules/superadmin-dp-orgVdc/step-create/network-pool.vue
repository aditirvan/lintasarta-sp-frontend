<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Network Pool</p> </v-col>
          </v-row>
        </div>

        <div class="d-flex">
          <v-row>
            <v-col md="6" class="py-0 d-flex">
              <p class="mt-4 mr-8 font-weight-bold">Specify Network Pool</p>
              <v-switch
              class="pt-0 mb-1"
              inset
              hide-details
              v-model="value.checkSpecify"
              >
              </v-switch>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex" v-if="value.checkSpecify">
          <v-row class="">
            <v-col>
              <v-data-table
              :headers="headers"
              :items="listNetworkPool"
              :items-per-page="10"
              :server-items-length="TotalRowslistNetworkPool"
              :loading="isLoading"
              class="elevation-0 scroll"
              hide-default-footer
              item-key="name"
              >
              <template #[`item.id`]="{ item }">
                <v-radio-group v-model="radioTable" :disabled="!value.checkSpecify" hide-details class="my-0 py-0">
                  <v-radio
                  v-if="value.checkSpecify"
                  :value="item.name"
                  :key="listNetworkPool.indexOf(item)"
                  @click="() => { 
                    value.poolSelected = {name: item.name, href: `https://iaas.lintasarta.net/api/admin/extension/networkPool/${splitId(item.id)}` 
                    }
                  }"></v-radio>
                  <v-radio v-else></v-radio>
                </v-radio-group>
              </template>

              <template v-slot:item.status="{ item }">
                <v-icon :color="item.status == 'REALIZED' ? 'green' : 'red'">
                  {{ item.status == 'REALIZED' ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                </v-icon>
              </template>

              <template v-slot:item.ip_pool="{ item }">
                {{ ((item.usedBackingsCount/item.totalBackingsCount)*100).toFixed(2) }}% {{ `(Total:${item.totalBackingsCount})`  }}
              </template>

              <template v-slot:item.network="{ item }">
                {{ item.managingOwnerRef.name  }}
              </template>
              <!-- <template v-slot:item.allocated_storage="{ item }">
                <div>
                  <v-text-field
                  type="number"
                  maxlength="50"
                  placeholder="Allocated Storage"
                  single-line
                  outlined
                  dense
                  v-model="item.allocated_storage"
                  ></v-text-field>
                </div>
              </template> -->
              </v-data-table>
              <p class="font-italic red--text" v-if="$v.rule.poolSelected.$errors.length">*Please choose the network pool</p>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-column">
          <v-row class="">
            <v-col md="6">
              <p class="font-weight-bold">Maximum Provisioned Network</p>
              <v-text-field
              v-model="value.max_prov"
              type="number"
              class="mt-0"
              outlined
              dense
              single-line
              :error-messages="$v.rule.max_prov.$errors.length ? $v.rule.max_prov.$errors[0].$message : ''"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
              <v-btn v-if="step > 1" class="fz-12 mr-2" color="secondary" width="160px" depressed outlined height="40" @click="prev()"> Previous </v-btn>
              <v-btn v-if="step <= 7" class="white--text fz-12" color="secondary" width="160px" depressed height="40" @click="next()"> Next </v-btn>
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
import useVuelidate from '@vuelidate/core'
import { required, requiredIf, helpers, minValue, maxValue  } from '@vuelidate/validators'

export default {
  props: ["value", "step", "provider"],
  setup(props, context) {
    const { fetchNetworkPool } = useNamespacedActions(ORGVDC, ["fetchNetworkPool"])
    const { listNetworkPool, TotalRowslistNetworkPool, isLoading } = useNamespacedGetters(ORGVDC, ["listNetworkPool", "TotalRowslistNetworkPool", "isLoading"])
    
    onMounted(async() => {
      // console.log(props.provider)
      let href = props.provider.href
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // let providerId = splitHref[4]
      providerId.value = splitHref[4]
      await fetchNetworkPool({ ...options.value, providerId: providerId.value})
      radioTable.value = props.value?.poolSelected?.name
    })

    const selectedItems = ref([])
    const radioTable = ref();
    const providerId = ref()

    const headers = ref([
      { text: "", value: "id", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Type", value: "poolType", sortable: false },
      { text: "IP Pool Usage", value: "ip_pool", sortable: false },
      { text: "Network Provider", value: "network", sortable: false },

    ])
    const row = ref(-1)

    const options = ref({
      page: 1,
      itemsPerPage: 10,
    })

    // watch(options,async (val) => {
    //   try {
    //       await fetchNetworkPool(val)
    //   } finally {
    //       // loading.value = false;
    //   }
    // },
    //   { deep: true }
    // );

    // watch(selectedItems, (newVal) => {
    //   console.log(newVal)
    // })

    const $v = useVuelidate(
      {
        rule: {
          poolSelected: { minLength: helpers.withMessage(
              "This field should be at least 1 long",
              val => { 
                let valid = true
                if(props.value.checkSpecify){
                  if(val.length == 0){
                    valid = false
                  } else{
                    valid = true
                  }
                }else{
                  valid = true
                }
                return valid
              }
            ) },
           max_prov: { required, minValue: minValue(0), maxValue: maxValue(99000) } 
        }
      },
      {
        rule: props.value
        // selectedItems, defaultPolicy
      })

    const getRow = (row) => {
      // const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      // const id_gateway = row.HREF.match(pattern);
      // const id_vdc = row.Vdc.match(pattern);
      // idVdc.value = id_vdc[6];
      // idGateway.value = id_gateway[6];
      // connectionName.value = row.Name;
      // idHref.value = row.HREF;

      // console.log(row)
    };

    const splitId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
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
      radioTable,
      next,
      prev,
      row,
      getRow,
      $v,
      listNetworkPool,
      TotalRowslistNetworkPool,
      splitId,
      isLoading
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
  // font-weight: bold;
}

.scroll {
  max-height: 700px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: auto;
  background-color: transparent;
}
</style>