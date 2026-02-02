<template>
  <div>
    <div class="px-3">
      <v-row>
        <v-col cols="12" class="pl-0">
          <v-card class="rounded-0 rounded-t-lg" flat>
            <v-container fluid class="pa-7 pb-0">
              <v-row>
                <v-col class="d-flex">
                  <div class="page-title mt-2">Deka ROCK</div>
                  <v-spacer></v-spacer>
                  <v-btn
                    width="150"
                    height="50"
                    class="secondary fz-14"
                    @click="
                      () => {
                        validateprivilages(['Dekarock', 'editor', true]).then(() => {
                          toCreate();
                        });
                      }
                    "
                    depressed
                    v-if="!read_only"
                  >
                    Create Deka ROCK
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <v-card class="pa-7 rounded-b-lg pt-2" flat>
            <v-data-table
              id="my-table"
              hide-default-footer
              :headers="headers"
              hide-default-header
              :items="openshift_list"
              :server-items-length="pagination.itemsLength"
            >
              <template v-slot:header="{ props, on }">
                <v-data-table-header v-on="on" v-bind="props" sort-icon="mdi-menu-down"> </v-data-table-header>
              </template>
              <template v-slot:item.status="{ item }">
                <span v-if="item.status != 'Error'">{{ item.status }}</span>
                <span v-else style="color: red">{{ item.status }}</span>
              </template>
              <template v-slot:item.created_at="{ item }">
                {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
              </template>
              <template v-slot:item.version="{ item }">
                {{ item.version ? item.version : "-" }}
              </template>
              <template v-slot:item.zone="{ item }">
                {{ item.zone ? item.zone : "-" }}
              </template>
              <template v-slot:item.action="{ item }">
                <popupquote v-model="item.open" :offsetTop="20" :documentid="'popup' + item.id" offset-y allow-overflow>
                  <template v-slot:activator="{ on, attrs }">
                    <label
                      v-bind="attrs"
                      class="primary--text linkpointer"
                      style="position: relative; white-space: nowrap"
                      @click="
                        ($event) => {
                          on.click($event);
                          itemSelectedvalue = item;
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
                      @click="
                        () => {
                          toDetail(item);
                        }
                      "
                    >
                      <v-list-item-title>Detail</v-list-item-title>
                    </v-list-item>
                    <v-list-item style="min-height: 1px; margin-left: -16px; margin-right: -16px" v-if="!item.default && !read_only">
                      <v-divider style="min-width: 160px" />
                    </v-list-item>
                    <v-list-item
                      @click="
                        () => {
                          validateprivilages(['Dekarock', 'editor', true]).then(() => {
                            dialog_delete = true;
                          });
                        }
                      "
                      v-if="!item.default && !read_only"
                      :disabled="(item.status != 'Created' && item.status != 'Error') || !item.actionable"
                    >
                      <v-list-item-title class="error--text">Destroy</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </popupquote>
              </template>
              =
              <template v-slot:footer="{ props }">
                <v-row>
                  <v-col
                    ><v-row>
                      <v-card-title>
                        <span class="mt-1 fz-14">Powered by <b> OpenShift</b></span>
                        <img src="@/assets/openshift.png" alt="openshift" width="30px" class="ml-2" />
                      </v-card-title>
                    </v-row>
                  </v-col>
                  <v-col
                    ><custom-footer-datatable
                      v-if="openshift_list.length"
                      @input="
                        (val) => {
                          options = val;
                          changePage(val);
                        }
                      "
                      :props="props"
                  /></v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="dialog_delete" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">Destroy this Deka ROCK ?</div>
        </v-card-title>
        <v-card-text class="pb-0">
          <p>All your data in this server will be deleted without backup. Are you sure?</p>
        </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn color="accent" block depressed height="50" @click="dialog_delete = false"> Cancel </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="error"
                block
                height="50"
                @click="
                  () => {
                    doDeleteDekarock();
                  }
                "
                depressed
              >
                Yes
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { DEKAROCK } from "@/modules/deka-rock/namespace";
import { ref, onMounted, reactive } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import dialogAddMachine from "./dialogAddMachine.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    dialogAddMachine,
  },
  setup(props, context) {
    const { getOpenshiftList, deleteOpenshift, addOpenshiftMachineSet } = useNamespacedActions(DEKAROCK, [
      "getOpenshiftList",
      "deleteOpenshift",
      "addOpenshiftMachineSet",
    ]);
    const { openshift_list, openshift_pagination } = useNamespacedState(DEKAROCK, ["openshift_list", "openshift_pagination"]);
    const { validateprivilages } = useNamespacedActions("HOMEPAGE", ["validateprivilages"]);
    const itemSelectedvalue = ref({});
    const currentProj = ref(JSON.parse(localStorage.getItem("currentProj")));
    const dialog_delete = ref(false);
    const dialog_resize_worker_or_add_machine_set = ref(false);
    const dialog_add_machine_set = ref(false);
    const dialog_resize_worker = ref(false);
    const snackbar_cant_resize_worker = ref(false);
    const selectedItem = ref(1);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Deka ROCK"));
    const pagination = ref({});
    const options = ref({});
    const search = ref("");
    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Version", value: "version", sortable: false },
      { text: "Zone", value: "zone", sortable: false },
      { text: "Machine Set", value: "total_machine_set", sortable: false },
      { text: "Workers", value: "total_worker", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ]);

    const items = reactive([
      { text: "Intel (RAM 10GB / SSD 100GB / 40 Workers)", default: true },
      { text: "Apple (RAM 2GB / SSD 1TB / 3 Workers)", default: false },
      { text: "AMD (RAM 32GB / SSD 100GB / 20 Workers)", default: false },
    ]);

    function toCreate() {
      this.$router.push(`/deka-rock/create`);
    }

    function toDetail(item) {
      this.$router.push(`/deka-rock/${item.id}`);
    }

    async function getDekarock() {
      await getOpenshiftList({
        params: {
          project_id: currentProj.value.id,
        },
      });
      let paginate = {
        itemsLength: openshift_pagination.value.total_data,
        pageCount: openshift_pagination.value.total_page,
        itemsPerPage: openshift_pagination.value.limit,
        page: openshift_pagination.value.page,
      };
      pagination.value = paginate;
    }

    async function doDeleteDekarock() {
      context.root.$store.dispatch("HOMEPAGE/showProcessToastWS", `Deleting the Deka ROCK cluster`, { root: true });
      await deleteOpenshift(itemSelectedvalue.value.id);
      search.value = "";
      await getDekarock();
      dialog_delete.value = false;
    }

    const changePage = async (val) => {
      await getOpenshiftList({ params: { page: val.page, limit: val.itemsPerPage, project_id: currentProj.value.id } });
    };

    onMounted(async () => {
      await getDekarock();
    });
    return {
      currentProj,
      getOpenshiftList,
      openshift_list,
      deleteOpenshift,
      addOpenshiftMachineSet,
      openshift_pagination,
      itemSelectedvalue,
      dialog_delete,
      dialog_resize_worker_or_add_machine_set,
      dialog_add_machine_set,
      dialog_resize_worker,
      snackbar_cant_resize_worker,
      selectedItem,
      pagination,
      options,
      search,
      headers,
      items,
      toCreate,
      toDetail,
      doDeleteDekarock,
      changePage,
      read_only,
      validateprivilages,
    };
  },
};
</script>

<style scoped lang="scss">
.selected {
  border-color: #2c94d2;
}
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.footer-logo {
  display: grid;
  align-content: center;
}
</style>
