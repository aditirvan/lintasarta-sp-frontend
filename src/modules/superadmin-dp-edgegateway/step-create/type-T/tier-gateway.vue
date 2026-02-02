<template>
  <div style="height: 100%">
    <v-row style="height: 100%">
      <v-col cols="12" class="d-flex flex-column px-6 pt-0">
        <div class="d-flex">
          <v-row>
            <v-col cols="12" md="12" class="pt-0 pb-0 d-flex">
              <p class="font-weight-bold fz-16">Tier-O Gateway</p>
              <!-- <p>{{ organization }}</p> -->
              <v-spacer></v-spacer>
              <!-- <v-text-field
                class="search mr-2"
                placeholder="Search Name"
                outlined
                hide-details
                style="max-width: 200px;"
                v-model="searchTier"
                clearable
                dense
                ></v-text-field> -->
            </v-col>
          </v-row>
        </div>

        <div class="d-flex">
          <v-row>
            <v-col>
              <v-data-table
              :headers="headers"
              :items="listEksternalNetwork"
              :items-per-page="10"
              :server-items-length="TotalRowsEksternalNetwork"
              :loading="isLoading"
              class="elevation-0 scroll"
              hide-default-footer
              item-key="id"
              show-expand
              :expanded.sync="expanded"
              >
                <template #[`item.id`]="{ item }">
                  <v-radio-group v-model="radioTable" class="my-0 py-0" hide-details>
                    <v-radio class="" :value="item.id" @click="() => { value.tier = item }" :key="listEksternalNetwork.indexOf(item)"></v-radio>
                  </v-radio-group>
                </template>

                <template v-slot:item.ip_usage="{ item }">
                  {{ Math.floor(((item.usedIpCount/item.totalIpCount)*100)) }}% {{ `(Total: ${item.totalIpCount})` }}
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                  <td></td>
                  <td :colspan="2">
                    <p class="mb-1">Subnets</p>
                    <div class="" v-for="(subnet, key) in item.subnets" :key="key">
                      <span class="black--text ml-1"> {{ subnet.gateway + "/" + subnet.prefixLength }} </span>
                    </div>
                  </td>
                  <td>
                    <p class="mb-8"></p>
                    <div class="" v-for="(subnet, key) in item.subnets" :key="key">
                      <span class="black--text "> {{ Math.floor(((subnet.usedIpCount/subnet.totalIpCount)*100)) }}% {{ `(Total: ${subnet.totalIpCount})` }} </span>
                    </div>
                  </td>
                </template>

                <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                  @input="
                    (val) => {
                      changePage(val)
                    }
                  "
                  :props="props" />
                </template>
              </v-data-table>
              <p class="font-italic red--text" v-if="$v.rule.tier.$errors.length">*Please choose the gateway  </p>
            </v-col>
          </v-row>
        </div>

        <div class="d-flex mt-auto align-self-end">
          <v-row>
            <v-col>
              <router-link :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}`"> <v-btn color="#a5b3bf" width="160px" class="white--text fz-12 mr-2" depressed height="40"> Cancel </v-btn></router-link>
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
import { onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGVDC } from '@/modules/superadmin-dp-orgVdc/namespace';
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'

export default {
  props: ["value", "step", "provider", "enabledDedicate"],
  setup(props, context) {
    const { fetchEksternalNetwork } = useNamespacedActions(ORGVDC, ["fetchEksternalNetwork"])
    const { isLoading, listEksternalNetwork, TotalRowsEksternalNetwork } = useNamespacedGetters(ORGVDC, ["isLoading", "listEksternalNetwork", "TotalRowsEksternalNetwork"])

    onMounted(async() => {
      console.log(props)
      radioTable.value = props.value?.tier?.id
      let href = props.provider?.href
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // console.log(splitHref)
      providerId.value = splitHref[4]
      options.value = { ...options.value, providerId: providerId.value }

      await fetchEksternalNetwork(options.value)
    })

    const searchTier = ref('')
    const radioTable = ref()
    const providerId = ref()
    const expanded = ref([])
    const headers = ref([
      { text: "", value: "id", sortable: false, width: "15px" },
      { text: "", value: "data-table-expand", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "IP Pool Usage", value: "ip_usage", sortable: false },
    ])

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      type: 'createEdgeTier',
      enabledDedicate: props.enabledDedicate
      // providerId: props.provider
    })

    const $v = useVuelidate(
      {
        rule: { 
          tier: { required },
        }
      },
      {
        // name, description
        rule: props.value
      })


    const changePage = async(val) => {
      // console.log(val)
      let newVal = { ...val, providerId: providerId.value, type: 'createEdgeExNetwork', enabledDedicate: props.enabledDedicate }
      await fetchEksternalNetwork(newVal)
    }

    let search = null;
    watch(searchTier, (val) => {
      if (search) {
          clearTimeout(search);
          search = setTimeout(async function() {
          options.value.page = 1 
          options.value = { ...options.value, search: val };
          await fetchEksternalNetwork(options.value)
          }, 1000);
      } else {
          search = setTimeout(function() {}, 1000);
      }
    });

    const next = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;

      context.emit("update:step", props.step + 1);
    };
    const prev = () => {
      context.emit("update:step", props.step - 1);
    };
    
    return{
      prev,
      next,
      headers,
      searchTier,
      radioTable,
      options,
      changePage,
      listEksternalNetwork,
      isLoading,
      TotalRowsEksternalNetwork,
      expanded,
      $v,
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
}
</style>