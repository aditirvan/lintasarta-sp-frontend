<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pt-0">
            <v-card-text>
              <div class="d-flex flex-row">
                <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
                <p class="fz-21 font-weight-bold mb-0 mt-1">Create Instance</p>
              </div>
            </v-card-text>
            <v-card-text class="pb-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Instance Name</p>
                  <v-text-field
                    placeholder="Instance Name"
                    outlined
                    v-model="name"
                    @blur="$v.name.$touch()"
                    :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text class="pb-0 pt-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Computer Name</p>
                  <v-text-field
                    placeholder="Computer Name"
                    outlined
                    maxlength="15"
                    v-model="computerName"
                    @blur="$v.computerName.$touch()"
                    :error-messages="$v.computerName.$errors.length ? $v.computerName.$errors[0].$message : ''"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text class="pb-0 pt-0">
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Description</p>
                  <v-text-field placeholder="Description" outlined v-model="desc"></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text class="pb-0 pt-0">
              <v-row>
                <v-col sm="12" md="3" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Type</p>
                  <v-radio-group v-model="radioGroup">
                    <!-- <v-radio label="New" value="new"></v-radio> -->
                    <v-radio label="Form Template" value="template"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col sm="12" md="3" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Power On</p>
                  <v-checkbox v-model="powerOn"></v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-text>
              <v-row>
                <v-col
                  ><p style="font-size: 21px" class="font-weight-bold">Templates</p>
                  <v-data-table
                    :headers="headersTemplates"
                    :items="listTemplatesVm"
                    item-key="HREF"
                    single-line
                    class="elevation-0"
                    hide-default-footer
                    :server-items-length="totalTemplatesVm"
                    :loading="isLoadingTable"
                    :items-per-page="itemsPerPage"
                  >
                    <template #[`item.no`]="{ item }">
                      <v-radio-group v-model="radio1">
                        <v-radio :value="item.HREF" @click="getRow(item)" :key="listTemplatesVm.indexOf(item)"></v-radio>
                      </v-radio-group>
                    </template>
                    <template #[`item.Cpus`]="{ item }">
                      <v-row>
                        <v-col>CPU</v-col>
                        <v-col>{{ item.Cpus }}</v-col>
                      </v-row>
                      <v-row>
                        <v-col>Memory</v-col>
                        <v-col>{{ formatSize(item.MemoryMB) }}</v-col>
                      </v-row>
                    </template>
                    <template v-slot:footer="{ props }">
                      <custom-footer-datatable
                        @input="
                          (val) => {
                            options = val;
                            changePage(val);
                          }
                        "
                        :props="props"
                      />
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text style="font-size: 21px" class="font-weight-bold pt-0 pb-0"><p>Storage</p> </v-card-text>
            <v-card-text>
              <v-row>
                <v-col sm="12" md="6" class="pt-0 pb-0"
                  ><p class="font-weight-bold">Storage Policy</p>
                  <v-select
                    :items="listStorage"
                    placeholder="Choose Storage Policy"
                    v-model="storagePolicy"
                    item-text="name"
                    item-value="name"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>

            <div class="p-card" v-if="Object.keys(selected).length !== 0">
              <v-card-text class="font-weight-bold pb-0"> Compute </v-card-text>
              <v-card-text class="pt-0">
                <v-row>
                  <v-col md="3" class="d-flex align-center">Virtual CPUs</v-col>
                  <v-col class="d-flex">
                    <v-text-field :value="selected.Cpus" disabled single-line></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text>
                <v-row>
                  <v-col md="3" class="d-flex align-center">Cores per socket</v-col>
                  <v-col class="d-flex">
                    <v-text-field value="1" disabled single-line></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text>
                <v-row>
                  <v-col md="3" class="d-flex align-center">Number of sockets</v-col>
                  <v-col class="d-flex">
                    <v-text-field value="1" disabled single-line></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-text>
                <v-row>
                  <v-col md="3" class="d-flex align-center">Memory</v-col>
                  <v-col class="d-flex">
                    <v-text-field :value="formatSize(selected.MemoryMB)" disabled single-line></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-text class="font-weight-bold pb-0"> NICs</v-card-text>
              <v-card-text class="pt-0">
                <v-data-table :headers="headersNic" :items="detailTemplates" item-key="id" single-line class="elevation-0 mt-9" hide-default-footer>
                  <template #[`item.NeedsCustomization`]="{ item }">
                    <div>
                      <v-checkbox :input-value="true" disabled :off-icon="'mdi-checkbox-blank-circle-outline'" :on-icon="'mdi-record-circle'">{{
                        true
                      }}</v-checkbox>
                    </div>
                  </template>
                  <template #[`item.IsConnected`]="{ item }">
                    <div>
                      <v-checkbox :input-value="item.IsConnected">{{ item.IsConnected }}</v-checkbox>
                    </div>
                  </template>
                  <template #[`item.Network`]="{ item }">
                    <!-- <span>None</span> -->
                    <v-select :items="networkNics" v-model="detailTemplates[0].Network"
                    @change="($event) => {
                      if($event != 'none'){
                        item.IPAddressAllocationMode = 'DHCP'
                      }else{
                        item.IPAddressAllocationMode = 'NONE'
                      }
                    }"
                    @input="selectNat"></v-select>
                  </template>
                  <template #[`item.NetworkAdapterType`]="{ item }">
                    <v-select :items="listNat" v-model="detailTemplates[0].NetworkAdapterType" @input="selectNat"></v-select>
                  </template>
                  <template #[`item.IPAddressAllocationMode`]="{ item }">
                    <!-- <span>None</span> -->
                    <v-select :items="ipModes" v-model="detailTemplates[0].IPAddressAllocationMode"
                    @change="($event) => {
                      item.IPAddress = ''
                      if($event == 'NONE'){
                        item.Network = 'none'
                      }
                    }"
                    @input="selectNat"></v-select>
                  </template>
                  <template #[`item.IPAddress`]="{ item }">
                    <!-- <span>None</span> -->
                    <ipAddressField
                    v-model="detailTemplates[0]"
                    />
                    <!-- <v-text-field v-if="detailTemplates[0].IPAddressAllocationMode == 'MANUAL'" v-model="detailTemplates[0].IPAddress"></v-text-field> -->
                  </template>
                </v-data-table>
              </v-card-text>
            </div>

            <v-card-text v-if="radioGroup == 'new'">
              <v-row>
                <v-col cols="12" class="d-flex flex-row align-center">
                  <p class="font-weight-bold fz-21 mb-0">Storage</p>
                  <v-spacer />
                  <v-btn width="167" class="success mr-4" depressed @click="addInbound()"> ADD </v-btn>
                </v-col>
              </v-row>
              <div class="balance-table">
                <v-simple-table>
                  <thead>
                    <tr>
                      <th>Disk</th>
                      <th>Storage Policy</th>
                      <th>DPS</th>
                      <th>Size</th>
                      <th class="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody v-if="inbound && inbound.length">
                    <tr class="row-rules" style="vertical-align: top" v-for="(rule, i) in inbound" :key="i">
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>

                      <td>
                        <v-btn
                          @click="
                            () => {
                              deleteInbound(i);
                            }
                          "
                          color="error"
                          depressed
                          width="70"
                          height="45"
                          >Delete</v-btn
                        >
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="6" class="text-center">No data available</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </div>
            </v-card-text>
            <br />

            <v-card-text v-if="radioGroup == 'new'">
              <v-row>
                <v-col cols="12" class="d-flex flex-row align-center">
                  <p class="font-weight-bold fz-21 mb-0">Storage</p>
                  <v-spacer />
                  <v-btn width="167" class="success mr-4" depressed @click="addNetwork()"> ADD </v-btn>
                </v-col>
              </v-row>
              <div class="balance-table">
                <v-simple-table>
                  <thead>
                    <tr>
                      <th>NIC</th>
                      <th>Network</th>
                      <th>Network Adapter Type</th>
                      <th>IP Mode</th>
                      <th>IP Address</th>
                      <th>Primary NIC</th>
                      <th class="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody v-if="listNic && listNic.length">
                    <tr class="row-rules" style="vertical-align: top" v-for="(rule, i) in listNic" :key="i">
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>
                      <td>
                        <v-text-field placeholder="Description" solo></v-text-field>
                      </td>

                      <td>
                        <v-btn
                          @click="
                            () => {
                              deleteNetwork(i);
                            }
                          "
                          color="error"
                          depressed
                          width="70"
                          height="45"
                          >Delete</v-btn
                        >
                      </td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr>
                      <td colspan="6" class="text-center">No data available</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </div>
            </v-card-text>

            <v-card-text>
              <v-row class="d-flex justify-end">
                <v-col class="mb-5">
                  <router-link to="/dp-instance"><v-btn block color="#a5b3bf" class="white--text fz-16" height="58">Cancel</v-btn> </router-link></v-col
                >
                <v-col class="mb-5">
                  <v-btn color="secondary" depressed block height="58" class="fz-16" @click="onSumbit()" :loading="loadingCreate"> Create Instance </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { VDC } from "../namespace";
import { required, minLength, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { DPNETWORK } from "../../networking/namespace";
import ipAddressField from './ipAddress-field.vue'
export default {
  components: {
    ipAddressField
  },
  setup(props, context) {
    const { listTemplatesVm, totalTemplatesVm, isLoadingTable, detailTemplates, listStorage, loadingCreate, networkNics } = useNamespacedGetters(VDC, [
      "listTemplatesVm",
      "totalTemplatesVm",
      "isLoadingTable",
      "detailTemplates",
      "listStorage",
      "loadingCreate",
      "networkNics",
    ]);
    const { fetchListTemplateVm, getDetailTemplates, createVm, getListTemplateVm, getListStorage, getNetworkNics } = useNamespacedActions(VDC, [
      "fetchListTemplateVm",
      "getDetailTemplates",
      "createVm",
      "getListTemplateVm",
      "getListStorage",
      "getNetworkNics",
    ]);
    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);
    onMounted(() => {
      const params = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      getListTemplateVm();
      const payload = {
        vdc_id: params.vmwareProjectId,
        org_id: params.vmwareOrganizationId,
      };
      getListStorage(payload);
      setInterval(() => {
        const deka = localStorage.getItem("dekaPrime");
        if (deka) {
          refresh();
        } else {
          return;
        }
      }, 1000 * 60 * 5);
      refresh();
    });
    const radio1 = ref(false);
    const powerOn = ref(false);
    const desc = ref("");
    const name = ref("");
    const computerName = ref("");
    const radioGroup = ref("template");
    const items = ref(["Linux", "Windows"]);
    const itemsNumber = ref(["1", "2", "3", "4"]);
    const inbound = ref([]);
    const listNic = ref([]);
    const singleSelect = ref(true);
    const selected = ref({});
    const selected2 = ref({});
    const storagePolicy = ref("");
    const itemsPerPage = ref(10);
    const checkNic = ref("");
    const catalogName = ref("");
    const vmTempleteHref = ref("");
    const listNat = ref(["E1000E", "SRIOVETHERNETCARD", "VMXNET3", "VMXNET3VRDMA"]);
    const headersTemplates = ref([
      { text: "", value: "no", sortable: false },
      { text: "Name", value: "Name", sortable: false },
      { text: "vApp Name", value: "ContainerName", sortable: false },
      { text: "Catalog", value: "CatalogName", sortable: false },
      { text: "OS", value: "GuestOS", sortable: false },
      { text: "Compute", value: "Cpus", width: "20%", sortable: false },
      // { text: "Storage", value: "VmPlacementPolicyId", sortable: false },
    ]);
    const headersNic = ref([
      { text: "Primary NIC", value: "NeedsCustomization", sortable: false },
      { text: "NIC", value: "NetworkConnectionIndex", sortable: false },
      { text: "Connected", value: "IsConnected", sortable: false },
      { text: "Network Adapter Type", value: "NetworkAdapterType", sortable: false },
      { text: "Network", value: "Network", sortable: false },
      { text: "IP Mode", value: "IPAddressAllocationMode", sortable: false },
      { text: "IP Address", value: "IPAddress", sortable: false },
      { text: "MAC Address", value: "MACAddress", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ]);

    const onSumbit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const local = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const hasil = detailTemplates.value.length ? true : false;
      const id = local.vmwareProjectId;
      const network = {
        networkConnection: [
          {
            externalIpAddress: detailTemplates.value[0]?.ExternalIPAddress,
            ipAddress: detailTemplates.value[0]?.IPAddress,
            ipAddressAllocationMode: detailTemplates.value[0]?.IPAddressAllocationMode,
            isConnected: detailTemplates.value[0]?.IsConnected,
            macAddress: detailTemplates.value[0]?.MACAddress,
            needsCustomization: detailTemplates.value[0]?.NeedsCustomization,
            network: detailTemplates.value[0]?.Network,
            networkAdapterType: detailTemplates.value[0]?.NetworkAdapterType,
            networkConnectionIndex: detailTemplates.value[0]?.NetworkConnectionIndex,
          },
        ],
        primaryNetworkConnectionIndex: 0,
      };

      const paramsTemplate = {
        allEULAsAccepted: true,
        catalogName: catalogName.value,
        computerName: computerName.value,
        description: desc.value,
        name: name.value,
        networkConnectionSection: hasil == true ? network : {},
        powerOn: powerOn.value,
        storageName: storagePolicy.value,
        vmTempleteHref: vmTempleteHref.value,
      };
      const paramNew = {};
      const payload = {
        id: id,
        body: paramsTemplate,
      };
      if (radioGroup == "new") {
        console.log("masuk new", paramNew);
      } else {
        createVm(payload);
      }
    };
    function addInbound() {
      inbound.value.push({
        type: "SSH",
        ethertype: "IPv4",
        protocol: "TCP",
        port_range_min: "22",
      });
    }
    function deleteInbound(index) {
      inbound.value.splice(index, 1);
    }

    const addNetwork = () => {
      listNic.value.push({
        nic: "",
        network: "",
        type: "",
        mode: "",
        address: "",
        primary: "",
      });
    };

    const deleteNetwork = (index) => {
      listNic.value.splice(index, 1);
    };

    const changePage = (val) => {
      itemsPerPage.value = val.itemsPerPage;
      const params = new URLSearchParams();
      params.append("pageSize", itemsPerPage.value);
      params.append("page", val.page);
      fetchListTemplateVm(params);
    };

    const getRow = (row) => {
      let dp = JSON.parse(localStorage.getItem("dekaPrime"))
      selected.value = row;
      catalogName.value = row.CatalogName;
      vmTempleteHref.value = row.HREF;
      const pattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = row.HREF.match(pattern);
      const id = hasil[6];
      const params = {
        catalog: catalogName.value,
        id: id,
      };

      getDetailTemplates(params);
      getNetworkNics({idVdc: dp.vmwareProjectId })
    };
    const formatSize = (bytes, decimals = 1) => {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };
    const selectNat = (value) => {
      // console.log("value", value);
      // console.log(detailTemplates.value);
    };

    const ipModes = ref([
      { text: 'NONE', value: 'NONE' },
      { text: 'DHCP', value: 'DHCP' },
      { text: 'Static - IP Pool', value: 'POOL' },
      { text: 'Static - Manual', value: 'MANUAL' },
    ])

    const $v = useVuelidate(
      {
        name: {
          required: helpers.withMessage("Instance Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
        },
        computerName: {
          required: helpers.withMessage("Computer Name couldnt be empty.", (val) => {
            return val;
          }),
          minLength: minLength(3),
          specialChars: helpers.withMessage("Can't contain special character", (val) => {
            return !val.match(/[^A-Za-z0-9-_]/g);
          }),
        },
      },
      {
        name,
        computerName,
      }
    );

    return {
      onSumbit,
      powerOn,
      desc,
      name,
      radioGroup,
      items,
      itemsNumber,
      addInbound,
      deleteInbound,
      inbound,
      listNic,
      headersNic,
      addNetwork,
      deleteNetwork,
      computerName,
      singleSelect,
      selected,
      selected2,
      storagePolicy,
      listTemplatesVm,
      headersTemplates,
      totalTemplatesVm,
      changePage,
      isLoadingTable,
      itemsPerPage,
      getRow,
      formatSize,
      detailTemplates,
      checkNic,
      catalogName,
      vmTempleteHref,
      listStorage,
      radio1,
      listNat,
      selectNat,
      $v,
      loadingCreate,
      ipModes,
      networkNics
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-input--selection-controls {
  margin-top: 0px;
}

.p-card {
  padding: 0 9px 20px;
  color: rgba(0, 0, 0, 0.6);
}
::v-deep .v-text-field__details {
  position: static;
}
</style>
