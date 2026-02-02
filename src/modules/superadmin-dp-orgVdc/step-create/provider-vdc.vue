<template>
	<div style="height: 100%">
		<v-row style="height: 100%">
			<v-col cols="12" class="d-flex flex-column px-6 pt-0">
				<div class="d-flex">
					<v-row>
						<v-col cols="12" md="8" class="pt-0 pb-0"><p class="font-weight-bold fz-16">Provider VDC</p> </v-col>
					</v-row>
				</div>

				<div class="d-flex">
					<v-row>
						<v-col>
							<v-data-table
							:headers="headers"
							:items="listProviderVdc"
							:options.sync="options"
							:items-per-page="10"
							:server-items-length="TotalRowsProviderVdc"
              :loading="isLoading"
							class="elevation-0 scroll"
							hide-default-footer
              item-key="href"
							>
              <template #[`item.id`]="{ item }">
                <v-radio-group v-model="radioTable" class="my-0 py-0" hide-details>
                  <v-radio :value="item.href" @click="getRow(item)" :key="listProviderVdc.indexOf(item)"></v-radio>
                </v-radio-group>
              </template>

              <template v-slot:item.status="{ item }">
                <v-icon :color="item.status == 'READY' ? 'green' : 'red'">
                  {{ item.status == 'READY' ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                </v-icon>
              </template>

              <template v-slot:item.isEnabled="{ item }">
                {{ item.isEnabled ? 'Enabled' : 'Disabled' }}
              </template>

              <template v-slot:item.cpu="{ item }">
                {{ ((item.cpuUsedMhz/item.cpuLimitMhz)*100).toFixed(2) }}%
              </template>
              
              <template v-slot:item.memory="{ item }">
                {{ ((item.memoryUsedMB/item.memoryLimitMB)*100).toFixed(2) }}%
              </template>

              <template v-slot:item.storage="{ item }">
                {{ ((item.storageUsedMB/item.storageLimitMB)*100).toFixed(2) }}%
              </template>
                <!-- <template #[`item`]="{ item, index }">
                  <tr class="pointer" @click="rowClicked(item, index)" :class="row == item.id ? 'blue lighten-4' : ''">
                    <td>
                      <span>
                        {{ item.name }}
                      </span>
                    </td>

                    <td>
                      <span>
                        {{ item.status }}
                      </span>
                    </td>

                    <td>
                      <span>
                        {{ item.state }}
                      </span>
                    </td>

                    <td>
                      <span>
                        {{ item.cpu }}
                      </span>
                    </td>

                    <td>
                      <span>
                        {{ item.memory }}
                      </span>
                    </td>

                    <td>
                      <span>
                        {{ item.storage }}
                      </span>
                    </td>
                  </tr>
                </template> -->
              </v-data-table>
              <p class="font-italic red--text" v-if="$v.providerId.$errors.length">Please choose the provider</p>

						</v-col>
					</v-row>
				</div>
        <v-divider></v-divider>
        <br />
				<div class="d-flex" v-if="listEksternalNetwork.length">
					<v-row>
						<v-col>
              <p class="font-weight-bold">External Networks</p>
							<v-data-table
							:headers="headersEksNetwork"
							:items="listEksternalNetwork"
							:items-per-page="10"
							:server-items-length="TotalRowsEksternalNetwork"
							class="elevation-0 scroll"
							hide-default-footer
							>
							<!-- :options.sync="optionsEksNetwork" -->
                <template v-slot:item.status="{ item }">
                  <v-icon :color="item.status == 'REALIZED' ? 'green' : 'red'">
                    {{ item.status == 'REALIZED' ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                  </v-icon>
                  {{ item.status == 'REALIZED' ? 'Normal' : item.status }}
                </template>

                <template v-slot:item.gateway="{ item }">
                  <div v-for="(subnet, key) in item.subnets" :key="key">
                  {{ subnet.gateway +'/'+ subnet.prefixLength }}
                  </div>
                </template>

                <template v-slot:item.dedicatedOrg="{ item }">
                  {{ item.dedicatedOrg ? item.dedicatedOrg : '-' }}
                </template>

                <template v-slot:item.ip_pool="{ item }">
                  {{ Math.floor(((item.usedIpCount/item.totalIpCount)*100)) }}% {{ `(Total: ${item.totalIpCount})` }}
                </template>
                
                <template v-slot:item.backing_type="{ item }">
                  <!-- {{ item.networkBackings.values[0]. }} -->
                  Distributed Port Group
                </template>

                <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                  @input="
                    (val) => {
                      changePageEksNetwork(val)
                    }
                  "
                  :props="props" />
                </template>
              </v-data-table>
						</v-col>
					</v-row>
				</div>

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
import { computed, onMounted, ref, watch } from '@vue/composition-api'
import { ORGVDC } from '../namespace'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import useVuelidate from '@vuelidate/core';
import { required, minValue,  } from '@vuelidate/validators'

export default {
	props: ["value", "step"],
	setup(props, context) {
		const { fetchProviderVdc, fetchEksternalNetwork } = useNamespacedActions(ORGVDC, ["fetchProviderVdc", "fetchEksternalNetwork"])
    const { listProviderVdc, TotalRowsProviderVdc, isLoading, listEksternalNetwork, TotalRowsEksternalNetwork } = useNamespacedGetters(ORGVDC, ["listProviderVdc", "TotalRowsProviderVdc", "isLoading", "listEksternalNetwork", "TotalRowsEksternalNetwork"])
		onMounted( async() => {
      if(props.value){
        radioTable.value =  props.value?.href

        let href = radioTable.value
        let replaceHref = href.replace("https://", '')
        let splitHref = replaceHref.split("/")
        // console.log(splitHref)
        providerId.value = splitHref[4]
        optionsEksNetwork.value = { ...optionsEksNetwork.value, providerId: providerId.value }
        await fetchEksternalNetwork(optionsEksNetwork.value)
      }
    })
    // const selectedItems = ref([])
		// const isSinggle = ref(true)
    const radioTable = ref();
    const providerId = ref('')

		const headers = ref([
      { text: "", value: "id", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "State", value: "isEnabled", sortable: false },
      { text: "CPU Used", value: "cpu", sortable: false },
      { text: "Memory Used", value: "memory", sortable: false },
      { text: "Storage Used", value: "storage", sortable: false },
    ])
		const headersEksNetwork = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Gateway CIDR", value: "gateway", sortable: false },
      { text: "Dedicated", value: "dedicatedOrg", sortable: false },
      { text: "IP Pool Usage", value: "ip_pool", sortable: false },
      { text: "Backing Type", value: "backing_type", sortable: false },

    ])

    const row = ref(-1)
    const provRow = computed({
      get: () => {
        return props.value
      },
      set: (val) => {
        context.emit("input", val);
      },
    });

		const options = ref({
      page: 1,
      itemsPerPage: 10,
    })

		const optionsEksNetwork = ref({
      page: 1,
      itemsPerPage: 10,
      type: 'createOrgVdcStep3'
    })

    watch(options,async (val) => {
      try {
          await fetchProviderVdc(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const $v = useVuelidate(
      {
        providerId: { required },
      },
      {
        providerId, 
      })

    const changePageEksNetwork = async(val) => {
      let newVal = { ...val, providerId: providerId.value }
      await fetchEksternalNetwork(newVal)
    }

    // watch(optionsEksNetwork,async (val) => {
    //   try {
    //       await fetchEksternalNetwork(val)
    //   } finally {
    //       // loading.value = false;
    //   }
    // },
    //   { deep: true }
    // );

    const rowClicked = (item, index) => {
			row.value = item.id
      context.root.$set(item, 'selected', true)
		}

    const getRow = async(row) => {
      provRow.value = row
      let href = row.href
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // console.log(splitHref)
      providerId.value = splitHref[4]
      optionsEksNetwork.value = { ...optionsEksNetwork.value, providerId: providerId.value }
      await fetchEksternalNetwork(optionsEksNetwork.value)
    };

		const next = () => {
			// getEdgeConnection(detailInstance.value.Name);
      $v.value.$touch();
      if ($v.value.$errors.length) return
      
      provRow.value = {
        href: provRow.value.href,
        name: provRow.value.name
      }
      // context.emit('providerVal', provVal)
      context.emit("update:step", props.step + 1);
		};
		const prev = () => {
			context.emit("update:step", props.step - 1);
		};

    onMounted(() => {
      // console.log(context.root.$store.commit('ORGANIZATIONVDC/setListEksternalNetwork', []))
      context.root.$store.commit('ORGANIZATIONVDC/setListEksternalNetwork', [])
      context.root.$store.commit('ORGANIZATIONVDC/setTotalRowsEksternalNetwork', 0)
    })

		return{
			// selectedItems,
			headers,
			options,
			// isSinggle,
			next,
			prev,
      row,
      rowClicked,
      radioTable,
      getRow,
      listProviderVdc,
      TotalRowsProviderVdc,
      isLoading,
      optionsEksNetwork,
      listEksternalNetwork,
      TotalRowsEksternalNetwork,
      headersEksNetwork,
      changePageEksNetwork,
      providerId,
      $v,
		}
	},
}
</script>

<style lang="scss" scoped>
.pointer{
  cursor: pointer;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
  // font-weight: bold;
}

.scroll {
  height: 350px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: auto;
  background-color: transparent;
}
</style>