<template>
  <div>
    <v-card class="rounded-lg mt-3" flat>
      <v-container>
        <v-row>
          <v-col cols="1">
            <div class="mx-2" style="padding-left: 30; width: 50px; height: 50px; background: #f1f2f2; border-radius: 50%"></div>
          </v-col>
          <v-col class="px-0">
            <p class="mb-0 fz-21 font-weight-bold">{{ openshift_detail.name }}</p>
            <p class="mb-0">
              <span v-if="openshift_detail.description">{{ openshift_detail.description }}</span
              ><span v-else>-</span>
            </p>
            <p class="mb-0 accent--text">
              Version {{ openshift_detail.version ? openshift_detail.version : "-" }} / {{ openshift_detail.zone ? openshift_detail.zone : "-" }} /{{
                openshift_detail.total_machine_set
              }}
              Machine Set and {{ openshift_detail.total_worker }} Workers
            </p>
          </v-col>
          <v-col cols="2" class="img-open">
            <div class="mt-1">Powered by</div>
            <div><img src="@/assets/OpenShiftLogo.svg" alt="openshift" width="50px" class="ml-3" /></div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <div style="height: 30px; width: auto" />
    <v-card flat class="rounded-lg">
      <v-tabs v-model="tabs" height="64" slider-size="4">
        <v-tab class="px-8 fz-14">Overview</v-tab>
        <v-tab class="px-8 fz-14">Machine Set</v-tab>
        <v-tab class="px-8 fz-14">Config</v-tab>
        <v-tab class="px-8 fz-14">Security Group</v-tab>
        <v-tab class="px-8 fz-14">Security Audit</v-tab>
        <v-tab class="px-8 fz-14">Settings</v-tab>
        <v-tab class="px-8 fz-14">Network</v-tab>
        <v-tab class="px-8 fz-14">CLI Tools</v-tab>
        <v-tab class="px-8 fz-14">Others</v-tab>
        <v-spacer></v-spacer>
      </v-tabs>
      <v-divider />
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-card-text class="pa-8">
            <p class="fz-21 font-weight-bold">Cluster Detail</p>
            <v-row>
              <v-col sm="12" md="6"
                ><p class="mb-1">Status</p>
                <span class="font-weight-bold font--text">{{ openshift_detail.status }}</span>
              </v-col>
              <v-col sm="12" md="6"
                ><p class="mb-1">Created At</p>
                <span class="font-weight-bold font--text">{{ $FormatDate(openshift_detail.created_at) }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="6"
                ><p class="mb-1">Console</p>
                <span v-if="openshift_detail.host == 'null'">-</span>
                <span v-else
                  ><a :href="openshift_detail.host" target="_blank">{{ openshift_detail.host ? openshift_detail.host : "-" }}</a></span
                >
              </v-col>
              <v-col sm="12" md="6"
                ><p class="mb-1">API</p>
                <span class="font-weight-bold font--text">{{ openshift_detail.api ? openshift_detail.api : "-" }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12" md="6"
                ><p class="mb-1">Username</p>
                <span class="font-weight-bold font--text">{{ openshift_detail.username ? openshift_detail.username : "-" }}</span>
              </v-col>
              <v-col sm="12" md="6"
                ><p class="mb-1">Password</p>
                <span class="font-weight-bold font--text">{{ openshift_detail.username ? "********" : "-" }}</span
                >&nbsp;
                <v-icon
                  v-if="openshift_detail.username"
                  small
                  class="mb-2 ml-2 secondary white--text py-1 px-2 rounded"
                  style="cursor: pointer"
                  @click="
                    () => {
                      showDialogReveal();
                    }
                  "
                >
                  mdi-eye
                </v-icon>
              </v-col>
            </v-row>
          </v-card-text>
        </v-tab-item>

        <v-tab-item>
          <v-row>
            <v-col cols="12">
              <v-card class="rounded-lg" flat>
                <v-container fluid class="px-7 py-4">
                  <v-row class="d-flex justify-center"
                    ><v-col cols="9">
                      <div class="headline font-weight-bold font--text mb-2">List of Machine Set</div>
                    </v-col>
                    <v-col md="1"></v-col>
                    <v-col md="2">
                      <v-btn
                        @click="
                          () => {
                            validateprivilages(['Dekarock', 'editor', true]).then(() => {
                              dialog_add_machine_set = true;
                            });
                          }
                        "
                        depressed
                        width="150"
                        class="secondary"
                        :disabled="openshift_detail.status != 'Created'"
                        v-if="!read_only"
                      >
                        Create Machine Set
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-data-table :headers="machine_set_headers" hide-default-footer :items="machine_set_list" :options.sync="machine_set_options">
                        <template v-slot:item.created_at="{ item }">
                          {{ $moment(new Date(item.created_at)).format("DD/MM/YYYY") }}
                        </template>
                        <template v-slot:item.action="{ item }" v-if="!read_only">
                          <v-btn
                            text
                            :disabled="item.status != 'Created'"
                            class="primary--text fz-14"
                            style="cursor: pointer"
                            @click="
                              () => {
                                validateprivilages(['Dekarock', 'editor', true]).then(() => {
                                  selectMachineSet(item);
                                  dialog_resize_worker = true;
                                });
                              }
                            "
                            >Resize
                          </v-btn>
                          <v-btn
                            text
                            :disabled="item.status != 'Created'"
                            v-if="!item.default"
                            style="cursor: pointer"
                            class="pl-3 error--text fz-14"
                            @click="
                              () => {
                                validateprivilages(['Dekarock', 'editor', true]).then(() => {
                                  selectMachineSet(item);
                                  dialog_delete_machine_set = true;
                                });
                              }
                            "
                            >Delete</v-btn
                          >
                        </template>
                        <template v-if="machine_set_pagination.total_data" v-slot:footer>
                          <custom-footer-datatable :props="{ pagination: machine_set_paginate, options: machine_set_options }" />
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>

        <v-tab-item>
          <KubeConfig></KubeConfig>
        </v-tab-item>

        <v-tab-item>
          <SecurityGroup></SecurityGroup>
        </v-tab-item>

        <v-tab-item>
          <SecurityAudit></SecurityAudit>
        </v-tab-item>

        <v-tab-item>
          <Setting></Setting>
        </v-tab-item>

        <v-tab-item>
          <Network></Network>
        </v-tab-item>

        <v-tab-item>
          <CliTools></CliTools>
        </v-tab-item>

        <v-tab-item>
          <v-card-text class="pa-8">
            <p class="fz-21 font-weight-bold">Detail</p>
            <v-row>
              <v-col cols="6">
                <p class="font-weight-bold">Name</p>
                <v-text-field outlined single-line placeholder="Enter Dekarock Cluster Name" v-model="nameUpdate"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="pb-0">
                <p class="font-weight-bold">Description</p>
                <v-textarea id="Description" placeholder="Enter Description" outlined single-line v-model="descriptionUpdate"></v-textarea>
              </v-col>
            </v-row>

            <v-row class="">
              <v-col cols="6" class="pb-0">
                <v-btn
                  depressed
                  height="50"
                  class="primary flex-grow-1 col-12"
                  @click="
                    () => {
                      validateprivilages(['Dekarock', 'editor', true]).then(() => {
                        update();
                      });
                    }
                  "
                  ><span>Update</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <dialogAddMachine v-model="dialog_add_machine_set" :dekarock_id="openshift_detail.id" />
    <dialogPassword :show.sync="showDialogPassword" :data-key="dataKey"> </dialogPassword>

    <v-dialog v-model="dialog_resize_worker" max-width="400">
      <v-card>
        <v-card-text>
          <v-container fluid>
            <p>
              <span class="font-weight-bold mb-0">Resize Worker</span>
            </p>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="total_worker_of_machine_set"
                  outlined
                  single-line
                  placeholder="Enter amount of worker"
                  type="number"
                  :error-messages="errorResize ? errorResize : ''"
                  @input="errorResize = ''"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-btn
                  color="accent"
                  block
                  depressed
                  height="50"
                  @click="
                    () => {
                      dialog_resize_worker = false;
                      errorResize = '';
                    }
                  "
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  class="secondary"
                  block
                  height="50"
                  @click="
                    () => {
                      resizeWorker();
                    }
                  "
                  depressed
                >
                  Resize
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_delete_machine_set" max-width="500">
      <v-card>
        <v-card-title>
          <div class="headline font-weight-bold font--text pb-4">Delete this Machine Set ?</div>
        </v-card-title>
        <v-card-actions>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn color="accent" block depressed height="50" @click="dialog_delete_machine_set = false"> Cancel </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                color="error"
                block
                height="50"
                @click="
                  () => {
                    doDeleteMachineSet();
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
import { ref, onMounted, watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { required, minLength } from "@vuelidate/validators";
import { DEKAROCK } from "@/modules/deka-rock/namespace";
import dialogPassword from "./dialogPassword.vue";
import dialogAddMachine from "./dialogAddMachine.vue";
import { toInteger } from "lodash";
import SecurityGroup from "./security-group.vue";
import SecurityAudit from "./security-audit.vue";
import KubeConfig from "./kube-config.vue";
import Setting from "./setting.vue";
import Network from "./network.vue";
import CliTools from "./cli-tools.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    dialogPassword,
    dialogAddMachine,
    SecurityGroup,
    SecurityAudit,
    KubeConfig,
    Setting,
    Network,
    CliTools,
  },
  setup(props, context) {
    tabs;
    const tabs = ref();
    const machine_set_paginate = ref({});
    const machine_set_options = ref({});
    const ready = ref(false);
    const dialog_resize_worker = ref(false);
    const dialog_delete_machine_set = ref(false);
    const show_dialog_add_worker = ref(false);
    const id = context.root.$route.params.id;
    const name = ref("");
    const nameUpdate = ref("");
    const description = ref("");
    const descriptionUpdate = ref("");
    const status = ref("");
    const total_worker = ref(0);
    const total_worker_of_machine_set = ref(0);
    const total_machine_set = ref(0);
    const edit_total_worker = ref(0);
    const username = ref("");
    const host = ref("");
    const showDialogPassword = ref(false);
    const dataKey = ref({});
    const item = ref({});
    const customSize = ref(null);
    const dialog_add_machine_set = ref(false);
    const machineSetSelectedvalue = ref({});
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Deka ROCK"));
    const errorResize = ref("");

    const { getOpenshiftDetail, resizeMachineSet, addOpenshiftWorker, deleteMachineSet, getOpenshiftMachineSetList, updateOpenshift } = useNamespacedActions(
      DEKAROCK,
      ["getOpenshiftDetail", "resizeMachineSet", "addOpenshiftWorker", "deleteMachineSet", "getOpenshiftMachineSetList", "updateOpenshift"]
    );
    const { openshift_detail, machine_set_list, machine_set_pagination } = useNamespacedState(DEKAROCK, [
      "openshift_detail",
      "machine_set_list",
      "machine_set_pagination",
    ]);
    const { validateprivilages } = useNamespacedActions("HOMEPAGE", ["validateprivilages"]);

    const machine_set_headers = ref([
      { text: "Worker ID", value: "worker_id", sortable: false },
      { text: "Flavor Type", value: "flavor_type", sortable: false },
      { text: "Workers", value: "total_worker", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Create At", value: "created_at", sortable: false },
      read_only.value ? { text: "", value: "", sortable: false } : { text: "Action", value: "action", sortable: false },
    ]);

    async function getDetail() {
      item.value = await getOpenshiftDetail(id);
      item.value = item.value.data.data;
      name.value = openshift_detail.value.name;
      total_worker.value = openshift_detail.value.total_worker;
      total_machine_set.value = openshift_detail.value.total_machine_set;
      description.value = openshift_detail.value.description;
      status.value = openshift_detail.value.status;
      host.value = openshift_detail.value.host;
      username.value = openshift_detail.value.username;
      nameUpdate.value = name.value;
      descriptionUpdate.value = description.value;
      // edit_total_worker.value = openshift_detail.value.total_worker
    }

    async function update() {
      let payload = { id: id };
      if (name.value != nameUpdate.value) {
        payload.name = nameUpdate.value;
      }
      if (description.value != descriptionUpdate.value) {
        payload.description = descriptionUpdate.value;
      }
      await updateOpenshift({ payload: payload });
      await getDetail();
      await getOpenshiftMachineSetList({ payload: { id: id } });
    }

    function showDialogReveal() {
      showDialogPassword.value = true;
      dataKey.value = item.value;
    }

    function ShowDialogAddWorker() {
      show_dialog_add_worker.value = true;
    }

    async function addWorker() {
      let res = await addOpenshiftWorker({ payload: { id: id, total_worker: parseInt(edit_total_worker.value) } });
      if (res.status === 200) {
        await getDetail();
        show_dialog_add_worker.value = false;
      }
    }

    async function resizeWorker() {
      if (!total_worker_of_machine_set.value) {
        errorResize.value = "Value is required";
        return;
      }
      if (parseInt(total_worker_of_machine_set.value) == 0 || parseInt(total_worker_of_machine_set.value) < 0) {
        errorResize.value = "Value must be greater than 0";
        return;
      }
      // context.root.$store.dispatch("HOMEPAGE/showProcessToastWS", `Resizing the machine set`, { root: true });
      let res = await resizeMachineSet({
        id: id,
        machine_set_id: machineSetSelectedvalue.value.id,
        payload: {
          total_worker: toInteger(total_worker_of_machine_set.value),
        },
      });
      if (res.status === 200 || res.status === 204) {
        await getDetail();
        await getOpenshiftMachineSetList({ payload: { id: id } });
        let paginate = {
          itemsLength: machine_set_pagination.value.total_data,
          pageCount: machine_set_pagination.value.total_page,
          itemsPerPage: machine_set_pagination.value.limit,
          page: machine_set_pagination.value.page,
        };
        machine_set_paginate.value = paginate;
      }
      dialog_resize_worker.value = false;
    }

    async function doDeleteMachineSet() {
      // context.root.$store.dispatch("HOMEPAGE/showProcessToastWS", `Deleting the machine set`, { root: true });
      let res = await deleteMachineSet({ payload: { id: id, machine_set_id: machineSetSelectedvalue.value.id } });
      if (res.status === 200 || res.status === 204) {
        await getDetail();
        await getOpenshiftMachineSetList({ payload: { id: id } });
        let paginate = {
          itemsLength: machine_set_pagination.value.total_data,
          pageCount: machine_set_pagination.value.total_page,
          itemsPerPage: machine_set_pagination.value.limit,
          page: machine_set_pagination.value.page,
        };
        machine_set_paginate.value = paginate;
      }
      dialog_delete_machine_set.value = false;
    }

    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        description: { required },
      },
      { name, description }
    );

    function selectMachineSet(item) {
      machineSetSelectedvalue.value = item;
      total_worker_of_machine_set.value = item.total_worker;
    }

    watch(
      () => machine_set_options,
      async (newValue, oldValue) => {
        machine_set_paginate.value = newValue.value;
        let params = {
          limit: machine_set_paginate.value.itemsPerPage,
          page: machine_set_paginate.value.page,
        };
        await getOpenshiftMachineSetList({
          payload: { id: id },
          params: params,
        });
        let paginate = {
          itemsLength: machine_set_pagination.value.total_data,
          pageCount: machine_set_pagination.value.total_page,
          itemsPerPage: machine_set_pagination.value.limit,
          page: machine_set_pagination.value.page,
        };
        machine_set_paginate.value = paginate;
      },
      { deep: true }
    );

    onMounted(async () => {
      await getDetail();
      await getOpenshiftMachineSetList({ payload: { id: id } });
      let paginate = {
        itemsLength: machine_set_pagination.value.total_data,
        pageCount: machine_set_pagination.value.total_page,
        itemsPerPage: machine_set_pagination.value.limit,
        page: machine_set_pagination.value.page,
      };
      machine_set_paginate.value = paginate;
      ready.value = true;
    });

    return {
      openshift_detail,
      machine_set_paginate,
      machine_set_options,
      machine_set_headers,
      machine_set_list,
      machine_set_pagination,
      tabs,
      update,
      $v,
      id,
      customSize,
      name,
      status,
      total_worker,
      total_machine_set,
      total_worker_of_machine_set,
      description,
      host,
      username,
      ready,
      addWorker,
      resizeWorker,
      doDeleteMachineSet,
      edit_total_worker,
      selectMachineSet,
      show_dialog_add_worker,
      dialog_delete_machine_set,
      ShowDialogAddWorker,
      showDialogPassword,
      showDialogReveal,
      dataKey,
      dialog_add_machine_set,
      nameUpdate,
      descriptionUpdate,
      dialog_resize_worker,
      read_only,
      validateprivilages,
      errorResize,
    };
  },
};
</script>

<style scoped lang="scss">
.selected {
  border-color: #2c94d2;
}
.actions-in-tabs-custom {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex: 0 1 auto;
  font-size: 0.875rem;
  font-weight: 500;
  justify-content: center;
  letter-spacing: 0.0892857143em;
  line-height: normal;
  min-width: 90px;
  max-width: 360px;
  outline: none;
  padding: 0 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.img-open {
  display: grid;
  justify-content: center;
}
::v-deep .v-item-group.theme--light.v-slide-group.v-tabs-bar.v-tabs-bar--is-mobile.primary--text {
  display: grid;
}
::v-deep .v-btn:before {
  background-color: transparent !important;
}
</style>
