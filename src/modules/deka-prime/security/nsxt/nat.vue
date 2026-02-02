<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-col cols="9" class="pb-0">
            <div class="firewall-title ml-5">NAT</div>
          </v-col>
          <v-row class="ml-2 mr-4">
            <v-spacer></v-spacer>
            <v-col cols="3" class="mt-4">
              <v-btn
                block
                color="secondary"
                outlined
                dark
                v-if="!read_only"
                @click="
                  () => {
                    openDialogAdd = true
                    title = 'Add'
                  }
                "
                > <v-icon small>mdi-plus</v-icon>&nbsp; New</v-btn
              >
            </v-col>
          </v-row>
          <!-- <v-col cols="6" class="pt-0 pb-0 mb-4">
            <v-row class="ml-2" >
              <v-col v-if="!read_only" class="d-flex align-items-center">Show only user-defined rules</v-col>
              <v-col v-if="!read_only" class="d-flex"><v-switch></v-switch></v-col>
            </v-row>
          </v-col> -->
          <v-container fluid class="px-7 pt-0"
            ><v-data-table
              :headers="headers"
              :items="listRuleNatNsxt"
              item-key="no"
              single-line
              class="elevation-0"
              :loading="loadingNat"
              hide-default-footer
              disable-pagination
            >
              <template #[`item`]="{ item }">
                <tr>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.name }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>User defined</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.enabled ? 'Enabled' : 'Disabled' }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.type }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.externalAddresses }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.applicationPortProfile ? item.applicationPortProfile.name : '-' }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.internalAddresses }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.dnatExternalPort ? item.dnatExternalPort : '-' }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.snatDestinationAddresses ? item.snatDestinationAddresses : '-' }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.logging ? 'Enabled' : 'Disabled' }}</span>
                    </v-card>
                  </td>
                  <td>
                      <!-- <span
                      style="cursor:pointer;"
                      class="red--text"
                      @click="() => {
                        openDialogDelete = true
                        row = item
                      }">Delete</span> -->
                      <v-card class="scroll" style="margin-top: -5px">
                      <v-row>
                        <v-col class="pt-0 pr-0"
                          ><v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn icon small v-bind="attrs" v-on="on">
                                <v-icon
                                color="primary"
                                small
                                @click="() => {
                                  row = item
                                  openDialogAdd = true
                                  title = 'Edit'
                                }">
                                  mdi-square-edit-outline
                                </v-icon>
                              </v-btn>
                            </template>
                            <span>Update</span>
                          </v-tooltip>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                small
                                v-bind="attrs"
                                v-on="on"
                                @click="
                                  () => {
                                    openDialogDelete = true
                                    row = item
                                  }
                                "
                                ><v-icon color="red" small>mdi-trash-can-outline</v-icon></v-btn
                              >
                            </template>
                            <span>Delete</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogAddNat
    v-if="openDialogAdd"
    v-model="openDialogAdd"
    :title="title"
    :rowSelected="row"
    />
    <DialogDeleteNat v-if="openDialogDelete" :dialog-delete.sync="openDialogDelete" :rowSelected="row"></DialogDeleteNat>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref, onMounted } from "@vue/composition-api";
import { DPSECURITY } from "../namespace";
import DialogDeleteNat from "./nat/dialog-delete-nat.vue";
import DialogAddNat from './nat/dialog-add-nat.vue'

import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DialogAddNat,
    DialogDeleteNat,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Security'));
    const { listRuleNatNsxt, loadingNat,  } = useNamespacedGetters(DPSECURITY, [
      "listRuleNatNsxt",
      "loadingNat",
    ]);
    const { getListNatRuleNsxt  } = useNamespacedActions(DPSECURITY, [
      "getListNatRuleNsxt",
    ]);

    onMounted(async () => {
      await getListNatRuleNsxt(context.root.$route.params.idEdge)
    });


    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Category", value: "category", sortable: false },
      { text: "State", value: "enabled", sortable: false },
      { text: "Type", value: "type", sortable: false },
      { text: "External IP", value: "externalAddresses", sortable: false },
      { text: "Application", value: "application", sortable: false },
      { text: "Internal IP", value: "internalAddresses", sortable: false },
      { text: "External Port", value: "dnatExternalPort", sortable: false },
      { text: "Destination IP", value: "snatDestinationAddresses", sortable: false },
      { text: "Logging", value: "logging", sortable: false },
      { text: "Action", value: "action", sortable: false, width: '10%' },
      
    ]);
    
    const row = ref('');
    const title = ref('')
    const openDialogAdd = ref(false)
    const openDialogDelete = ref(false);

    return {
      listRuleNatNsxt,
      loadingNat,
      headers,
      row,
      read_only,
      openDialogAdd,
      openDialogDelete,
      title,
    };
  },
};
</script>

<style lang="scss" scoped>
.text-center {
  text-align: center !important;
}
.scroll {
  height: 65px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}
::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-weight: bold;
  font-size: 10px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 11px !important;
  font-weight: bold;
}
</style>
