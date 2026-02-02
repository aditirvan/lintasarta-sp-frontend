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
            <!-- <v-col cols="4" class="pt-0">
              <v-row class="ml-2" v-if="!read_only">
                <v-col class="d-flex align-items-center">Enabled</v-col>
                <v-col class="d-flex"><v-switch v-model="selectEnable"></v-switch></v-col>
              </v-row>
            </v-col> -->
            <!-- <v-col cols="5"></v-col> -->
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
              :items="listRuleFirewallNsxt"
              item-key="no"
              single-line
              class="elevation-0"
              :loading="loadingRule"
              hide-default-footer
              disable-pagination
            >
              <template #[`item`]="{ item, index }">
                <tr @click="getSelected(item, index)" :class="row == item.id ? 'blue lighten-4' : ''">
                  <!-- No -->
                  <td>
                    <v-card class="scroll">
                      <span v-if="item.id != 'default_rule'">
                        {{ listRuleFirewallNsxt.indexOf(item) + 1 }}
                      </span>
                      <v-icon small v-else>{{ "mdi-lock" }}</v-icon>
                    </v-card>
                  </td>

                  <!-- Name -->
                  <td>
                    <v-card class="scroll">
                      <span
                        @click="
                          () => {
                            editName = true;
                            dataEditName = item;
                          }
                        "
                        > {{ item.name }}</span
                      ><br />
                    </v-card>
                  </td>

                  <!-- Category -->
                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0"
                          >
                          {{ item.id == 'default_rule' ? 'Default' : 'User Defined' }}
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>

                  <!-- State -->
                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0">
                          {{ item.enabled ? 'Enabled' : 'Disabled' }}
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>

                  <!-- Applications -->
                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0">
                          <div v-if="!item.applicationPortProfiles">-</div>
                          <div v-else v-for="(row, index) in item.applicationPortProfiles" :key="'G' + index">
                            <!-- {{ row.protocol }} : <span v-if="row.protocol == 'icmp'">{{ row.icmpType }}</span>
                            <span v-else v-for="(data, index1) in row.port" :key="'H' + index1"
                              >{{ data }} : <span v-for="(dt, index2) in row.sourcePort" :key="'I' + index2">{{ dt }}</span></span
                            > -->
                            - {{ row.name }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>

                  <!-- Source -->
                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0">
                          <div v-if="!item.sourceFirewallGroups">Any</div>
                          <div v-else v-for="(row, index) in item.sourceFirewallGroups" :key="'G' + index">
                            <!-- {{ row.protocol }} : <span v-if="row.protocol == 'icmp'">{{ row.icmpType }}</span>
                            <span v-else v-for="(data, index1) in row.port" :key="'H' + index1"
                              >{{ data }} : <span v-for="(dt, index2) in row.sourcePort" :key="'I' + index2">{{ dt }}</span></span
                            > -->
                            - {{ row.name }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>

                  <!-- Destination -->
                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0">
                          <div v-if="!item.destinationFirewallGroups">Any</div>
                          <div v-else v-for="(row, index) in item.destinationFirewallGroups" :key="'G' + index">
                            <!-- {{ row.protocol }} : <span v-if="row.protocol == 'icmp'">{{ row.icmpType }}</span>
                            <span v-else v-for="(data, index1) in row.port" :key="'H' + index1"
                              >{{ data }} : <span v-for="(dt, index2) in row.sourcePort" :key="'I' + index2">{{ dt }}</span></span
                            > -->
                            - {{ row.name }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>
                  <!-- ActionValue -->
                  <td>
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0">
                          {{ item.actionValue ? item.actionValue  : '-' }}
                        </v-col>
                      </v-row>
                    </v-card>
                  </td>

                  <td v-if="!read_only">
                    <v-card class="scroll">
                      <v-row>
                        <v-col class="pt-0 pr-0"
                          ><v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn icon small v-bind="attrs" v-on="on" :disabled="item.id == 'default_rule'">
                                <v-icon color="primary" small @click="editRule(item)">mdi-square-edit-outline</v-icon>
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
                                    deleteRule = true;
                                    row = item.id;
                                    idIndex = index;
                                  }
                                "
                                :disabled="item.id == 'default_rule'"
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
                                @click="moveDown(item.id)"
                                :disabled="item.id == 'default_rule' || index == listRuleFirewallNsxt.length - 2"
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
                                @click="moveUp(item.id)"
                                :disabled="item.id == 'default_rule' || index == 0"
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
    <!-- <DialogEditName :edit-name.sync="editName" :data-edit="dataEditName"></DialogEditName>
    <DialogAddService :dialog-add.sync="openDialog" :id-service="idService"></DialogAddService>
    <DialogAddDestination :dialog-destination.sync="openDestination" :id-service="idService"></DialogAddDestination>
    <DialogAddSource :dialog-source.sync="openSource" :id-service="idService"></DialogAddSource>
    <DialogIpSource :ip-source.sync="ipSource" :id-service="idService"></DialogIpSource>
    <DialogDeleteService :open-delete.sync="openDelete" :id-delete="idDelete" :id-service="idService"></DialogDeleteService>
    <DialogDeleteDestination
      :delete-destination.sync="deleteDestination"
      :id-delete="idDelete"
      :id-service="idService"
      :action="action"
    ></DialogDeleteDestination>
    <DialogDeleteSource :delete-source.sync="deleteSource" :id-delete="idDelete" :id-service="idService" :action="action"></DialogDeleteSource> -->
    <DialogNewRule :new-rule.sync="addRule"></DialogNewRule>
    <DialogDeleteRule :delete-rule.sync="deleteRule" :id-delete="row" :id-index="idIndex" :move.sync="move"></DialogDeleteRule>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations } from "vuex-composition-helpers";
import { onMounted, reactive, ref } from "@vue/composition-api";
// import DialogAddService from "./dialog-add-service.vue";
// import DialogAddDestination from "./dialog-add-destination.vue";
// // import DialogAddIp from "./dialog-ip-destination.vue";
// import DialogAddSource from "./dialog-add-source.vue";
// import DialogIpSource from "./dialog-ip-source.vue";
// import DialogDeleteService from "./dialog-delete-service.vue";
// import DialogDeleteDestination from "./dialog-delete-destination.vue";
// import DialogDeleteSource from "./dialog-delete-source.vue";
import { DPSECURITY } from "../namespace";
import DialogNewRule from "./firewall/dialog-new-rule.vue";
// import DialogEditName from "./dialog-edit-name.vue";
import DialogDeleteRule from "./firewall/dialog-delete-rule.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    // DialogAddService,
    // DialogAddDestination,
    // // DialogAddIp,
    // DialogAddSource,
    // DialogIpSource,
    // DialogDeleteService,
    // DialogDeleteDestination,
    // DialogDeleteSource,
    DialogNewRule,
    // DialogEditName,
    DialogDeleteRule,
  },
  setup(props, context) {
    const { listRuleFirewallNsxt, loadingRule, payloadRuleFirewallNsxt, } = useNamespacedGetters(DPSECURITY, ["listRuleFirewallNsxt", "loadingRule", "payloadRuleFirewallNsxt",]);
    const { getListFirewallRuleNsxt, updateRuleFirewallNsxt, } = useNamespacedActions(DPSECURITY, ["getListFirewallRuleNsxt", "updateRuleFirewallNsxt", ]);
    const { setRowFirewallNsxt } = useNamespacedMutations(DPSECURITY, ["setRowFirewallNsxt"])
    const row = ref("");
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

    const headers = ref([
      { text: "No", value: "ruleId", sortable: false, width: "5%" },
      { text: "Name", value: "name", sortable: false, width: "12%" },
      { text: "Category", value: "category", sortable: false, width: "13%" },
      { text: "State", value: "state", sortable: false, width: "10%" },
      { text: "Applications", value: "applications", sortable: false, width: "13%" },
      { text: "Source", value: "source", sortable: false, width: "13%" },
      { text: "Destination", value: "destination", sortable: false, width: "13%" },
      { text: "Action", value: "actionValue", sortable: false, width: "7%" },
      { text: "", value: "action", sortable: false, width: "15%"},
    ]);
    const getSelected = (item, index) => {
      // row.value = item.id;
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
      const index = listRuleFirewallNsxt.value.findIndex((e) => e.id == id);
      if (index > 0) {
        const el = listRuleFirewallNsxt.value[index];
        context.root.$set(listRuleFirewallNsxt.value, index, listRuleFirewallNsxt.value[index - 1]);
        context.root.$set(listRuleFirewallNsxt.value, index - 1, el);
      }
    };
    const moveDown = (id) => {
      actionMove.value = true;
      // const id = row.value;
      row.value = id;
      const index = listRuleFirewallNsxt.value.findIndex((e) => e.id == id);
      if (index !== -1 && index < listRuleFirewallNsxt.value.length - 1) {
        const el = listRuleFirewallNsxt.value[index];
        context.root.$set(listRuleFirewallNsxt.value, index, listRuleFirewallNsxt.value[index + 1]);
        context.root.$set(listRuleFirewallNsxt.value, index + 1, el);
      }
    };
    const save = () => {
      const id = context.root.$route.params.idEdge;
      let userData = listRuleFirewallNsxt.value.filter( x => x.id != 'default_rule')
      let defaultData = listRuleFirewallNsxt.value.filter( x => x.id == 'default_rule')

      const params = {
        defaultRules: defaultData,
        userDefinedRules: userData
      };
      console.log('params', params)
      updateRuleFirewallNsxt({ id: id, params: params });
      move.value = false;
      actionMove.value = false;
      row.value = "";
    };
    const cancel = () => {
      const id = context.root.$route.params.idEdge;
      getListFirewallRuleNsxt(id);
      move.value = false;
      actionMove.value = false;
      row.value = "";
    };

    const editRule = (row) => {
      const name = context.root.$route.params.name;
      const idVdc = context.root.$route.params.idVdc;
      const idEdge = context.root.$route.params.idEdge;
      // console.log('row', row)
      // setRowFirewallNsxt(row)
      localStorage.setItem('rowFirewallNsxt', JSON.stringify(row))
      context.root.$router.push(`/dp-security/detail/${name}/${idVdc}/${idEdge}/firewall/editrule`)
    }

    onMounted(async() => {
      await getListFirewallRuleNsxt(context.root.$route.params.idEdge)
    })

    return {
      listRuleFirewallNsxt,
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
      payloadRuleFirewallNsxt,
      selectEnable,
      read_only,
      editRule
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
