<template>
  <v-card class="rounded-lg pa-7" flat>
    <!-- <v-row>
      <v-col>
        <span class="mb-2" style="font-size: 18px; font-weight: bold; color: #556272;">VPN</span>
      </v-col>
    </v-row> -->
      <!-- <v-row v-if="isLoading || getListPfsense.length">
        <v-col class="d-flex align-center justify-end pt-0 pb-4">
          <v-btn
          width="150"
          class="secondary fz-14"
          depressed
          to="/network/vpn/create"
          >
              Create VPN
          </v-btn>
        </v-col>
      </v-row> -->
      <v-row v-if="isLoading || getListPfsense.length">
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="getListPfsense"
            :options.sync="options"
            :items-per-page="10"
            :server-items-length="getTotalRowsPfsense"
            class="elevation-0"
            hide-default-footer
            >
              <template v-slot:no-data>
                {{ isLoading ? "Loading.." : "No data available" }}
              </template>

              <!-- <template v-slot:item.flavor_name="{ item }">
                <span v-if="item.flavor_name == 'c1.large'">4 VCPU/4GB RAM</span>
                <span v-else-if="item.flavor_name == 'c1.medium'">2 VCPU/2GB RAM</span>
                <span v-else-if="item.flavor_name == 'c1.xlarge'">8 VCPU/8GB RAM</span>
                <span v-else>-</span>
              </template> -->
              <template v-slot:item.ip_public_pfsense="{ item }">
                <span v-if="item.ip_public_pfsense">{{ item.ip_public_pfsense }}</span>
                <span v-else>-</span>
              </template>

              <template v-slot:item.status="{ item }">
                <span
                class="black--text"
                :class="{
                  'success--text': item.status == 'CREATED',
                  'error--text' : item.status == 'FAILED',
                  'grey--text' : item.status == 'ON-PROGRESS' 
                  }"
                >{{ item.status }}</span>
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
                      <label v-if="item.status == 'ON-PROGRESS'">
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
                      <v-list-item
                      v-if="item.status == 'ON-PROGRESS' || item.status == 'FAILED'"
                      class="mr-4"
                      >
                        <v-list-item-title style="color: rgba(0, 0, 0, 0.38)" >Configuration</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                      v-else
                      style="cursor:pointer"
                      @click="toConfigure(item.id, item)"
                      >
                        <v-list-item-title class="mr-4 edit"> Configuration</v-list-item-title>
                      </v-list-item>

                      <v-list-item
                          style="min-height: 1px; margin-left: -16px; margin-right: -16px"
                      >
                          <v-divider style="min-width: 160px" />
                      </v-list-item>

                      <!-- <v-list-item
                      v-if="item.status == 'ON-PROGRESS' || item.status == 'FAILED'"
                      class="mr-4"
                      >
                        <v-list-item-title style="color: rgba(0, 0, 0, 0.38)" >Status OpenVPN</v-list-item-title>
                      </v-list-item>

                      <v-list-item
                      v-else-if="!getListOpenVpn.length"
                      class="mr-4"
                      >
                        <v-list-item-title style="color: rgb(0 0 0 / 38%)">Status OpenVPN</v-list-item-title>
                      </v-list-item>

                      <v-list-item
                      v-else
                      style="cursor:pointer"
                      @click="() => {
                        openStatusOpenVpn(item)
                      }"
                      >
                        <v-list-item-title class="mr-4 edit">Status OpenVPN</v-list-item-title>
                      </v-list-item> -->
                      <v-list-item
                          style="min-height: 1px; margin-left: -16px; margin-right: -16px"
                      >
                          <v-divider style="min-width: 160px" />
                      </v-list-item>

                      <v-list-item
                      v-if="item.status == 'ON-PROGRESS'"
                      class="grey--text"
                      >
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>

                      <v-list-item
                      v-else
                      style="cursor:pointer;"
                      @click="
                        () => {
                          validateprivilages(['Network', 'editor', true]).then(() => {
                            selectedPfsense = item
                            dialogDeletePfsense = true
                          });
                        }
                      ">
                        <v-list-item-title class="error--text">Delete</v-list-item-title>
                      </v-list-item>
                        <!-- <v-list-item
                          @click="
                          () => {
                              packageselected = item.id;
                              opendialogdeletepackage = true;
                              typePackage='onetime'
                          }
                          ">
                            <v-list-item-title class="error--text"
                            > Delete</v-list-item-title
                            >
                        </v-list-item> -->
                    </v-list>
                </popupquote>
                <!-- <span
                  v-if="item.status == 'ON-PROGRESS' || item.status == 'FAILED'"
                  class="mr-4 grey--text"
                  >Configuration</span>

                  <span
                  v-else
                  style="cursor:pointer"
                  class="mr-4 primary--text edit"
                  @click="toConfigure(item.id, item)"
                  >Configuration</span>

                  <span
                  v-if="item.status == 'ON-PROGRESS'"
                  class="grey--text"
                  >Delete</span>

                <span
                v-else
                style="cursor:pointer;"
                class="error--text"
                @click="
                  () => {
                    selectedPfsense = item
                    dialogDeletePfsense = true
                  }
                ">Delete</span> -->
              </template>
              <template v-slot:footer="{ props }">
                <custom-footer-datatable 
                v-if="getListPfsense.length > 5"
                @input="
                  (val) => {
                    options = val;
                  }
                " 
                :props="props" />
            </template>
              <!-- <template v-slot:footer="{ props }">
                  <custom-footer-datatable v-if="vpns.length > 5" :props="props" />
              </template> -->
          </v-data-table>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col md="12">
          <v-card
          outlined
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
              Looks like you don’t have any VPN
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
                    to="/network/vpn/create"
                    >
                    Create VPN
                    </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <dialog-delete-pfsense
      v-if="dialogDeletePfsense == true"
      v-model="dialogDeletePfsense"
      :pfsense="selectedPfsense"
      :textDelete="textDelete"
      @deleteText="textDelete = $event"
      @delete="doDelete"
      />

      <dialogDetail
      v-if="opendialogdetail == true"
      v-model="opendialogdetail"
      :dataValue="selectedItem"
      :headerName="headerName"
      />
    </v-card>
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { VPN } from "../namespace"
import dialogDeletePfsense from './dialogDeletePfsense.vue'
import dialogDetail from './openVpn/dialogStatusOpenVpn2.vue'

export default {
  components: {
    dialogDeletePfsense,
    dialogDetail
  },
    setup(props, context) {
      const { fetchPfsense, deletePfsense, fetchStatusOpenVpn, fetchOpenVpn } = useNamespacedActions(VPN, ["fetchPfsense", "deletePfsense", "fetchStatusOpenVpn", "fetchOpenVpn"])
      const { getListPfsense, getTotalRowsPfsense, isLoading, getListOpenVpn } = useNamespacedGetters(VPN, ["getListPfsense", "getTotalRowsPfsense", "isLoading", "getListOpenVpn"])
      const {
        validateprivilages,
      } = useNamespacedActions("HOMEPAGE", [
        "validateprivilages",
      ]);

      let currentProj = JSON.parse(localStorage.getItem('currentProj'))

      const vpn = ref([])
      const headers = ref([
          // { text: "ID", value: "ID" },
          { text: "Name", value: "real_instance_name", sortable: false  },
          { text: "VPC", value: "existing_vpc_name", sortable: false  },
          { text: "Floating IP", value: "ip_public_pfsense", sortable: false  },
          { text: "Billing Type", value: "billing_type", sortable: false  },
          // { text: "Volume", value: "instance_volume_size" },
          // { text: "Instance Image", value: "instance_image" },
          // { text: "Instance Network", value: "instance_network_mgmt" },
          // { text: "Flavor", value: "flavor_name" },
          { text: "Status", value: "status", sortable: false  },
          { text: "Action", value: "action", align: "center", sortable: false  },
      ]);

      const selectedPfsense = ref(null)
      const textDelete = ref('')
      const dialogDeletePfsense = ref(false)
      const opendialogdetail = ref(false)
      const selectedItem = ref(null)
      const headerName = ref('')

      const options = ref({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        projek: currentProj.openstack_project_id
      })
      
      watch(options,async (val) => {
        try {
            await fetchPfsense(val)
        } finally {
            // loading.value = false;
        }
      },
        { deep: true }
      );

      const doDelete = async() => {
        let payload = {
          id: selectedPfsense.value.id,
          status: selectedPfsense.value.status
        }
        // console.log(payload)
        let resp = await deletePfsense(payload)
        if(resp.status == 200){
          refreshTab()
          dialogDeletePfsense.value = false
          textDelete.value = ''
        }else{
          dialogDeletePfsense.value = false
          textDelete.value = ''
          console.log(resp)
        }
      }

      const checkOpenVpn = async(item) => {
        await fetchOpenVpn({
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          projek: currentProj.openstack_project_id,
          instance_name: item.instance_name
        })
      }

      const openStatusOpenVpn = async (item) => {
        const resp = await fetchStatusOpenVpn({vpnname: item.instance_name})
        if(resp.status){
          selectedItem.value = item
          opendialogdetail.value = true
          headerName.value = 'VPN'
        }
      }

      const toConfigure = (id, item) => {
        // console.log(id)
        // console.log(item)
        // localStorage.setItem('slb_id', id)
        localStorage.setItem('vpn', JSON.stringify(item))
        context.root.$router.push("/network/vpn/config");
      }

      const refreshTab = async() => {
        options.value.page = 1
        await fetchPfsense(options.value)
      }

      onMounted(() => {
        fetchPfsense({
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          projek: currentProj.openstack_project_id
        })
      })

      return {
          vpn,
          headers,
          options,
          getListPfsense,
          isLoading,
          selectedPfsense,
          dialogDeletePfsense,
          textDelete,
          doDelete,
          toConfigure,
          getTotalRowsPfsense,
          opendialogdetail,
          selectedItem,
          headerName,
          validateprivilages,
          openStatusOpenVpn,
          checkOpenVpn,
          getListOpenVpn
      }
  },
}
</script>


<style lang="scss" scoped>
.v-btn {
  height: 55px !important;
}
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
</style>