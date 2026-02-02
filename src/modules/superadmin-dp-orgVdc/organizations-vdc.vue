<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="12" class="d-flex">
                <div class="firewall-title mt-2">Organizations VDC</div>
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
                link
                style="height: 45px; width: 150px; font-size: 12px"
                class="secondary mt-1"
                depressed
                to="/manage-orgvdc/create"
                @click="() =>{
                  
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
            :items="listOrgVdc"
            :items-per-page="10"
            :server-items-length="TotalRowsOrgVdc"
            :loading="isLoading"
            class="elevation-0"
            hide-default-footer
            >
              <template v-slot:item.name="{ item }">
                <span class="primary--text" style="cursor:pointer" @click="detail(item)">
                  {{ item.name }}
                </span>
              </template>

              <template v-slot:item.status="{ item }">
                <v-icon :color="item.status == 'READY' ? 'green' : 'red'">
                  {{ item.status == 'READY' ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                </v-icon>
              </template>

              <template v-slot:item.isEnabled="{ item }">
                {{ item.isEnabled ? 'Enabled' : 'Disabled' }}
              </template>

              <template v-slot:item.networkProviderType="{ item }">
                {{ filterType(item.networkProviderType)}}
              </template>

              <template v-slot:item.cpu="{ item }">
                <v-progress-linear
                :value="(Math.ceil((item.cpuUsedMhz/item.cpuLimitMhz)*100))"
                color="secondary"
                height="20"
                stream
                >
                <strong>{{ (Math.ceil((item.cpuUsedMhz/item.cpuLimitMhz)*100)) }}%</strong>
                </v-progress-linear>
              </template>

              <template v-slot:item.memory="{ item }">
                <v-progress-linear
                :value="(Math.ceil((item.memoryUsedMB/item.memoryLimitMB)*100))"
                color="secondary"
                height="20"
                stream
                >
                <strong>{{ (Math.ceil((item.memoryUsedMB/item.memoryLimitMB)*100)) }}%</strong>
                </v-progress-linear>
              </template>

              <template v-slot:item.storage="{ item }">
                <v-progress-linear
                :value="(Math.ceil((item.storageUsedMB/item.storageLimitMB)*100))"
                color="secondary"
                height="20"
                stream
                >
                <strong>{{ (Math.ceil((item.storageUsedMB/item.storageLimitMB)*100)) }}%</strong>
                </v-progress-linear>
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
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState, useNamespacedGetters, } from "vuex-composition-helpers";
import { ORGVDC } from './namespace'

export default {
  setup(props, context) {
    const { fetchOrgVdc } = useNamespacedActions(ORGVDC, ["fetchOrgVdc"])

    const { isLoading, listOrgVdc, TotalRowsOrgVdc } = useNamespacedGetters(ORGVDC, ["isLoading", "listOrgVdc", "TotalRowsOrgVdc"])

    const headersTable = ref([
      { text: "Name", value: "name", sortable: false, width: "200px" },
      { text: "Status", value: "status", sortable: false },
      { text: "State", value: "isEnabled", sortable: false },
      { text: "Allocation Model", value: "allocationModel", sortable: false, width: "150px" },
      { text: "Organization", value: "orgName", sortable: false, width: "150px" },
      { text: "Backing Type", value: "networkProviderType", sortable: false, width: "150px" },
      { text: "Provider VDC", value: "providerVdcName", sortable: false },
      { text: "vCenter Server", value: "vcName", sortable: false, width: "150px" },
      { text: "Networks", value: "usedNetworksInVdc", sortable: false },
      { text: "vApps", value: "numberOfVApps", sortable: false },
      { text: "Storage Policies", value: "numberOfStorageProfiles", sortable: false, width: "150px" },
      { text: "CPU", value: "cpu", sortable: false, width: "175px" },
      { text: "Memory", value: "memory", sortable: false, width: "175px" },
      { text: "Storage", value: "storage", sortable: false, width: "175px" },
      { text: "Resource Pools", value: "numberOfResourcePools", sortable: false, width: "150px" },
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
        await fetchOrgVdc(val)
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
    
    const filterType = (data) => {
      return data.replace("_", "-")
    }

    const splitIOrgId = (data) => {
      let href = data
      let replaceHref = href.replace("https://", '')
      let splitHref = replaceHref.split("/")
      // let providerId = splitHref[4]
      return splitHref[4]
    }

    const detail = (item) => {
      let orgId = splitIOrgId(item.href)
      console.log(orgId)
      localStorage.setItem("detailOrgVdc", JSON.stringify({ name: item.name, id: orgId }))
      context.root.$router.push(`/manage-orgvdc/${item.name}`)
    }

    return{
      options,
      headersTable,
      isLoading,
      listOrgVdc,
      TotalRowsOrgVdc,
      searchOrg,
      filterType,
      detail
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