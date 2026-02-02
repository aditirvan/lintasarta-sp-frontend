<template>
  <div>
    <v-card class="rounded-lg" flat>
      <!-- <div class="d-flex justify-center" v-if="!detailAllEdge">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div> -->
      <v-container fluid class="px-7 py-4">
        <br />
        <v-card class="rounded-lg mt-4 mb-4" flat>
          <v-expansion-panels v-model="panel" multiple>
            <v-expansion-panel>
              <v-expansion-panel-header color="#f1f2f2">IP Usage</v-expansion-panel-header>
              <div :style="panel.includes(0) ? '' : 'display: none'">
                <v-row class="ma-0">
                  <v-col md="12">
                    <v-expansion-panel-content>
                      <v-data-table
                      :headers="headers"
                      :items="listIpUsage"
                      :server-items-length="totalIpUsage"
                      :loading="isLoading"
                      single-line
                      class="elevation-0"
                      hide-default-footer
                      disable-pagination
                      >
                        <template v-slot:footer="{ props }">
                          <custom-footer-datatable
                          @input="
                            (val) => {
                              changePage(val);
                            }
                          " 
                          :props="props" />
                        </template>
                      </v-data-table>
                    </v-expansion-panel-content>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
  
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { DPSECURITY } from '../namespace';

export default {
  setup(props, context) {
    const { getListIpUsage } = useNamespacedActions(DPSECURITY, ["getListIpUsage"])
    const { listIpUsage, totalIpUsage } = useNamespacedGetters(DPSECURITY, [
      "listIpUsage",
      "totalIpUsage"
    ]);

    onMounted(async() => {
      isLoading.value = true
      await getListIpUsage({ ...options.value, idEdge: context.root.$route.params.idEdge})
      isLoading.value = false
    })

    const panel = ref([0]);
    const isLoading = ref(false)

    const headers = ref([
      { text: "Network", value: "networkName", sortable: false,  },
      { text: "IP Address", value: "ipAddress", sortable: false,},
      { text: "Category", value: "category", sortable: false, },
    ]);
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      // projek: currentProj.openstack_project_id
    })

    const changePage = async(val) => {
      isLoading.value = true
      let newVal = { ...val, idEdge: context.root.$route.params.idEdge }
      await getListIpUsage(newVal)
      isLoading.value = false
    }
    
    return{
      panel,
      headers,
      listIpUsage,
      totalIpUsage,
      changePage,
      isLoading,
    }
  },
}
</script>