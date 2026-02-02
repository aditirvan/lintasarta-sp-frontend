<template>
  <!-- <p>instance</p> -->
  <div>
    <!-- contoh template -->
    <v-row>
      <v-col cols="12" class="no-pd">
        <v-card class="rounded-lg elevation-0">
          <v-container fluid class="px-7 py-4">
            <v-row v-if="isLoading || (storages.length && dataPath == 'storage')" justify="center">
              <v-col cols="8" :class="{ 'col-12': read_only }">
                <div class="headline mb-2 font-weight-bold font--text">Storage</div>
                <p style="color: #a5b3bf">highly available storage capacity for your instance.</p>

              </v-col>
              <v-col cols="4" class="d-flex justify-end align-center" v-if="!read_only">
                <v-btn v-if="user_role === 'Superadmin'" depressed width="150" height="45" append class="secondary mr-5" exact @click="() => {openSyncDialog = true;}"> Sync Storage </v-btn>
                <v-btn depressed width="150" height="45" append class="secondary" exact to="/storage/create"> Create Storage </v-btn>
              </v-col>
            </v-row>

            <v-row v-if="(dataPath == 'storage' && storages.length) || dataPath == 'project'">
              <v-col cols="12">
                <v-data-table
                  id="DataTableListStorage"
                  @pagination="pagination"
                  hide-default-footer
                  :headers="headers"
                  :items="storages"
                  :items-per-page="10"
                  class="elevation-0"
                >
                  <template v-slot:no-data v-if="dataPath == 'project' && storages.length == 0">
                    <div class="my-7 text-center">
                      <p style="font-size: 16px; margin-bottom: 10px; text-transform: capitalize; text-align: center" class="font-weight-bold">
                        Looks like you don’t have any Storages
                      </p>
                      <v-row class="d-flex justify-center">
                        <v-col cols="12" lg="6" md="12" class="text-center" style="color: #a5b3bf">
                          <p style="font-size: 12px; color: #a5b3bf; margin-bottom: 20px; font-weight: normal">
                            Store and quickly access any amount of data reliably in the cloud and offers several kinds of storage depending on your needs.
                          </p>
                        </v-col>
                      </v-row>
                      <v-btn v-if="!read_only && user_role === 'Superadmin'" @click="() => {openSyncDialog = true;}" width="100%" max-width="150" height="50" depressed class="secondary mr-5" exact>
                        Sync Storage
                      </v-btn>
                      <v-btn v-if="!read_only" to="/storage/create" width="100%" max-width="300" height="50" depressed class="secondary" exact>
                        Create Storage
                      </v-btn>
                    </div>
                  </template>
                  <template v-slot:item.name="{ item }">
                    <div class="d-flex">
                      <div class="dotblue"></div>
                      <span class="primary--text">{{ item.name }}</span>
                    </div>
                  </template>
                  <template v-slot:item.billing_type="{ item }">
                    {{ getBillingTypeLabel(item.billing_type) }}
                  </template>
                  <template v-slot:item.package_storage="{ item }">
                    {{ item.package_storage.type.name }}
                  </template>
                  <template v-slot:item.instance="{ item }">
                    <div>
                      <router-link
                        :to="{
                          path: `/project/${projectname}/${item.project.id}/${item.instance.id}/`,
                        }"
                        v-if="item.instance && item.instance.instanceName"
                        class="d-flex haveinstance"
                      >
                        <div class="dotblue" style="margin-top: 1px"></div>
                        <div>
                          <span class="text-grey"> {{ item.path }} on </span> <span class="primary--text">{{ item.instance.instanceName }}</span>
                        </div>
                      </router-link>
                      <div
                        v-else
                        class="linkpointer nothaveinstance"
                        @click="
                          () => {
                            if (read_only) {
                              return;
                            }
                            validateprivilages(['Storage', 'editor']).then(() => {
                              selectedstorage = item;
                              dialogAttachtoInstance = true;
                            });
                          }
                        "
                        :style="[read_only ? { color: '#a9a9a9 !important' } : {}]"
                      >
                        Attach to Instance
                      </div>
                    </div>
                  </template>
                  <template v-slot:item.ipaddress="{ item }">
                    <p class="ip">
                      <span class="ipaddress">Int <span class="tik">:</span></span
                      ><span>{{ item.instance.ipv4 }}</span>
                    </p>
                    <p class="ip">
                      <span class="ipaddress">Ext <span class="tik">:</span></span
                      >{{ item.instance.ext }}
                    </p>
                  </template>
                  <template v-slot:item.proj_region="{ item }">
                    {{ item.proj_region.toUpperCase() }}
                  </template>
                  <template v-slot:item.createddate="{ item }">
                    {{ $moment(new Date(item.createdate)).format("DD/MM/YYYY") }}
                  </template>
                  <template v-slot:item.action="{ item }">
                    <popupquote v-model="showMenu" :offsetTop="20" offset-y allow-overflow :documentid="'popup' + item.id">
                      <template v-slot:activator="{ on, attrs }">
                        <label
                          v-bind="attrs"
                          class="primary--text linkpointer"
                          style="position: relative"
                          @click="
                            ($event) => {
                              selectedstorage = item;
                              on.click($event);
                              show($event, item);
                            }
                          "
                          >More
                          <v-icon
                            :class="{
                              rotate: item.id == selectedstorage.id && showMenu,
                            }"
                            :id="'popup' + item.id"
                            color="primary"
                            >mdi-chevron-down
                          </v-icon>
                        </label>
                      </template>
                      <v-list>
                        <v-list-item :disabled="disabledField || item.path == '/dev/vda'" v-if="selectedstorage.instance && selectedstorage.instance.id">
                          <v-list-item-title
                            ><label
                              @click="
                                () => {
                                  dialogDetachStorage = true;
                                }
                              "
                              >Detach from Instance</label
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item :disabled="disabledField" v-else>
                          <v-list-item-title
                            ><label
                              @click="
                                () => {
                                  dialogAttachtoInstance = true;
                                }
                              "
                              >Attach to Instance</label
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item :disabled="disabledField || item.path == '/dev/vda'">
                          <v-list-item-title
                            ><label
                              @click="
                                () => {
                                  dialogIncreaseVol = true;
                                }
                              "
                              >Increase Size</label
                            ></v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item to="/image/snapshot#snapshotStorage" :disabled="disabledField">
                          <v-list-item-title> <label>Take Snapshot</label></v-list-item-title>
                        </v-list-item>

                        <v-list-item
                          :disabled="disabledField"
                          style="border-bottom: 1px lightgrey solid"
                          @click="
                            () => {
                              selectedStorage = item;
                              openDialogDetail = true;
                            }
                          "
                        >
                          <v-list-item-title>Detail</v-list-item-title>
                        </v-list-item>

                        <v-list-item :disabled="disabledField || item.path == '/dev/vda'">
                          <v-list-item-title
                            ><label
                              class="error--text"
                              @click="
                                () => {
                                  validateprivilages(['Storage', 'editor']).then(() => {
                                    dialogDeleteVol = true;
                                  });
                                }
                              "
                              >Delete</label
                            ></v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </popupquote>
                  </template>
                  <template v-if="storages.length > 5" v-slot:footer="{ props }">
                    <custom-footer-datatable :props="props" />
                  </template>
                </v-data-table>
              </v-col>
            </v-row>

            <v-row v-else-if="dataPath == 'storage' && storages.length == 0">
              <v-col cols="8">
                <div class="headline mb-2 font-weight-bold font--text">Storage</div>
                <p style="color: #a5b3bf">highly available storage capacity for your instance.</p>
              </v-col>
              <v-col md="12">
                <v-card flat outlined class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto">
                  <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                    <p style="font-size: 16px; margin-bottom: 10px; text-transform: capitalize" class="font-weight-bold">
                      Looks like you don’t have any Storage
                    </p>
                    <v-row>
                      <v-col>
                        <p style="font-size: 12px; color: #a5b3bf; margin-bottom: 20px">
                          Store and quickly access any amount of data reliably in the cloud and offers several kinds of storage depending on your needs.
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col v-if="!read_only">
                        <v-btn v-if="user_role === 'Superadmin'" width="100%" append max-width="150" height="50" depressed class="secondary mr-5" exact @click="() => {openSyncDialog = true;}"> Sync Storage </v-btn>
                        <v-btn width="100%" append max-width="300" height="50" depressed class="secondary" exact to="/storage/create"> Create Storage </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-dialog v-model="dialogDetachStorage" max-width="500">
              <v-card>
                <v-card-title>
                  <div class="headline font-weight-bold font--text">Detach {{ selectedstorage.name }} from Instance?</div>
                </v-card-title>
                <v-card-text>
                  <b>Warning:</b> Detaching a volume from a running Instance may cause data loss. Power off the Instance first, or make sure it isn’t currently
                  writing to the volume before proceeding. You’ll be able to access your detached volume and data in the “Volumes" tab, and you will still be
                  charged for it.
                </v-card-text>
                <v-card-text>
                  <p class="font-weight-bold">Are you sure you want to proceed?</p>
                </v-card-text>
                <v-card-actions>
                  <v-row class="ma-2">
                    <v-col cols="6">
                      <v-btn
                        depressed
                        height="50"
                        color="accent"
                        block
                        @click="
                          () => {
                            dialogDetachStorage = false;
                          }
                        "
                      >
                        <span style="font-size: 14px; font-weight: 700">Cancel</span>
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        depressed
                        height="50"
                        color="error"
                        block
                        @click="
                          () => {
                            detachfrominstance();
                            dialogDetachStorage = false;
                          }
                        "
                      >
                        <span style="font-size: 14px; font-weight: 700">Confirm</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <dialogAttachInstance
              v-model="dialogAttachtoInstance"
              @close="
                () => {
                  dialogAttachtoInstance = false;
                }
              "
              @confirm="AttachStorageToInstance"
            />
            <dialogCreateSnapshot
              v-model="dialogSnapshot"
              @close="
                () => {
                  dialogSnapshot = false;
                }
              "
            />
            <dialogIncreaseVolume
              v-if="dialogIncreaseVol"
              v-model="dialogIncreaseVol"
              :storage="selectedstorage"
              @close="
                () => {
                  dialogIncreaseVol = false;
                }
              "
            />
            <dialogDeleteStorage
              v-model="dialogDeleteVol"
              :storage="selectedstorage"
              @close="
                () => {
                  dialogDeleteVol = false;
                }
              "
              @confirm="
                () => {
                  deleteStorage(selectedstorage.id);
                }
              "
            />
            <dialogSyncStorage
            v-if="openSyncDialog" 
            v-model="openSyncDialog"
            :isLoading="isLoading"
            @close="openSyncDialog = false"/>

            <dialogDetail v-model="openDialogDetail" :selectedStorage="selectedStorage" />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
// import { useActions } from "vuex-composition-helpers";
import dialogAttachInstance from "./dialogAttachInstance";
import dialogCreateSnapshot from "./dialogCreateSnapshot";
import dialogIncreaseVolume from "./dialogIncreaseVolume";
import dialogDeleteStorage from "./dialogDeleteStorage";
import dialogSyncStorage from "./dialogSyncStorage.vue";
import dialogDetail from "./dialogDetail";
import { useCreateStorage } from "./composableapi/usecreatestorage";
import { onMounted, ref, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import localstorage from "@/lib/localstorage";
import { PROJECT } from "../project/namespace";

import { AccessControl } from "@/lib/middleware";

export default {
  props: ["instanceid"],
  setup(props, context) {
    const headers = ref([
      { text: "Name", value: "name" },
      { text: "Billing Type", value: "billing_type" },
      { text: "Storage Type", value: "storage_type" },
      { text: "Size", value: "size" },
      { text: "Instance Name", value: "instance" },
      // { text: "Region", value: "proj_region" },

      // { text: "Created Date", value: "createddate" },
      { text: "Action", sortable: false, align: "center", value: "action" },
    ]);
    const user_role = localstorage.getItem("role");
    const {
      deletestorage,
      storages,
      fetchstorages,
      selectedstorage,
      detachfrominstance: Detachfrominstance,
      updateStorage,
      attachStorage,
      isLoading,
    } = useCreateStorage();

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Project Storage"));
    function deleteStorage(storageid) {
      return deletestorage(storageid);
    }

    function detachfrominstance() {
      const { instanceid } = context.root._route.params;
      if (instanceid)
        Detachfrominstance({
          ...selectedstorage.value,
          filterByInstance: true,
        });
      else
        Detachfrominstance({
          ...selectedstorage.value,
          filterByInstance: false,
        });
    }

    function AttachStorageToInstance(instance) {
      let selected = selectedstorage.value;
      let instance_id = instance;

      let payload = {
        openstack_vm_uuid: instance_id.openstack_vm_uuid,
        storage_id: selected.id,
      };
      attachStorage(payload);
    }

    const { projectname } = useNamespacedState(PROJECT, ["projectname"]);

    const disabledField = ref(false);
    const { validateprivilages, validateprivilagesync, validateprivilagesyncnew, openDialogDontHavePermition } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
      "openDialogDontHavePermition",
    ]);

    validateprivilagesyncnew(["Storage", "editor"]).then((res) => {
      disabledField.value = res;
    });

    onMounted(async () => {
      const { instanceid } = context.root._route.params;
      if (read_only.value) {
        headers.value.pop();
      }
      await fetchstorages({ instance_id: instanceid });
    });

    const getBillingTypeLabel = (type) => {
      if (type == "PPU") return "Pay Per Use";
      else return type;
    };

    const selectedStorage = ref(null);
    const openDialogDetail = ref(false);
    const dataPath = computed(() => {
      const pattern = /[\w\-]+/g;
      const hasil = context.root.$route.path.match(pattern);
      return hasil[0];
    });

    const openSyncDialog = ref(false);

    const openSyncDialogHandler = () => {
      openSyncDialog.value = true;
    };

    return {
      read_only,
      openDialogDontHavePermition,

      headers,
      getBillingTypeLabel,
      disabledField,
      validateprivilagesyncnew,
      validateprivilagesync,
      validateprivilages,
      isLoading,
      fetchstorages,
      storages,
      selectedstorage,
      deletestorage,
      deleteStorage,
      dialogDeleteVol: ref(false),
      detachfrominstance,
      dialogAttachtoInstance: ref(false),
      AttachStorageToInstance,
      projectname,
      selectedStorage,
      openDialogDetail,
      dataPath,
      openSyncDialog,
      openSyncDialogHandler,
      user_role
    };
  },
  computed: {
    userType() {
      return localstorage.getItem("type");
    },
    userRole() {
      return localstorage.getItem("role");
    },
  },
  data() {
    const dialogSnapshot = false;
    return {
      dialogDeleteVol: false,
      dialogIncreaseVol: false,
      dialogSnapshot,
      dialogDetachStorage: false,
      showMenu: false,
      coordinate: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    show(e, storage) {
      this.selectedstorage = storage;
      e.preventDefault();
      this.showMenu = false;
      this.coordinate.x = e.clientX - 20;
      this.coordinate.y = e.clientY + 10;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    ondialogSnapshot() {},
    pagination() {},
  },
  components: {
    dialogCreateSnapshot,
    dialogIncreaseVolume,
    dialogDeleteStorage,
    dialogAttachInstance,
    dialogDetail,
    dialogSyncStorage
  },
};
</script>

<style lang="scss" scoped>
[role="menu"] {
  margin-top: 12px;
}

.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}

.mdi-chevron-down::before {
  transition: 100ms linear all;
}

p {
  margin-bottom: 0px;

  .ipaddress {
    display: inline-block;
    width: 50px;
    position: relative;

    .tik {
      position: absolute;
      right: 10px;
      display: inline-block;
    }
  }
}

.select-view {
  border: 6px solid #f2f2f2;
  border-radius: 4px;
  background-color: #f2f2f2;
  opacity: 0.5;

  &.selected {
    opacity: 1;
  }
}

.instanceinfo {
  .col:first-child {
    p {
      font-weight: 700;
    }
  }

  .col {
    padding: 0px 0px 0px 12px;
    font-size: 10px;
  }
}

.v-list-item {
  min-height: 38px;
}

.v-list-item__title {
  font-weight: 600;

  label:hover {
    cursor: pointer;
  }
}

.animate {
  ::v-deep .v-data-table {
    visibility: hidden;
  }
}
.no-pd {
  padding: 0 !important;
}
</style>
<style lang="scss">
#DataTableListStorage {
  font-weight: 600;

  td {
    padding-top: 20px;
    padding-bottom: 14px;
  }
}

.text-grey {
  color: #556272 !important;
}
</style>
