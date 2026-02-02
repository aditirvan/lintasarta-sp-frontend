<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="12" class="d-flex">
                <div class="firewall-title mt-2">Organizations</div>
                <v-spacer></v-spacer>
              <!-- </v-col>
              <v-col cols="3" class="text-right"> -->
                <v-text-field
                maxlength="50"
                class="search mr-2"
                placeholder="Search"
                outlined
                hide-details
                style="max-width: 200px;"
                v-model="searchOrg"
                clearable
                ></v-text-field>

                <v-btn
                style="height: 50px; width: 150px; font-size: 12px"
                class="secondary mt-1"
                depressed
                @click="() =>{
                  openDialogNew = true
                }"
                >
                  New
                </v-btn>
              </v-col>
            </v-row>
            <br />
            <v-data-table
            :headers="headersTable"
            :options.sync="options"
            :items="listOrgDP"
            :items-per-page="10"
            :server-items-length="TotalRowsOrgDP"
            :loading="isLoading"
            class="elevation-0"
            hide-default-footer
            >
            <template v-slot:item.displayName="{ item }">
              <span class="primary--text" style="cursor:pointer" @click="detail(item)">
                {{ item.displayName }}
              </span>
            </template>
              <template v-slot:item.isEnabled="{ item }">
                {{ item.isEnabled ? 'Enabled' : 'Disabled' }}
              </template>
              <template v-slot:item.canPublish="{ item }">
                {{ item.canPublish ? 'Yes' : 'No' }}
              </template>
              <template v-slot:item.action="{ item }">
                <popupquote
                v-model="item.open"
                :offsetTop="20"
                :documentid="'popup' + item.id"
                offset-y
                allow-overflow
                >
                    <template v-slot:activator="{ on, attrs }">
                      <label v-if="item.status == 'ON-PROGRESS'" class="grey--text">
                        More
                          <v-icon>
                          mdi-chevron-down
                        </v-icon>
                      </label>
                      <label
                        v-else
                        v-bind="attrs"
                        class="primary--text linkpointer"
                        style="position: relative; white-space: nowrap"
                        @click="
                        ($event) => {
                            on.click($event);
                        }
                        "
                        >More
                        <v-icon
                        :class="{
                            rotate: item.open,
                        }"
                        :id="'popup' + item.id"
                        color="primary"
                        >mdi-chevron-down</v-icon
                        >
                        </label>
                    </template>
                    <v-list>  

                      <!-- <v-list-item
                      v-if="item.status == 'CREATED'"
                      style="cursor:pointer"
                      @click="downloadConfig({harbor_id: item.id})"
                      >
                        <v-list-item-title class="mr-4 edit">Kubernates Config</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-else>
                        <v-list-item-title style="color: rgb(0 0 0 / 38%)" class="mr-4">Kubernates Config</v-list-item-title>
                      </v-list-item> -->

                      <v-list-item
                      v-if="item.status == 'CREATED'"
                      style="cursor:pointer;"
                      @click="
                        () => {
                          
                        }
                      ">
                        <v-list-item-title class="">Detail</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-else>
                        <v-list-item-title style="color: rgb(0 0 0 / 38%)" class="mr-4">Detail</v-list-item-title>
                      </v-list-item>

                      <v-list-item style="min-height: 1px; margin-left: -16px; margin-right: -16px">
                        <v-divider style="min-width: 160px" />
                      </v-list-item>

                      <v-list-item
                        @click="
                        () => {
                                                  
                        }
                        ">
                          <v-list-item-title class="error--text"> Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                </popupquote>
              </template>
              <template v-slot:footer="{ props }">
                <custom-footer-datatable
                @input="
                  (val) => {
                    options = val;
                  }
                " 
                :props="props" />
              </template>
            </v-data-table>
            <!-- <v-card flat outlined class="rounded-lg" v-else>
              <v-col md="12">
                <v-card
                  flat
                  class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
                >
                  <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                    <p
                      style="
                        font-size: 16px;
                        margin-bottom: 10px;
                        text-transform: capitalize;
                      "
                      class="font-weight-bold"
                    >
                      Looks like you don’t have any 
                    </p>
                    <v-row>
                      <v-col>
                        <p
                          style="
                            font-size: 12px;
                            color: #a5b3bf;
                            margin-bottom: 20px;
                          "
                        >
                          
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-btn
                          width="100%"
                          append
                          max-width="300"
                          height="50"
                          depressed
                          class="secondary"
                          exact
                          @click="() =>{
                            
                          }"
                        >
                          Create 
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-card> -->
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <dialog-create
    v-if="openDialogNew"
    v-model="openDialogNew"
    @refreshTable="refreshTable"
    />
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState, useNamespacedGetters, } from "vuex-composition-helpers";
import { ORGDP } from './namespace'
import dialogCreate from './dialog-create.vue'

export default {
  components: {
    dialogCreate
  },
  setup(props, context) {
    const { fetchOrgDP } = useNamespacedActions(ORGDP, ["fetchOrgDP"])

    const { isLoading, listOrgDP, TotalRowsOrgDP } = useNamespacedGetters(ORGDP, ["isLoading", "listOrgDP", "TotalRowsOrgDP"])

    const headersTable = ref([
      { text: "Full Name", value: "displayName", sortable: false },
      { text: "Name", value: "name", sortable: false },
      // { text: "Flavor", value: "master",  },
      { text: "State", value: "isEnabled",  },
      { text: "Organizatons VDCs", value: "orgVdcCount", sortable: false },
      { text: "Can Publish", value: "canPublish", sortable: false },
      { text: "Catalogs", value: "catalogCount", sortable: false },
      { text: "vApps", value: "vappCount", sortable: false },
      { text: "Running VMs", value: "runningVMCount", sortable: false },
      { text: "Users", value: "userCount", sortable: false },
    ])
    
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      // projek: currentProj.openstack_project_id
    })
    watch(options,async (val) => {
      try {
        await fetchOrgDP(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    let search = null;
    const searchOrg = ref("")
    watch(searchOrg, (val) => {
      if (search) {
          clearTimeout(search);
          search = setTimeout(function() {
          options.value.page = 1 
          options.value = { ...options.value, search: val };
          }, 1000);
      } else {
          search = setTimeout(function() {}, 1000);
      }
    });
    
    const openDialogNew = ref(false)

    const detail = (item) => {
      localStorage.setItem('detailOrg', JSON.stringify({ name: item.displayName, id: item.id }))
      context.root.$router.push(`/manage-orgdp/${item.displayName}`)
      // /manage-orgdp/${item.displayName}/${item.id}
    }

    const refreshTable = async() => {
      options.value.page = 1
      searchOrg.value = ''
      await fetchOrgDP(options.value)
    }
    return{
      options,
      headersTable,
      isLoading,
      listOrgDP,
      TotalRowsOrgDP,
      searchOrg,
      openDialogNew,
      detail,
      refreshTable
    }
  },
}
</script>

<style lang="scss" scoped>
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
}
</style>