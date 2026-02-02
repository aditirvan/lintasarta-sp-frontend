<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg px-4">
        <v-card-text>
          <v-row>
            <v-col cols="7" class="d-flex align-center">
              <div class="headline font-weight-bold font--text">
                Manage Role
              </div>
              <h3></h3>
            </v-col>

            <v-col cols="5" class="d-flex justify-center align-center">
              <v-row no-gutters>
                <v-col class="d-flex flex-row" align-self="end">
                  <v-text-field
                    maxlength="50"
                    :hide-details="true"
                    placeholder="Search"
                    outlined
                    v-model="search"
                  ></v-text-field>
                  <v-spacer />
                  <v-btn
                    id="CreateNewRoleNav"
                    depressed
                    width="188"
                    height="50"
                    :to="fullPath + '/createrole'"
                    class="secondary"
                    >Create New Role</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-data-table
                hide-default-footer
                :headers="headers"
                :items="items"
                :server-items-length="pagination.count"
                :options.sync="options"
                :items-per-page="options.itemsPerPage"
              >
                <template v-slot:body="{ items }">
                  <tbody>
                    <tr v-for="(item, ii) in items" :key="item.name + 'item'">
                      <td
                        v-for="(header, index) in headers"
                        :key="item[header.value] + 'header' + index"
                      >
                        <div
                          v-if="header.value == 'action'"
                          class="text-center"
                        >
                          <a
                            v-if="!item.is_default"
                            class="primary--text"
                            @click="
                              () => {
                                validateprivilages([
                                  'Manage Role',
                                  'editor',
                                  true,
                                ]).then(() => {
                                  setselectedrole(item);
                                  $router.push({
                                    path: fullPath + '/editrole',
                                  });
                                });
                              }
                            "
                            >Edit</a
                          >
                          <span class="pl-3" />
                          <a
                            v-if="!item.is_default"
                            text
                            class="error--text"
                            @click="
                              () => {
                                validateprivilages([
                                  'Manage Role',
                                  'editor',
                                  true,
                                ]).then(() => {
                                  roleselected = item;
                                  opendialogdeleterole = true;
                                });
                              }
                            "
                            >Delete</a
                          >
                        </div>
                        <div v-if="header.value == 'no'">{{ ii + 1 }}</div>
                        <div v-else>{{ item[header.value] }}</div>
                      </td>
                    </tr>
                  </tbody>
                </template>
                <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                    @input="
                      (val) => {
                        options = { ...options, ...val };
                      }
                    "
                    :hidden="true"
                    :props="props"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <dialogDeleteRole
      v-model="opendialogdeleterole"
      @confirm="
        () => {
          DeleteRole();
        }
      "
    />

    <v-alert
      type="success"
      v-model="deletedsuccess"
      dismissible
      border="left"
      elevation="2"
      >Role has been successfully destroyed
    </v-alert>

    <v-dialog v-if="dialog" v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline font-weight-bold font--text">
          <v-icon left>$vuetify.ison.successCircleIcon</v-icon> Data has been
          Deleted!
        </v-card-title>
        <v-card-text class="pb-0">
          <p class="mb-0">Role data has been deleted</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col>
              <v-btn
                height="50"
                depressed
                color="secondary"
                block
                @click="
                  () => {
                    dialog = false;
                  }
                "
              >
                Close
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import {
  useActions,
  useGetters,
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import dialogDeleteRole from "./dialogDeleteRole";
import { ROLEPERMISSION } from "./namespace";
export default {
  components: { dialogDeleteRole },
  props: ["organization"],
  setup(props, context) {
    // props;
    const currentRoute = context.root.$router.currentRoute;
    const fullPath = currentRoute.fullPath;
    const detailOrg = ref()
    onMounted( async () => {
      detailOrg.value = props.organization;
    })

    const headers = reactive([
      { text: "No", value: "no", sortable: false },
      { text: "Role Name", value: "name", sortable: false, width: 200 },
      { text: "Description", value: "description" },
      { text: "Action", sortable: false, align: "center", value: "action" },
    ]);
    const { items } = useGetters({
      items: "ROLEPERMISSION/getroles",
    });
    const { userrole, rolespagination: pagination } = useNamespacedState(
      "ROLEPERMISSION",
      ["userrole", "rolespagination"]
    );
    const { fetchRoles, deleteRole } = useActions({
      fetchRoles: "ROLEPERMISSION/fetchRoles",
      deleteRole: "ROLEPERMISSION/deleteRole",
    });
    const options = ref({ itemsPerPage: 10 });
    const search = ref();
    watch(search, (val) => {
      options.value = { ...options.value, search: val };
    });
    watch(options, async (val) => {
      try {
        await fetchRoles(val);
      } finally {
        options;
      }
    });
    const roleselected = ref();
    const opendialogdeleterole = ref(false);
    const deletedsuccess = ref(false);
    const dialog = ref(false);
    const { setopendialogcommonwarning, setmessagecommonwarning } =
      useNamespacedMutations("DASHBOARD", [
        "setopendialogcommonwarning",
        "setmessagecommonwarning",
      ]);
    const DeleteRole = async () => {
      deleteRole(roleselected.value)
        .then(() => {
          opendialogdeleterole.value = false;
          dialog.value = true;
          fetchRoles(options.value);
        })
        .catch((e) => {
          if (e.response) {
            opendialogdeleterole.value = false;
            setopendialogcommonwarning(true);
            setmessagecommonwarning(e.response.data.data);
          }
        });
    };
    const { setselectedrole } = useNamespacedMutations(ROLEPERMISSION, [
      "setselectedrole",
    ]);
    const { validateprivilages, validateprivilagesync } = useNamespacedActions(
      "HOMEPAGE",
      ["validateprivilages", "validateprivilagesync"]
    );
    return {
      validateprivilages,
      validateprivilagesync,
      setselectedrole,
      opendialogdeleterole,
      roleselected,
      deletedsuccess,
      DeleteRole,
      search,
      options,
      userrole,
      headers,
      items,
      fullPath,
      fetchRoles,
      deleteRole,
      pagination,
      dialog,
      detailOrg,
    };
  },
  created() {
    this.fetchRoles(this.options);
  },
};
</script>

<style lang="scss">
.v-alert {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
