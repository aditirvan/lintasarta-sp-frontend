<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-col cols="9">
            <div class="firewall-title ml-5">Static Routes</div>
          </v-col>
          <v-row class="ml-2">
            <v-col cols="4" class="pt-0">
              <v-row class="ml-2" v-if="!read_only">
                <v-col
                  ><v-btn
                    block
                    color="secondary"
                    outlined
                    @click="
                      () => {
                        addRoutes = true;
                        dataEdit = {};
                        row = null;
                      }
                    "
                    ><v-icon small>mdi-plus</v-icon></v-btn
                  ></v-col
                >
                <v-col
                  ><v-btn
                    block
                    color="primary"
                    outlined
                    :disabled="!dataEdit || Object.keys(dataEdit).length == 0"
                    @click="
                      () => {
                        editRoutes = true;
                      }
                    "
                    ><v-icon small>mdi-square-edit-outline</v-icon></v-btn
                  ></v-col
                >
                <v-col
                  ><v-btn
                    block
                    color="primary"
                    outlined
                    :disabled="!dataEdit || Object.keys(dataEdit).length == 0"
                    @click="
                      () => {
                        delRoutes = true;
                      }
                    "
                    ><v-icon small>mdi-close</v-icon></v-btn
                  ></v-col
                >
              </v-row>
            </v-col>
            <v-col cols="4" class="pt-0">
              <!-- <v-row class="ml-2" v-if="actionMove">
                <v-col><v-btn block color="primary" outlined @click="save()">SAVE</v-btn></v-col>
                <v-col><v-btn block color="primary" outlined @click="cancel()">CANCEL</v-btn></v-col>
              </v-row> -->
            </v-col>
          </v-row>
          <v-container fluid class="px-7 pt-0"
            ><v-data-table
              :headers="headers"
              :items="listStaticRoute"
              item-key="no"
              single-line
              class="elevation-0"
              :loading="loadingRoute"
              hide-default-footer
              disable-pagination
            >
              <template #[`item`]="{ item, index }">
                <tr @click="getSelected(item, index)" :class="row == index ? 'blue lighten-4' : ''">
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.type }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.network }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.nextHop }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ getVnic(item.vnic) }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.mtu }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.adminDistance }}</span>
                    </v-card>
                  </td>
                  <td>
                    <v-card class="scroll">
                      <span>{{ item.description }}</span>
                    </v-card>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogAddRoutes :add-routes.sync="addRoutes" :id-row.sync="row" v-if="addRoutes"></DialogAddRoutes>
    <DialogEditRoutes :edit-routes.sync="editRoutes" :data-edit.sync="dataEdit" :id-row.sync="row" v-if="editRoutes"></DialogEditRoutes>
    <DialogDeleteRoutes :del-routes.sync="delRoutes" :id-row.sync="row" :data-edit.sync="dataEdit"></DialogDeleteRoutes>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref, onMounted } from "@vue/composition-api";
import { DPSECURITY } from "../namespace";
import DialogAddRoutes from "./dialog-add-routes.vue";
import DialogEditRoutes from "./dialog-edit-routes.vue";
import DialogDeleteRoutes from "./dialog-delete-routes.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DialogAddRoutes,
    DialogEditRoutes,
    DialogDeleteRoutes,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Security'));
    const { listStaticRoute, loadingRoute, payloadStaticRoute, listObject } = useNamespacedGetters(DPSECURITY, [
      "listStaticRoute",
      "loadingRoute",
      "payloadStaticRoute",
      "listObject",
    ]);
    const { updateStaticRoutesNsxv, getObjectBrowser, getIpObject } = useNamespacedActions(DPSECURITY, ["updateStaticRoutesNsxv", "getObjectBrowser", "getIpObject"]);
    onMounted(async () => {
      getIpObject(context.root.$route.params.idEdge);
      const params = {
        idEdge: context.root.$route.params.idEdge,
        object: "gatewayinterface",
      };
      await getObjectBrowser(params);
    });
    const row = ref(null);
    const dataEdit = ref(null);
    const addRoutes = ref(false);
    const editRoutes = ref(false);
    const delRoutes = ref(false);

    const headers = ref([
      { text: "Type", value: "type", sortable: false },
      { text: "Network", value: "network", sortable: false },
      { text: "Next Hop", value: "nextHop", sortable: false },
      { text: "Interface", value: "vnic", sortable: false },
      { text: "MTU", value: "mtu", sortable: false },
      { text: "Admin Distance", value: "adminDistance", sortable: false },
      { text: "Description", value: "description", sortable: false },
    ]);
    const getSelected = (item, index) => {
      row.value = index;
      // move.value = true;
      // idIndex.value = index;
      // actionNat.value = item.action;
      dataEdit.value = item;
    };
    const getVnic = (id) => {
      const vnic = `vnic-${id}`;
      const desti = listObject.value.map((item) => {
        return { name: item.name, type: item.type, requiredProperties: Object.assign({}, ...item.requiredProperties) };
      });

      const data = desti.find((element) => {
        if (element.requiredProperties.value == vnic) {
          return element;
        }
      });
      return data?.name;
    };
    return {
      listStaticRoute,
      headers,
      getSelected,
      getVnic,
      row,
      dataEdit,
      loadingRoute,
      payloadStaticRoute,
      addRoutes,
      editRoutes,
      delRoutes,
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
  // height: 65px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: auto;
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
