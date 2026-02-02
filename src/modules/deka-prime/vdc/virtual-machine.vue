<template>
  <div>
    <!-- <v-container fluid class=""> -->
    <v-row class="d-flex justify-center"
      ><v-col cols="12" class="d-flex">
        <div class="headline font-weight-bold font--text">Instance</div>
        <v-spacer></v-spacer>
      <!-- </v-col>
      <v-col md="2"> -->
        <router-link to="/dp-instance/create-instance">
          <v-btn
          depressed
          color="secondary"
          height="45"
          width="150"
            v-if="!read_only"
            >Create Instance
          </v-btn
          >
        </router-link></v-col
      ></v-row
    >
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="listVm"
          item-key="id"
          single-line
          class="elevation-0"
          :items-per-page="itemsPerPage"
          :server-items-length="totalListVm"
          :loading="isLoadingTable"
          hide-default-footer
          loading-text="Loading... Please wait"
        >
          <template #[`item.Name`]="{ item }">
            <v-row>
              <v-col cols="2" class="d-flex pr-0"
                ><v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                    v-if="!item.Busy"
                      :color="
                        item.Status == 'POWERED_OFF' ? 'error' : item.Status == 'POWERED_ON' ? 'primary' : 'grey'
                      "
                      v-bind="attrs"
                      v-on="on"
                      size="30"
                      >mdi-circle</v-icon
                    >
                    <div class="mt-4" v-else>
                      <span>
                        <v-progress-circular
                        v-bind="attrs"
                        v-on="on" :size="28" color="primary" indeterminate></v-progress-circular>
                      </span>
                    </div>
                  </template>
                  <span>{{
                    item.Status == "POWERED_OFF" ? "Shutoff" : item.Status == "POWERED_ON" ? "Active" : item.Status
                  }}</span>
                </v-tooltip></v-col
              >
              <v-col class="pl-0"
                ><span
                  @click="rowList(item)"
                  class="cursor-pointer primary--text"
                  >{{ item.Name }}</span
                >
                <p class="mb-0">{{ item.GuestOS }}</p>
                <p class="mb-0">
                  {{ item.Cpus }} vCPU/ {{ formatSize(item.MemoryMB) }}/
                  {{ formatSize(item.TotalStorageAllocatedMb) }}
                </p>
              </v-col>
            </v-row>
          </template>

          <template #[`item.DateCreated`]="{ item }">
            {{ item.DateCreated ? $FormatDate(item.DateCreated) : "-" }}
          </template>
          <!-- <template #[`item.MemoryMB`]="{ item }">
            {{ formatSize(item.MemoryMB) }}
          </template>
          <template #[`item.TotalStorageAllocatedMb`]="{ item }">
            {{ formatSize(item.TotalStorageAllocatedMb) }}
          </template> -->
          <template #[`item.IpAddress`]="{ item }">
            {{ item.IpAddress || "-" }}
          </template>
          <template #[`item.NetworkName`]="{ item }">
            {{ item.NetworkName || "-" }}
          </template>
          <template #[`item.action`]="{ item }">
            <popupquote
              v-model="popo"
              :offsetTop="20"
              :coordinate="coordinate"
              :documentid="'popup' + getId(item.HREF)"
              offset-y
              allow-overflow
            >
              <template v-slot:activator="{ on, attrs }">
                <label
                  v-bind="attrs"
                  class="primary--text linkpointer"
                  style="position: relative; white-space: nowrap"
                  @click="
                    ($event) => {
                      on.click($event);
                      show($event, item);
                    }
                  "
                  >More
                  <v-icon
                    :class="{
                      rotate: getId(item.HREF) == activemenuinstance && popo,
                    }"
                    :id="'popup' + getId(item.HREF)"
                    color="primary"
                    >mdi-chevron-down
                  </v-icon>
                </label>
              </template>
              <v-list class="cursor-pointer font-weight-bold" width="145">
                <v-list-item
                  @click="
                    () => {
                      validateprivilages(['Dekaprime', 'editor']).then(
                        () => {
                          openWindow(item)
                        }
                      );
                    }
                  "
                  :disabled="item.Status != 'POWERED_ON'"
                >
                  <v-list-item-title
                    ><span>Access Console</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="
                    () => {
                      validateprivilages(['Dekaprime', 'editor']).then(
                        () => {
                          onPower(item)
                        }
                      );
                    }
                  "
                  :disabled="item.Status != 'POWERED_OFF'"
                >
                  <v-list-item-title><span>Power On</span></v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="
                    () => {
                      validateprivilages(['Dekaprime', 'editor']).then(
                        () => {
                          offPower(item)
                        }
                      );
                    }
                  "
                  :disabled="item.Status != 'POWERED_ON'"
                >
                  <v-list-item-title><span>Power Off</span></v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="
                    () => {
                      validateprivilages(['Dekaprime', 'editor']).then(
                        () => {
                          onForce(item)
                        }
                      );
                    }
                  "
                  :disabled="item.Status != 'POWERED_OFF'"
                >
                  <v-list-item-title
                    ><v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                          Power On, Force Recustomization</span
                        >
                      </template>
                      <span>Power On, Force Recustomization</span>
                    </v-tooltip></v-list-item-title
                  >
                </v-list-item>
                <v-divider v-if="role == 'Superadmin'"></v-divider>
                <v-list-item
                v-if="role == 'Superadmin'"
                  @click="
                    () => {
                      validateprivilages(['Dekaprime', 'editor']).then(
                        () => {
                          selectedItem = item
                          openDialogDelete = true
                        }
                      );
                    }
                  "
                  :disabled="item.Status == 'POWERED_ON'"
                >
                  <v-list-item-title class="red--text">
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </popupquote>
            <!-- <v-menu down>
              <template v-slot:activator="{ on, attrs }">
                More<v-icon class="cursor-pointer" v-bind="attrs" v-on="on" color="primary">mdi-chevron-down</v-icon>
              </template> -->

            <!-- </v-menu> -->
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
    <dialogDekaPrime></dialogDekaPrime>
    <DialogDelete
    v-if="openDialogDelete"
    v-model="openDialogDelete"
    :itemSelected="selectedItem"
    :header="'Instance'"
    />
    <!-- </v-container> -->
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedMutations,
} from "vuex-composition-helpers";
import { VDC } from "./namespace";
import DialogCreateVm from "./dialog/dialog-create-vm.vue";
import { DPNETWORK } from "../networking/namespace";
import popupquote from "@/modules/customsharedcomponents/popupquote.vue";
import dialogDekaPrime from "@/modules/dashboard/dialogDekaPrime.vue";
import DialogDelete from './dialog/dialog-delete.vue'
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DialogCreateVm,
    popupquote,
    dialogDekaPrime,
    DialogDelete,
  },
  setup(props, context) {
    const dataCom = computed(() => {
      return dataTicket.value;
    });
    const openDialog = ref(false);
    const openDialogDelete = ref(false);
    const selectedItem = ref();
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Instance"));
    const isEnabledVdc = ref(false)

    const { listVm, totalListVm, isLoadingTable, dataTicket } =
      useNamespacedGetters(VDC, [
        "listVm",
        "totalListVm",
        "isLoadingTable",
        "dataTicket",
      ]);

    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);

    const {
      fetchListVm,
      postTicket,
      powerOn,
      powerOff,
      powerOnForce,
      getDialogPermissionDekaPrime,
    } = useNamespacedActions(VDC, [
      "fetchListVm",
      "postTicket",
      "powerOn",
      "powerOff",
      "powerOnForce",
      "getDialogPermissionDekaPrime",
    ]);
    const { setListVm, setTotalListVm } = useNamespacedMutations(VDC, [
      "setListVm",
      "setTotalListVm",
    ]);

    const { refresh } = useNamespacedActions(DPNETWORK, ["refresh"]);

    onMounted(() => {
      const prime = localStorage.getItem("dekaPrime");
      role.value = localStorage.getItem("role");
      // let Vdc = JSON.parse(localStorage.getItem('vdcById'))
      // isEnabledVdc.value = Vdc?.isEnabled
      if (!prime) {
        setListVm([]);
        setTotalListVm(0);
        getDialogPermissionDekaPrime();
      } else {
        setInterval(() => {
          const deka = localStorage.getItem("dekaPrime");
          if (deka) {
            refresh();
          } else {
            return;
          }
        }, 1000 * 60 * 5);
        refresh();
      }
    });

    const role = ref()
    const headers = ref(read_only.value ? [
      { text: "Name", value: "Name", sortable: false },
      { text: "Created Date", value: "DateCreated", sortable: false },
      { text: "Primary IP Address", value: "IpAddress", sortable: false },
      { text: "Primary Networks", value: "NetworkName", sortable: false },
    ] : [
      { text: "Name", value: "Name", sortable: false },
      { text: "Created Date", value: "DateCreated", sortable: false },
      { text: "Primary IP Address", value: "IpAddress", sortable: false },
      { text: "Primary Networks", value: "NetworkName", sortable: false },
      { text: "Action", value: "action", sortable: false, width: "10%" },
    ]);


    const getId = (string) => {
      const pattern =
        /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      const hasil = string.match(pattern);
      return hasil[6];
    };

    const formatSize = (bytes, decimals = 1) => {
      if (bytes === 0 || bytes === "0") return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };
    const itemsPerPage = ref(10);
    const changePage = (val) => {
      const project = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      itemsPerPage.value = val.itemsPerPage;
      const params = new URLSearchParams();
      params.append("pageSize", itemsPerPage.value);
      params.append("page", val.page);
      const payload = {
        id: project.vmwareProjectId,
        params: params,
      };
      fetchListVm(payload);
    };
    const rowList = (item) => {
      const project = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      context.root.$router.push(
        `/dp-instance/${project.vmwareProjectId}/${getId(item.HREF)}/${getId(
          item.ContainerID
        )}/${item.Name}`
      );
      localStorage.setItem("dataVM", JSON.stringify(item));
    };

    const openWindow = (item) => {
      localStorage.setItem("nameConsole", item.Name);
      let myStr = item.GuestOS;
      let OSDekaprime = myStr.split(" ")[0];
      localStorage.setItem("OSDekaprime", OSDekaprime);
      const idVm = getId(item.HREF);
      const project = JSON.parse(localStorage.getItem("dekaPrime") || "{}");
      const params = {
        id_vdc: project.vmwareProjectId,
        id_vm: idVm,
      };
      postTicket(params);
      setTimeout(() => {
        if (JSON.stringify(dataCom.value) != "{}") {
          url(idVm);
        }
      }, 2000);
    };
    const url = (id) => {
      let myURL = `${window.location.origin}/ws-console/index.html?vmId=${id}`;
      let title = "console";
      let myWidth = 1000;
      let myHeight = 800;
      var left = (screen.width - myWidth) / 2;
      var top = (screen.height - myHeight) / 4;
      window.open(
        myURL,
        title,
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
          myWidth +
          ", height=" +
          myHeight +
          ", top=" +
          top +
          ", left=" +
          left,
        "_blank"
      );
    };

    const onPower = (item) => {
      const params = {
        id_vdc: getId(item.VdcHREF),
        id_vm: getId(item.HREF),
        id_vapp: getId(item.ContainerID),
      };
      powerOn(params);
    };
    const offPower = (item) => {
      const params = {
        id_vdc: getId(item.VdcHREF),
        id_vm: getId(item.HREF),
        id_vapp: getId(item.ContainerID),
      };
      powerOff(params);
    };
    const onForce = (item) => {
      const params = {
        id_vdc: getId(item.VdcHREF),
        id_vm: getId(item.HREF),
        id_vapp: getId(item.ContainerID),
      };
      powerOnForce(params);
    };

    const popo = ref(false);
    const coordinate = reactive({ x: 0, y: 0 });
    const show = (e, instance) => {
      e.preventDefault();
      activemenuinstance.value = getId(instance.HREF);
      showMenu1.value = false;
      coordinate.x = e.clientX - 20;
      coordinate.y = e.clientY + 10;
      context.root.$nextTick(() => {
        showMenu1.value = true;
      });
    };
    const showMenu1 = ref(false);
    const activemenuinstance = ref({});

    return {
      headers,
      listVm,
      openDialog,
      totalListVm,
      isLoadingTable,
      getId,
      formatSize,
      changePage,
      itemsPerPage,
      rowList,
      openWindow,
      postTicket,
      url,
      dataTicket,
      dataCom,
      onPower,
      offPower,
      onForce,
      popo,
      coordinate,
      show,
      showMenu1,
      activemenuinstance,
      read_only,
      validateprivilages,
      openDialogDelete,
      selectedItem,
      role,
      isEnabledVdc,
    };
  },
};
</script>

<style lang="scss" scoped>
[role="menu"] {
  margin-top: 12px;
}
.power {
  background-color: transparent !important;
  box-shadow: none;
}
.theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
  background-color: transparent !important;
}
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}

.mdi-chevron-down::before {
  transition: 100ms linear all;
}
::v-deep .v-data-table td {
  padding-top: 10px !important;
  padding-bottom: 8px !important;
}
</style>
