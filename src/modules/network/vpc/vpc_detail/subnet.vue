<template>
   <div>
    <v-card class="rounded-lg" flat>
      <v-card-text class="pa-8">
        <v-row class="">
          <v-col class="d-flex py-0">
            <p class="d-flex fz-21 font-weight-bold align-center justify-center">Subnet</p>
            <v-spacer />
            <!-- <v-btn
            depressed
            width="150"
            height="50"
            class="secondary fz-14"
            @click="() => {
              dialogAdd = true
            }"
            >
              Create NAT
            </v-btn> -->
          </v-col>
        </v-row>

        <v-data-table
        class="my-3"
        :headers="headersNetwork"
        :items="subnets"
        :items-per-page="10"
        :options.sync="options"
        :server-items-length="totalRowsSubnets"
        :footer-props="{
          'items-per-page-options': [10, 20, 50, 100]
        }"
        >
          <template v-slot:no-data>
            <v-progress-circular
            v-if="isLoading"
            indeterminate
            color="primary"
            ></v-progress-circular>
          </template>
          <!-- <template v-slot:footer="{ props }">
            <custom-footer-datatable
            @input="(val) => { options = { ...options, ...val } }"
            :props="props"
            :hidden="true" />
          </template> -->
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import { NETWORKVPC } from '../namespace';
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';

export default {
  props: ["value"],
  setup(props, context) {
    const { vpcid } = context.root._route.params;
    const { subnets, isLoading, totalRowsSubnets, } = useNamespacedState(NETWORKVPC, [
      "subnets",
      "isLoading",
      "totalRowsSubnets",
    ]);
    
    const { fetchSubnet, } = useNamespacedActions(NETWORKVPC, [
      "fetchSubnet",
    ]);

    const projek = JSON.parse(localStorage.getItem('currentProj'))
    const headersNetwork = ref([
      { text: "Name", value: "name", sortable: false,},
      // { text: "Network Address", value: "network", sortable: false,  },
      { text: "Gateway IP", value: "gateway_ip", sortable: false,  },
      // { text: "Action", value: "action", sortable: false, },
    ])

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      project_id: projek.openstack_project_id,
      network_id: vpcid
    })

    watch(options, async (val, old) => {
        // loading.value = true
        try{
          if(val){
            await fetchSubnet(val);
          }
        }finally {
            // loading.value = false;
        }
      },
      { deep: true }
    )

    watch(() => props.value, async (newVal) => {
      if(newVal){
        options.value.page = 1
        await fetchSubnet(options.value);
      }
    })

    return{
      options,
      headersNetwork,
      subnets,
      isLoading,
      totalRowsSubnets
    }
  },
}
</script>