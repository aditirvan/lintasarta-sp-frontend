<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-row class="ml-2">
            <v-col cols="6" class="pb-0">
              <div class="firewall-title ml-5">Firewall Rules</div>
            </v-col>
            <v-col cols="6" class="pt-0">
              <!-- v-if="actionMove" -->
              <v-row class="ml-2 mr-5" v-if="actionMove">
                <v-col><v-btn block color="primary" outlined @click="save()">SAVE</v-btn></v-col>
                <v-col><v-btn block color="primary" outlined @click="cancel()">CANCEL</v-btn></v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="ml-2 mr-4">
            <v-col cols="4" class="pt-0">
              <v-row class="ml-2" v-if="!read_only">
                <v-col class="d-flex align-items-center">Enabled</v-col>
                <v-col class="d-flex"><v-switch v-model="selectEnable"></v-switch></v-col>
              </v-row>
            </v-col>
            <v-col cols="5"></v-col>
            <v-col cols="3" class="mt-4">
              <v-btn
                block
                color="secondary"
                outlined
                dark
                v-if="!read_only"
                @click="
                  () => {
                    addRule = true;
                  }
                "
                >Create Rules</v-btn
              >
            </v-col>
          </v-row>
          <v-container fluid class="px-7 pt-0"
            ><v-data-table
              :headers="headers"
              :items="listRuleFirewallNsxv"
              item-key="no"
              single-line
              class="elevation-0"
              :loading="loadingRule"
              hide-default-footer
              disable-pagination
            >
              <template #[`item`]="{ item, index }">
                <tr @click="getSelected(item, index)" :class="row == item.ruleId ? 'blue lighten-4' : ''">
                  <td>
                    <v-card class="scroll">
                      <span
                        >{{ listRuleFirewallNsxv.indexOf(item) + 1 }}
                        <v-icon small :color="item.enabled == true ? 'success' : 'red'">{{ item.enabled == true ? "mdi-check" : "mdi-close" }}</v-icon></span
                      >
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span
                        @click="
                          () => {
                            editName = true;
                            dataEditName = item;
                          }
                        "
                        >- {{ item.name }}</span
                      ><br />
                      <span>- {{ item.ruleType }}</span>
                    </v-card>
                  </td>

                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0"
                          ><div v-if="!item.source">Any</div>
                          <div v-else>
                            <div v-if="item.source.ipAddress" v-for="(row, index) in item.source.ipAddress" :key="'A' + index">
                              {{ row }}
                            </div>
                            <div v-if="item.source.vnicGroupId" v-for="(row1, index1) in item.source.vnicGroupId" :key="'B' + index1">
                              {{ row1 }}
                            </div>
                            <div v-if="item.source.groupingObjectId" v-for="(row2, index2) in item.source.groupingObjectId" :key="'C' + index2">
                              {{ row2 }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0"
                          ><div v-if="!item.destination">Any</div>
                          <div v-else>
                            <div v-if="item.destination.ipAddress" v-for="(row, index) in item.destination.ipAddress" :key="'D' + index">
                              {{ row }}
                            </div>
                            <div v-if="item.destination.vnicGroupId" v-for="(row1, index1) in item.destination.vnicGroupId" :key="'E' + index1">
                              {{ row1 }}
                            </div>
                            <div v-if="item.destination.groupingObjectId" v-for="(row2, index2) in item.destination.groupingObjectId" :key="'F' + index2">
                              {{ row2 }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0">
                          <div v-if="!item.application">Any</div>
                          <div v-else v-for="(row, index) in item.application.service" :key="'G' + index">
                            {{ row.protocol }} : <span v-if="row.protocol == 'icmp'">{{ row.icmpType }}</span>
                            <span v-else v-for="(data, index1) in row.port" :key="'H' + index1"
                              >{{ data }} : <span v-for="(dt, index2) in row.sourcePort" :key="'I' + index2">{{ dt }}</span></span
                            >
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.action }}</span>
                    </v-card>
                  </td>
                  <td v-if="!read_only">
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0 pr-0"
                          ><v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn icon small v-bind="attrs" v-on="on" :disabled="index == listRuleFirewallNsxv.length - 1 || index == 0"
                                ><router-link :to="`/dp-security/${$route.params.idVdc}/${$route.params.idEdge}/${item.ruleId}`"
                                  ><v-icon color="primary" small>mdi-square-edit-outline</v-icon></router-link
                                ></v-btn
                              >
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
                                    deleteRule = true;
                                    row = item.ruleId;
                                    idIndex = index;
                                  }
                                "
                                :disabled="index == listRuleFirewallNsxv.length - 1 || index == 0"
                                ><v-icon color="red" small>mdi-trash-can-outline</v-icon></v-btn
                              >
                            </template>
                            <span>Delete</span>
                          </v-tooltip>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                small
                                v-bind="attrs"
                                v-on="on"
                                @click="moveDown(item.ruleId)"
                                :disabled="index == listRuleFirewallNsxv.length - 1 || index == 0 || index == listRuleFirewallNsxv.length - 2"
                                ><v-icon color="primary" small>mdi-arrow-down-thick</v-icon></v-btn
                              >
                            </template>
                            <span>Down</span>
                          </v-tooltip>
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                small
                                v-bind="attrs"
                                v-on="on"
                                @click="moveUp(item.ruleId)"
                                :disabled="index == 0 || index == listRuleFirewallNsxv.length - 1 || index == 1"
                                ><v-icon color="primary" small>mdi-arrow-up-thick</v-icon></v-btn
                              >
                            </template>
                            <span>Up</span>
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
    <DialogEditName :edit-name.sync="editName" :data-edit="dataEditName"></DialogEditName>
    <DialogNewRule :new-rule.sync="addRule"></DialogNewRule>
    <DialogAddService :dialog-add.sync="openDialog" :id-service="idService"></DialogAddService>
    <DialogAddDestination :dialog-destination.sync="openDestination" :id-service="idService"></DialogAddDestination>
    <DialogAddSource :dialog-source.sync="openSource" :id-service="idService"></DialogAddSource>
    <!-- <DialogAddIp :dialog-ip.sync="openIp" :id-service="idService"></DialogAddIp> -->
    <DialogIpSource :ip-source.sync="ipSource" :id-service="idService"></DialogIpSource>
    <DialogDeleteService :open-delete.sync="openDelete" :id-delete="idDelete" :id-service="idService"></DialogDeleteService>
    <DialogDeleteDestination
      :delete-destination.sync="deleteDestination"
      :id-delete="idDelete"
      :id-service="idService"
      :action="action"
    ></DialogDeleteDestination>
    <DialogDeleteSource :delete-source.sync="deleteSource" :id-delete="idDelete" :id-service="idService" :action="action"></DialogDeleteSource>
    <DialogDeleteRule :delete-rule.sync="deleteRule" :id-delete="row" :id-index="idIndex" :move.sync="move"></DialogDeleteRule>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { reactive, ref } from "@vue/composition-api";
import DialogAddService from "./dialog-add-service.vue";
import DialogAddDestination from "./dialog-add-destination.vue";
// import DialogAddIp from "./dialog-ip-destination.vue";
import DialogAddSource from "./dialog-add-source.vue";
import DialogIpSource from "./dialog-ip-source.vue";
import DialogDeleteService from "./dialog-delete-service.vue";
import DialogDeleteDestination from "./dialog-delete-destination.vue";
import DialogDeleteSource from "./dialog-delete-source.vue";
import { DPSECURITY } from "../namespace";
import DialogNewRule from "./dialog-new-rule.vue";
import DialogEditName from "./dialog-edit-name.vue";
import DialogDeleteRule from "./dialog-delete-rule.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DialogAddService,
    DialogAddDestination,
    // DialogAddIp,
    DialogAddSource,
    DialogIpSource,
    DialogDeleteService,
    DialogDeleteDestination,
    DialogDeleteSource,
    DialogNewRule,
    DialogEditName,
    DialogDeleteRule,
  },
  setup(props, context) {
    const { listRuleFirewallNsxv, loadingRule, payloadRuleFirewallNsxv } = useNamespacedGetters(DPSECURITY, ["listRuleFirewallNsxv", "loadingRule", "payloadRuleFirewallNsxv"]);
    const { updateRuleFirewallNsxv, getListFirewallRuleNsxv } = useNamespacedActions(DPSECURITY, ["updateRuleFirewallNsxv", "getListFirewallRuleNsxv"]);
    const row = ref(0);
    const openDialog = ref(false);
    const addRule = ref(false);
    const openDestination = ref(false);
    const openSource = ref(false);
    const openIp = ref(false);
    const ipSource = ref(false);
    const openDelete = ref(false);
    const editName = ref(false);
    const dataEditName = ref({});
    const deleteDestination = ref(false);
    const deleteSource = ref(false);
    const deleteRule = ref(false);
    const move = ref(false);
    const actionMove = ref(false);
    const idService = ref(0);
    const idDelete = ref(0);
    const idIndex = ref(0);
    const action = ref("");
    const selectEnable = ref(true);

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Security'));

    const headers = ref( read_only.value ? [
      { text: "No", value: "ruleId", sortable: false, width: "7%" },
      { text: "Name", value: "name", sortable: false, width: "15%" },
      // { text: "Type", value: "ruleType", sortable: false },
      { text: "Source", value: "source", sortable: false, width: "19%" },
      { text: "Destination", value: "destination", sortable: false, width: "19%" },
      { text: "Service", value: "application", sortable: false, width: "18%" },
      { text: "Action", value: "action", sortable: false, width: "5%" },
    ] : [
      { text: "No", value: "ruleId", sortable: false, width: "7%" },
      { text: "Name", value: "name", sortable: false, width: "15%" },
      // { text: "Type", value: "ruleType", sortable: false },
      { text: "Source", value: "source", sortable: false, width: "19%" },
      { text: "Destination", value: "destination", sortable: false, width: "19%" },
      { text: "Service", value: "application", sortable: false, width: "18%" },
      { text: "Action", value: "action", sortable: false, width: "5%" },
      { text: "Action", value: "value", sortable: false },
    ]);
    const getSelected = (item, index) => {
      // row.value = item.ruleId;
      move.value = true;
      idIndex.value = index;
    };
    const del = (index) => {
      idDelete.value = index;
    };
    const blockData = (value) => {};
    const moveUp = (id) => {
      actionMove.value = true;
      // const id = row.value;
      row.value = id;
      const index = listRuleFirewallNsxv.value.findIndex((e) => e.ruleId == id);
      if (index > 0) {
        const el = listRuleFirewallNsxv.value[index];
        context.root.$set(listRuleFirewallNsxv.value, index, listRuleFirewallNsxv.value[index - 1]);
        context.root.$set(listRuleFirewallNsxv.value, index - 1, el);
      }
    };
    const moveDown = (id) => {
      actionMove.value = true;
      // const id = row.value;
      row.value = id;
      const index = listRuleFirewallNsxv.value.findIndex((e) => e.ruleId == id);
      if (index !== -1 && index < listRuleFirewallNsxv.value.length - 1) {
        const el = listRuleFirewallNsxv.value[index];
        context.root.$set(listRuleFirewallNsxv.value, index, listRuleFirewallNsxv.value[index + 1]);
        context.root.$set(listRuleFirewallNsxv.value, index + 1, el);
      }
    };
    const save = () => {
      const id = context.root.$route.params.idEdge;
      const params = {
        featureType: payloadRuleFirewallNsxv.value.featureType,
        version: payloadRuleFirewallNsxv.value.version,
        enabled: payloadRuleFirewallNsxv.value.enabled,
        defaultPolicy: payloadRuleFirewallNsxv.value.defaultPolicy,
        globalConfig: payloadRuleFirewallNsxv.value.globalConfig,
        firewallRules: {
          firewallRules: listRuleFirewallNsxv.value,
        },
      };
      updateRuleFirewallNsxv({ id: id, params: params });
      move.value = false;
      actionMove.value = false;
      row.value = 0;
    };
    const cancel = () => {
      const id = context.root.$route.params.idEdge;
      getListFirewallRuleNsxv(id);
      move.value = false;
      actionMove.value = false;
      row.value = 0;
    };

    return {
      listRuleFirewallNsxv,
      headers,
      getSelected,
      blockData,
      moveUp,
      row,
      openDialog,
      openDestination,
      openSource,
      openIp,
      ipSource,
      moveDown,
      idService,
      loadingRule,
      del,
      openDelete,
      idDelete,
      deleteDestination,
      deleteSource,
      action,
      addRule,
      editName,
      dataEditName,
      move,
      deleteRule,
      idIndex,
      actionMove,
      save,
      cancel,
      payloadRuleFirewallNsxv,
      selectEnable,
      read_only,
    };
  },
};
</script>

<style lang="scss" scoped>
// ::v-deep .v-input__slot .center {
//   justify-content: center;
// }

::v-deep .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  // font-weight: bold;
  font-size: 12px !important;
}

::v-deep .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-size: 14px !important;
  // font-weight: bold;
}
::v-deep .v-input--selection-controls__input .v-icon {
  width: 70%;
}

.scroll {
  height: 65px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}
</style>
