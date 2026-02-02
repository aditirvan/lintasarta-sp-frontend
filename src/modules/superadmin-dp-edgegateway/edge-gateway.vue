<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="">
            <v-row>
              <v-col cols="12" class="d-flex">
                <div class="firewall-title mt-2">Edge Gateway</div>
                <v-spacer></v-spacer>
              <!-- </v-col>
              <v-col cols="3" class="text-right"> -->
                <!-- <v-text-field
                maxlength="50"
                class="search mr-2"
                placeholder="Search"
                outlined
                hide-details
                style="max-width: 200px;"
                v-model="searchOrg"
                clearable
                ></v-text-field> -->

                <v-btn
                link
                width="150"
                height="45"
                class="secondary mt-1"
                depressed
                :to="`/organization-detail/${$route.params.organizationid}/project/${$route.params.project}/create-edge`"
                @click="() =>{
                  
                }"
                >
                  Create Edge Gateway
                </v-btn>
              </v-col>
            </v-row>
            <v-data-table
            :headers="headersTable"
            :items="listEdgeGateway"
            :items-per-page="10"
            :server-items-length="TotalRowsEdgeGateway"
            :loading="isLoading"
            class="elevation-0"
            hide-default-footer
            >
              <template v-slot:item.name="{ item }">
                <span class="primary--text" style="cursor:pointer" @click="detail(item)">
                  {{ item.name }}
                </span>
              </template>

              <template v-slot:item.distributedRoutingEnabled="{ item }">
                {{ item.distributedRoutingEnabled ? 'Enabled' : 'Disabled' }}
              </template>

              <template v-slot:item.gatewayStatus="{ item }">
                <div class="d-flex">
                  <span v-if="item.isBusy">
                    <v-progress-circular :size="18" color="primary" indeterminate></v-progress-circular>
                  </span>
                  <v-icon v-else :color="item.gatewayStatus == 'READY' ? 'green' : 'error'">
                    {{ item.gatewayStatus == 'READY' ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}
                  </v-icon>
                  <span class="mt-1 ml-1">
                    {{ item.gatewayStatus == 'READY' ? 'Normal' : item.gatewayStatus }}
                  </span>
                </div>
              </template>

              <template v-slot:item.orgVdcName="{ item }">
                <v-icon>
                  mdi-cloud-outline
                </v-icon>
                {{ item.orgVdcName }}
              </template>

              <template v-slot:item.edgeGatewayType="{ item }">
                {{ filterType(item.edgeGatewayType) }}
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
                    changePage(val);
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
import { onMounted, ref, watch } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedState, useNamespacedGetters, } from "vuex-composition-helpers";
import { EDGEGATEWAY } from './namespace'

export default {
  setup(props, context) {
    const { fetchEdgeGateway, dekaprimeVdcByProject } = useNamespacedActions(EDGEGATEWAY, ["fetchEdgeGateway", "dekaprimeVdcByProject"])

    const { isLoading, listEdgeGateway, TotalRowsEdgeGateway, vdcProject } = useNamespacedGetters(EDGEGATEWAY, ["isLoading", "listEdgeGateway", "TotalRowsEdgeGateway", "vdcProject"])

    onMounted(async() => {
      currentProj.value = JSON.parse(localStorage.getItem("currentProj"));

      await dekaprimeVdcByProject({projectDPId: currentProj.value.dekaprime_project_id })
      localStorage.setItem('vdcById', JSON.stringify(vdcProject.value))
      await fetchEdgeGateway({ ...options.value, vdc: vdcProject.value.id })

    })
    const currentProj = ref()
    const headersTable = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Status", value: "gatewayStatus", sortable: false, width: '110px' },
      { text: "Type", value: "edgeGatewayType", sortable: false, width: '80px' },
      { text: "Scope", value: "orgVdcName", sortable: false },
      { text: "Distributed Routing", value: "distributedRoutingEnabled", sortable: false },
      // { text: "Used NISc", value: "availableNetCount", sortable: false },
      { text: "External Networks", value: "numberOfExtNetworks", sortable: false },
      { text: "Org VDC Networks", value: "numberOfOrgNetworks", sortable: false },
      { text: "Organizations", value: "orgName", sortable: false },
      { text: "HA State", value: "haStatus", sortable: false },
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
        await fetchEdgeGateway(val)
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
          // options.value.page = 1 
          options.value = { ...options.value, page: 1, vdc: vdcProject.value.id, search: val };
          }, 1000);
      } else {
          search = setTimeout(function() {}, 1000);
      }
    });

    const changePage = async(val) => {
      // let newVal = { ...val }
      // await fetchEdgeGateway(newVal)
    }
    
    const filterType = (item) => {
      let splitType = item.split('_')
      let typeReal = ''
      if(splitType[0] == 'NSXV'){
        typeReal = 'NSX-V'
      }else if(splitType[0] == 'NSXT'){
        typeReal = 'NSX-T'
      }else{
        typeReal = splitType[0]
      }
      return typeReal
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
      localStorage.setItem("detailEdge", JSON.stringify({ name: item.name, id: orgId, type: item.edgeGatewayType, org: item.orgName, orgVdc: item.orgVdcName }))
      // context.root.$router.push(`/manage-edge/${item.name}`)
      context.root.$router.push(`/organization-detail/${context.root.$route.params.organizationid}/project/${context.root.$route.params.project}/detail-edge`)

    }

    return{
      options,
      headersTable,
      isLoading,
      listEdgeGateway,
      TotalRowsEdgeGateway,
      searchOrg,
      filterType,
      detail,
      changePage
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