<template>
  <div>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7">
            <v-row>
              <!-- <v-col cols="9">
                <div class="firewall-title mt-2">Master</div>
              </v-col> -->
            </v-row>
            <br />
            <v-data-table
            :headers="headersHarborInstance"
            :items="getListHarborInstance"
            :options.sync="options"
            :items-per-page="10"
            :server-items-length="getTRHarborInstance"
            class="elevation-0"
            hide-default-footer
            >
            <template v-slot:no-data>
                <v-progress-circular v-if="isLoading"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <div class="my-7 text-center" v-else>
                  <p
                  style="
                    font-size: 16px;
                    margin-bottom: 10px;
                    text-transform: capitalize;
                  "
                  class="font-weight-bold"
                  >
                    Looks like you don’t have any Worker
                  </p>
                </div>
              </template>
              <template v-slot:item.ip="{ item }">
                 <table class="table-ip" style="border-bottom: none">
                  <tr v-if="item.openstack_vm_uuid && item.ip_address_internal">
                    <td style="padding-top: 0 !important; padding-bottom: 0 !important">
                      Internal
                    </td>
                    <td style="padding-top: 0 !important; padding-bottom: 0 !important">
                      <span class="mx-2">:</span> {{ item.ip_address_internal }}
                    </td>
                  </tr>
                  <tr v-if="item.openstack_vm_uuid && item.ip_address_external">
                    <td style="padding-top: 0 !important; padding-bottom: 0 !important">
                      Gateway
                    </td>
                    <td style="padding-top: 0 !important; padding-bottom: 0 !important">
                      <span class="mx-2">:</span> {{ item.ip_address_external }}
                    </td>
                  </tr>
                  <!-- <tr v-if="item.openstack_vm_uuid && item.ipext">
                    <td style="padding-top: 0 !important; padding-bottom: 0 !important">
                      External
                    </td>
                    <td style="padding-top: 0 !important; padding-bottom: 0 !important">
                      <span class="mx-2">:</span> {{ item.ipext }}
                    </td>
                  </tr> -->
                </table>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import { HARBOR } from './namespace'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'

export default {
  setup(props, context) {
    const { fetchHarborInstance } = useNamespacedActions(HARBOR,["fetchHarborInstance"])
    const { getListHarborInstance, getTRHarborInstance, isLoading } = useNamespacedGetters(HARBOR, ["getListHarborInstance", "getTRHarborInstance", "isLoading"])
    const { harborid } = context.root._route.params;

    const headersHarborInstance = ref([
      { text: "Name", value: "openstack_instance_name", sortable: false },
      { text: "IP Address", value: "ip", sortable: false },
      { text: "Region", value: "region", sortable: false },
      { text: "Flavor", value: "flavor", sortable: false },
    ])

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      harborid: harborid,
      type: 'master'
    })

    watch(options,async (val) => {
      try {
          await fetchHarborInstance(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );
    
    return{
      headersHarborInstance,
      options,
      getListHarborInstance,
      getTRHarborInstance,
      isLoading
    }
  },
}
</script>