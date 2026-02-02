<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-col cols="9" class="pb-0">
            <div class="firewall-title ml-5">NAT 44 Rules</div>
          </v-col>
          <v-row v-if="!read_only">
            <v-col class="pt-0 pb-0" cols="9">
              <v-row class="ml-2">
                <v-col
                  @click="
                    () => {
                      openDnat = true;
                    }
                  "
                  ><v-btn outlined block color="secondary"><v-icon small>mdi-plus</v-icon>&nbsp; DNAT RULE</v-btn></v-col
                >
                <v-col
                  @click="
                    () => {
                      openSnat = true;
                    }
                  "
                  ><v-btn block color="secondary" outlined><v-icon small>mdi-plus</v-icon>&nbsp; SNAT RULE</v-btn></v-col
                >
                <v-col
                  ><v-btn block color="primary" outlined :disabled="!move" @click="edit()"><v-icon small>mdi-square-edit-outline</v-icon></v-btn></v-col
                >
                <v-col
                  ><v-btn
                    block
                    color="primary"
                    outlined
                    :disabled="!move"
                    @click="
                      () => {
                        deleteNat = true;
                      }
                    "
                    ><v-icon small>mdi-close</v-icon></v-btn
                  ></v-col
                >
                <v-col
                  ><v-btn block color="primary" outlined @click="moveDown()" :disabled="!move"><v-icon small>mdi-arrow-down-thick</v-icon></v-btn></v-col
                >
                <v-col
                  ><v-btn block color="primary" outlined @click="moveUp()" :disabled="!move"><v-icon small>mdi-arrow-up-thick</v-icon></v-btn></v-col
                >
              </v-row>
            </v-col>

            <v-col cols="3" class="pt-0 pb-0">
              <v-row class="mr-5" v-if="actionMove">
                <v-col><v-btn block color="primary" outlined @click="save()" max-width="70">SAVE</v-btn></v-col>
                <v-col><v-btn block color="primary" outlined @click="cancel()" max-width="70">CANCEL</v-btn></v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-col cols="6" class="pt-0 pb-0 mb-4">
            <v-row class="ml-2" >
              <v-col v-if="!read_only" class="d-flex align-items-center">Show only user-defined rules</v-col>
              <v-col v-if="!read_only" class="d-flex"><v-switch></v-switch></v-col>
            </v-row>
          </v-col>
          <v-container fluid class="px-7 pt-0"
            ><v-data-table
              :headers="headers"
              :items="listRuleNatNsxv"
              item-key="no"
              single-line
              class="elevation-0"
              :loading="loadingNat"
              hide-default-footer
              disable-pagination
            >
              <template #[`item`]="{ item, index }">
                <tr @click="getSelected(item, index)" :class="row == item.ruleId ? 'blue lighten-4' : ''">
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.ruleId }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.ruleType }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.action.toUpperCase() }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ getVnic(item.vnic) }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.originalAddress }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.originalPort }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.translatedAddress }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.translatedPort }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.protocol }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.enabled }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.loggingEnabled }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.description || "-" }}</span>
                    </v-card>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogDnatRules :dialog-dnat.sync="openDnat" v-if="openDnat"></DialogDnatRules>
    <DialogSnatRules :dialog-snat.sync="openSnat" v-if="openSnat"></DialogSnatRules>
    <DialogDeleteNat :dialog-delete.sync="deleteNat" :id-index="idIndex" :move.sync="move"></DialogDeleteNat>
    <DialogEditDnat :edit-dnat.sync="editDnat" :data-edit="dataEdit" :id-row.sync="row" v-if="editDnat"></DialogEditDnat>
    <DialogEditSnat :edit-snat.sync="editSnat" :data-edit="dataEdit" :id-row.sync="row" v-if="editSnat"></DialogEditSnat>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref, onMounted } from "@vue/composition-api";
import DialogDnatRules from "./dialog-dnat-rules.vue";
import DialogSnatRules from "./dialog-snat-rules.vue";
import { DPSECURITY } from "../namespace";
import DialogDeleteNat from "./dialog-delete-nat.vue";
import DialogEditDnat from "./dialog-edit-dnat.vue";
import DialogEditSnat from "./dialog-edit-snat.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DialogDnatRules,
    DialogSnatRules,
    DialogDeleteNat,
    DialogEditDnat,
    DialogEditSnat,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Security'));
    const { listRuleNatNsxv, payloadRuleNat, loadingNat, listObject } = useNamespacedGetters(DPSECURITY, [
      "listRuleNatNsxv",
      "payloadRuleNat",
      "loadingNat",
      "listObject",
    ]);
    const { updateRuleNatNsxv, getListNatRuleNsxv, getObjectBrowser, getIpObject } = useNamespacedActions(DPSECURITY, [
      "updateRuleNatNsxv",
      "getListNatRuleNsxv",
      "getObjectBrowser",
      "getIpObject",
    ]);
    onMounted(() => {
      getIpObject(context.root.$route.params.idEdge);
      const params = {
        idEdge: context.root.$route.params.idEdge,
        object: "gatewayinterface",
      };
      getObjectBrowser(params);
    });
    const openDnat = ref(false);
    const openSnat = ref(false);
    const actionMove = ref(false);
    const move = ref(false);
    const deleteNat = ref(false);
    const editDnat = ref(false);
    const editSnat = ref(false);
    const row = ref(0);
    const idIndex = ref(0);
    const actionNat = ref("");
    const dataEdit = ref({});
    const headers = ref([
      { text: "ID", value: "ruleId" },
      { text: "Type", value: "ruleType", sortable: false },
      { text: "Action", value: "action", sortable: false },
      { text: "Applied on", value: "vnic", sortable: false },
      { text: "Original IP", value: "originalAddress", sortable: false },
      { text: "Original Port", value: "originalPort", sortable: false },
      { text: "Translated IP", value: "translatedAddress", sortable: false },
      { text: "Translated Port", value: "translatedPort", sortable: false },
      { text: "Protocol", value: "protocol", sortable: false },
      { text: "Enabled", value: "enabled", sortable: false },
      { text: "Logging", value: "loggingEnabled", sortable: false },
      { text: "Description", value: "description", sortable: false },
    ]);
    const moveUp = () => {
      actionMove.value = true;
      const id = row.value;
      const index = listRuleNatNsxv.value.findIndex((e) => e.ruleId == id);
      if (index > 0) {
        const el = listRuleNatNsxv.value[index];
        context.root.$set(listRuleNatNsxv.value, index, listRuleNatNsxv.value[index - 1]);
        context.root.$set(listRuleNatNsxv.value, index - 1, el);
      }
    };
    const moveDown = () => {
      actionMove.value = true;
      const id = row.value;
      const index = listRuleNatNsxv.value.findIndex((e) => e.ruleId == id);
      if (index !== -1 && index < listRuleNatNsxv.value.length - 1) {
        const el = listRuleNatNsxv.value[index];
        context.root.$set(listRuleNatNsxv.value, index, listRuleNatNsxv.value[index + 1]);
        context.root.$set(listRuleNatNsxv.value, index + 1, el);
      }
    };
    const getSelected = (item, index) => {
      row.value = item.ruleId;
      move.value = true;
      idIndex.value = index;
      actionNat.value = item.action;
      dataEdit.value = item;
    };
    const save = () => {
      const id = context.root.$route.params.idEdge;
      const params = {
        enabled: payloadRuleNat.value.enabled,
        featureType: payloadRuleNat.value.featureType,
        version: payloadRuleNat.value.version,
        nat64Rules: {},
        rules: {
          natRulesDtos: listRuleNatNsxv.value,
        },
      };

      updateRuleNatNsxv({ id: id, params: params });
      move.value = false;
      actionMove.value = false;
      row.value = 0;
    };
    const cancel = () => {
      const id = context.root.$route.params.idEdge;
      getListNatRuleNsxv(id);
      move.value = false;
      actionMove.value = false;
      row.value = 0;
    };
    const edit = () => {
      if (actionNat.value == "dnat") {
        editDnat.value = true;
      } else {
        editSnat.value = true;
      }
    };
    const getVnic = (item) => {
      const vnic = `vnic-${item}`;
      const desti = listObject.value.find((item) => {
        if (item.requiredProperties[0]["value"] == vnic) {
          return item;
        } else {
          return;
        }
      });
      return desti?.name;
    };
    return {
      listRuleNatNsxv,
      loadingNat,
      headers,
      openDnat,
      openSnat,
      moveDown,
      moveUp,
      getSelected,
      actionMove,
      row,
      move,
      idIndex,
      deleteNat,
      cancel,
      save,
      edit,
      actionNat,
      editDnat,
      editSnat,
      dataEdit,
      listObject,
      getVnic,
      read_only,
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
