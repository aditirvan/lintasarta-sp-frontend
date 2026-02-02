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
            <!-- <div class="d-flex pt-0 mt-0 justify-end align-self-end mb-3">
              <v-btn
              v-if="selectedRows.length"
              color="error"
              width="150"
              height="50"
              class="secondary fz-14"
              depressed
              @click="() => {
                validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                  doDeleteSelected()
                })
              }">
                Delete Selected
              </v-btn>
            </div> -->
            <v-data-table
            show-select
            v-model="selectedRows"
            @toggle-select-all="selectAll"
            :headers="headersWorker"
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
              <template v-slot:item.data-table-select="{ isSelected, select, item }">
                <v-checkbox
                :disabled="item.instance_type != 'worker'"
                :value="isSelected"
                @change="select($event)"
                color="primary"
                hide-details
                style="margin-top: -5px;"
                />
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
                  <!-- <tr v-if="item.openstack_vm_uuid && item.ip_address_external">
                    <td style="padding-top: 0 !important; padding-bottom: 0 !important">
                      Gateway
                    </td>
                    <td style="padding-top: 0 !important; padding-bottom: 0 !important">
                      <span class="mx-2">:</span> {{ item.ip_address_external }}
                    </td>
                  </tr> -->
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
              <template v-slot:item.action="{ item }">
                <span
                v-if="item.instance_type == 'worker' && (item.instance_type == 'worker' && !selectedRows.includes(item))"
                class="error--text delete"
                @click="() => {
                  validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                    selectedItem = item
                    headerDelete = 'Worker'
                    openDialogDelete = true
                  })
                }"
                >Delete</span>
                <span
                v-else
                class="grey--text"
                >Delete</span>
              </template>
              <template v-slot:footer="{ props }">
              <custom-footer-datatable
              @input="
              (val) => {
                options = val ;
              }
              "
              :props="props"/>
            </template>
            </v-data-table>

            <dialog-delete
            v-if="openDialogDelete"
            v-model="openDialogDelete"
            :header="headerDelete"
            :itemSelected="selectedItem"
            @refreshTable="refreshTable"
            @clearItem="selectedRows = []"
            />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { HARBOR } from './namespace'
import dialogDelete from './dialog-delete.vue'

export default {
  components: {
    dialogDelete
  },
  setup(props, context) {
    const { fetchHarborInstance } = useNamespacedActions(HARBOR,["fetchHarborInstance"])
    const { getListHarborInstance, getTRHarborInstance, isLoading, rowsDelete: deleteRows } = useNamespacedGetters(HARBOR, ["getListHarborInstance", "getTRHarborInstance", "isLoading", "rowsDelete"])
    const { harborid } = context.root._route.params;
    const {
        validateprivilages,
      } = useNamespacedActions("HOMEPAGE", [
        "validateprivilages",
      ]);

    const openDialogDelete = ref(false)
    const selectedRows = ref([])
    const selectedItem = ref()
    const headerDelete = ref('')
    const headersWorker = ref([
      // { text: "Name", value: "openstack_instance_name", },
      { text: "Name", value: "service_portal_name", },
      { text: "IP Address", value: "ip", },
      { text: "Region", value: "region", },
      { text: "Flavor", value: "flavor", },
      // { text: "Type", value: "instance_type", },
      { text: "Action", value: "action", sortable: false },
    ])

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      harborid: harborid,
      type: 'all'
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

    watch(selectedRows, (newVal) => {
      // console.log(newVal)
      if(newVal.length){
        let selectedFilter = newVal.map((x) => {
          return x.id
        })
        let rowsDelete = {
          worker_id: selectedFilter
        }

        selectedItem.value = {
          harbor_id: harborid,
          body: rowsDelete
        }
        context.root.$store.commit('DEKAHARBOR/setSelectedRows', [selectedItem.value])
      }else{
        context.root.$store.commit('DEKAHARBOR/setSelectedRows', [])
      }
    })

    const refreshTable = async() => {
      await fetchHarborInstance({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        harborid: harborid,
        type: 'all'
      })
    }

    const selectAll = (e) => {
      if(!selectedRows.value.length){
        selectedRows.value = e.items.filter(x => x.instance_type === 'worker')
      }else{
        selectedRows.value = []
      }
    }

    const doDeleteSelected = async() => {
      let selectedFilter = selectedRows.value.map((x) => {
        return x.id
      })
      let rowsDelete = {
        worker_id: selectedFilter
      }

      selectedItem.value = {
        harbor_id: harborid,
        body: rowsDelete
      }
      // headerDelete.value = 'Selected Worker'
      // openDialogDelete.value = true
    }
    
    return{
      headersWorker,
      options,
      getListHarborInstance,
      getTRHarborInstance,
      isLoading,
      selectedItem,
      openDialogDelete,
      refreshTable,
      validateprivilages,
      selectedRows,
      selectAll,
      doDeleteSelected,
      headerDelete,
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('DEKAHARBOR/setSelectedRows', [])
    next()
  }
}
</script>
<style scoped>
.theme--light.v-data-table tbody tr.v-data-table__selected {
  background: #f5f5f5 !important;
}
.v-input--selection-controls__input span {
  color: #1f60a8 !important;
  /* caret-color: #1f60a8 !important; */
  width: 100%;
}
</style>