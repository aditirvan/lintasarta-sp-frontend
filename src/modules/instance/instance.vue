<template>
  <!-- <p>instance</p> -->
  <div>
    <!-- contoh template -->
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg elevation-0">
          <v-container class="px-7 py-4" fluid>
            <!-- <v-col v-if="instances.length" cols="8">
              <v-tabs>
                <v-tab to="/instance">Instance</v-tab>
                <v-tab to="/instance/auto-scaling">Auto Scaling</v-tab>
              </v-tabs>
            </v-col> -->

            <v-row v-if="isLoading || instances.length" justify="center">
              <v-col cols="12" md="8">
                <div class="headline font-weight-bold font--text">Instance</div>
              </v-col>
              <v-col cols="12" md="4" class="d-flex justify-end align-center">
                <v-icon
                  @click="selected = 'grid'"
                  :class="{ selected: isSelected('grid') }"
                  class="select-view mr-5"
                  left
                  >$vuetify.icons.columnviewIcon
                </v-icon>
                <v-icon
                  @click="selected = 'list'"
                  :class="{ selected: isSelected('list') }"
                  class="select-view mr-5"
                  left
                  >$vuetify.icons.listviewIcon
                </v-icon>
                <v-btn
                  v-if="!read_only && user_role === 'Superadmin'"
                  depressed
                  height="45"
                  width="150"
                  append
                  @click="
                    () => {
                      openSyncDialog = true;
                    }
                  "
                  class="secondary mr-5"
                >
                  Sync Instance
                </v-btn>
                <v-btn
                  v-if="!read_only"
                  depressed
                  height="45"
                  width="150"
                  append
                  to="create"
                  class="secondary mr-5"
                >
                  Create Instance
                </v-btn>

                <!-- <v-btn                  
                  v-if="!read_only"
                  depressed
                  height="45"
                  width="150"
                  append
                  to="servergroup"
                  class="secondary"
                  >Server Group</v-btn
                > -->
              </v-col>
            </v-row>

            <v-row
              v-if="instances.length || isLoading"
              v-show="isSelected('list')"
            >
              <v-col cols="12">
                <instances-datatable></instances-datatable>
              </v-col>
            </v-row>

            <!-- if instances > 0 -->
            <v-row
              v-if="isLoading || instances.length"
              v-show="isSelected('grid')"
            >
              <v-col
                :class="{ animate: isLoading }"
                cols="12"
                sm="6"
                md="4"
                lg="4"
                v-for="instance in instances"
                :key="instance.id"
              >
                <v-card
                  :class="{ hidden: isLoading }"
                  outlined
                  class="rounded-lg fullheight"
                  style="border-color: #2c94d2"
                >
                  <v-card-text>
                    <v-row>
                      <v-col class="py-0 pr-0">
                        <div class="d-flex">
                          <div
                            class="flex-grow-1 d-flex"
                            style="align-items: center"
                          >
                            <beat-loader
                              v-if="!instance.openstack_vm_uuid"
                              :isLoading="true"
                              :color="'#1f60a8'"
                              :size="'10px'"
                              class="mr-2"
                            ></beat-loader>
                            <Loading v-else-if="(instance.state === 'loading')" :loading_model="'style-a'"/>
                            <v-icon
                              v-else
                              class="mr-3"
                              style="font-size: 30px"
                              :color="getStatusColor(instance)"
                              >mdi-circle
                            </v-icon>
                            <div>
                              <span
                                v-if="!instance.openstack_vm_uuid"
                                class="font-weight-bold"
                                >{{ instance.instanceName }}</span
                              >
                              <router-link
                                v-else
                                :to="{ path: `/instance/${instance.id}/` }"
                              >
                                <span class="primary--text font-weight-bold">{{
                                  instance.instanceName
                                }}</span>
                              </router-link>
                              <p style="font-size: 11px; color: #a5b3bf">
                                {{ instance.package.vcpu }} vCPU /
                                {{ instance.package.ram }} GB Memory /
                                {{ instance.package.root_disk }} GB Root Disk
                                <br />
                                <span v-if="instance.image">
                                  {{ instance.image.name }}
                                  {{ instance.image.version_number }}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div style="white-space: nowrap">
                            <!-- <v-icon
                              @click="
                                () => {
                                  openConsole(
                                    instance.project_id,
                                    instance.openstack_vm_uuid
                                  );
                                }
                              "
                              style="
                                background: #1f60a8;
                                border-radius: 2px;
                                font-size: 16px;
                              "
                              color="white"
                              >mdi-console-line
                            </v-icon> -->

                            <!-- {{ instance }} -->

                            <popupquote
                              :nudge-left="100"
                              :offsetTop="16"
                              v-model="popo"
                              :documentid="'popupa' + instance.id"
                              offset-y
                              allow-overflow
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                  :id="'popupa' + instance.id"
                                  v-bind="attrs"
                                  style="font-size: 16px"
                                  @click="
                                    ($event) => {
                                      on.click($event);
                                      show($event, instance);
                                    }
                                  "
                                  >mdi-dots-vertical
                                </v-icon>
                              </template>
                              <v-list v-if="activemenuinstance">
                                <v-list-item
                                  v-if="!instance.floating_ip && !read_only"
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ]) ||
                                    !instance.openstack_vm_uuid ||
                                    ![null, ''].includes(
                                      instance.revert_expired
                                    ) ||
                                    !['ACTIVE', 'SHUTOFF'].includes(
                                      instance.state
                                    )
                                  "
                                  @click="
                                    () => {
                                      openFloatingIPDialog = true;
                                      activemenuinstance = instance;
                                    }
                                  "
                                  exact
                                >
                                  <v-list-item-title
                                    >Add Floating IP</v-list-item-title
                                  >
                                </v-list-item>
                                <v-list-item
                                  v-else-if="!read_only"
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ]) ||
                                    ![null, ''].includes(
                                      instance.revert_expired
                                    ) ||
                                    !['ACTIVE', 'SHUTOFF'].includes(
                                      instance.state
                                    )
                                  "
                                  @click="
                                    () => {
                                      unassignFloatingIP(
                                        instance.floating_ip
                                      );
                                    }
                                  "
                                  exact
                                >
                                  <v-list-item-title
                                    >Unassign Floating IP</v-list-item-title
                                  >
                                </v-list-item>
                                <v-list-item
                                  v-if="!read_only"
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ]) ||
                                    !activemenuinstance.openstack_vm_uuid ||
                                    ![null, ''].includes(
                                      activemenuinstance.revert_expired
                                    ) ||
                                    !['ACTIVE', 'SHUTOFF'].includes(
                                      activemenuinstance.state
                                    ) ||
                                    instance.state === 'SHUTOFF'
                                  "
                                  @click="
                                    () => {
                                      openConsole(
                                        activemenuinstance.project_id,
                                        activemenuinstance.openstack_vm_uuid
                                      );
                                    }
                                  "
                                >
                                  <v-list-item-title
                                    >Access Console
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item
                                  v-if="!read_only"
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ]) ||
                                    !activemenuinstance.openstack_vm_uuid ||
                                    ![null, ''].includes(
                                      activemenuinstance.revert_expired
                                    ) ||
                                    !['ACTIVE', 'SHUTOFF'].includes(
                                      activemenuinstance.state
                                    )
                                  "
                                  :to="
                                    '/instance/' +
                                    activemenuinstance.id +
                                    '/resize'
                                  "
                                  exact
                                >
                                  <v-list-item-title
                                    >Resize Instance
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item
                                  v-if="!read_only"
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ]) ||
                                    !activemenuinstance.openstack_vm_uuid ||
                                    ![null, ''].includes(
                                      activemenuinstance.revert_expired
                                    ) ||
                                    !['ACTIVE', 'SHUTOFF'].includes(
                                      activemenuinstance.state
                                    )
                                  "
                                  @click="openResizeRootDisk = true"
                                  exact
                                >
                                  <v-list-item-title
                                    >Resize Root Disk
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ]) ||
                                    !activemenuinstance.openstack_vm_uuid ||
                                    ![null, ''].includes(
                                      activemenuinstance.revert_expired
                                    ) ||
                                    !['ACTIVE', 'SHUTOFF'].includes(
                                      activemenuinstance.state
                                    )
                                  "
                                  :to="
                                    '/instance/' +
                                    activemenuinstance.id +
                                    '/agent'
                                  "
                                >
                                  <v-list-item-title
                                    >View Usage
                                  </v-list-item-title>
                                </v-list-item>
                                <!-- <v-list-item
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ])
                                  "
                                  :to="
                                    '/instance/' +
                                    activemenuinstance.id +
                                    '/backups'
                                  "
                                > -->
                                <v-list-item
                                  v-if="!read_only"
                                  disabled
                                  :to="
                                    '/instance/' +
                                    activemenuinstance.id +
                                    '/backups'
                                  "
                                >
                                  <v-list-item-title
                                    >Enable Backup
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item
                                  v-if="!read_only"
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ]) ||
                                    !activemenuinstance.openstack_vm_uuid ||
                                    ![null, ''].includes(
                                      activemenuinstance.revert_expired
                                    ) ||
                                    !['ACTIVE', 'SHUTOFF'].includes(
                                      activemenuinstance.state
                                    )
                                  "
                                  :to="
                                    '/instance/' +
                                    activemenuinstance.id +
                                    '/snapshots'
                                  "
                                  style="border-bottom: 1px solid lightgray"
                                >
                                  <v-list-item-title
                                    >Create Snapshot
                                  </v-list-item-title>
                                </v-list-item>
                                <v-list-item
                                  v-if="!read_only"
                                  :disabled="
                                    !validateprivilagesync([
                                      'Instance',
                                      'editor',
                                    ])
                                  "
                                  @click="() => {}"
                                >
                                  <v-list-item-title class="error--text"
                                    >Delete Instance
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </popupquote>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="12"
                        lg="12"
                        xl="6"
                        class="instanceinfo pb-0 pt-0 mt-2"
                      >
                        <v-row>
                          <v-col cols="5"><p>Region</p></v-col>
                          <v-col cols="7" class="text-right pr-3">
                            <p>{{ instance.region.region }}</p></v-col
                          >
                        </v-row>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        lg="12"
                        xl="6"
                        class="instanceinfo pt-0 mt-xl-2"
                      >
                        <v-row
                          v-if="instance.openstack_vm_uuid && instance.ipv4"
                        >
                          <v-col cols="5"><p>IP Internal</p></v-col>
                          <v-col cols="7" class="text-right pr-3">
                            <p>{{ instance.ipv4 }}</p>
                          </v-col>
                        </v-row>
                        <v-row
                          v-if="
                            instance.openstack_vm_uuid && instance.ip_gateway
                          "
                        >
                          <v-col cols="5"><p>IP Gateway</p></v-col>
                          <v-col cols="7" class="text-right pr-3"
                            ><p>{{ instance.ip_gateway || "-" }}</p></v-col
                          >
                        </v-row>
                        <v-row
                          v-if="instance.openstack_vm_uuid && instance.ipext"
                        >
                          <v-col cols="5"><p>IP External</p></v-col>
                          <v-col cols="7" class="text-right pr-3"
                            ><p>{{ instance.ipext }}</p></v-col
                          >
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-divider style="border: 0.5px dashed #2c94d2" />
                  <v-card-text>
                    <div class="d-flex flex-row">
                      <div class="flex-grow-1">
                        <p style="font-weight: 700; font-size: 12px">
                          {{ instance.state }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p style="font-size: 12px; font-weight: 700">
                          {{ instance.vpc.name || "-" }}
                        </p>
                        <p style="font-size: 12px">
                          {{ instance.vpc.ip_prefix }}
                          {{
                            instance.vpc
                              ? `/${instance.vpc.network_size}`
                              : null
                          }}
                        </p>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- else -->
            <v-row v-else>
              <!-- <v-col cols="8">
                <v-tabs>
                  <v-tab to="/instance">Instance</v-tab>
                  <v-tab to="/instance/auto-scaling">Auto Scaling</v-tab>
                </v-tabs>
              </v-col> -->
              <v-col md="12">
                <v-card
                  flat
                  outlined
                  class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
                >
                  <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                    <p
                      style="
                        font-size: 16px;
                        margin-bottom: 10px;
                        text-transform: capitalize;
                      "
                      class="font-weight-bold"
                    >
                      Looks like you don’t have any Instance
                    </p>
                    <v-row class="d-flex justify-center">
                      <v-col cols="12" lg="8" md="12">
                        <p
                          style="
                            font-size: 12px;
                            color: #a5b3bf;
                            margin-bottom: 20px;
                          "
                        >
                          Build and release faster with scalable instance
                          products in the cloud. Provides flexible server
                          configurations sized for any application, industry
                          leading price to performance, and predictable pricing
                          that is the same across regions and usage volumes.
                        </p>
                      </v-col>
                    </v-row>
                    <v-btn                  
                      v-if="!read_only && userRole === 'Superadmin'"
                      depressed
                      height="50"
                      width="150"
                      append
                      @click="
                        () => {
                          openSyncDialog = true;
                        }
                      "
                      class="secondary mr-5"
                      >Sync Instance</v-btn
                    >
                    <v-btn
                      append
                      width="300"
                      height="50"
                      depressed
                      class="secondary mr-5"
                      to="/instance/create"
                      v-if="!read_only"
                    >
                      Create Instance
                    </v-btn>
                    <v-btn                  
                      v-if="!read_only"
                      depressed
                      height="50"
                      width="150"
                      append
                      to="servergroup"
                      class="secondary"
                      >Server Group</v-btn
                    >
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <dialogDeleteInstance
              v-if="activemenuinstance"
              v-model="opendialogdelete"
              :isLoading="isLoading"
              @close="doDelete"
              :selectedinstance="activemenuinstance"
            />

            <dialogSyncInstance
            v-if="openSyncDialog" 
            v-model="openSyncDialog"
            :isLoading="isLoading"
            @close="openSyncDialog = false"/>

            <dialogResizeRootDisk
              v-if="openResizeRootDisk"
              v-model="openResizeRootDisk"
              :isLoading="isLoading"
              @close="openResizeRootDisk = false"
              :selectedInstance="activemenuinstance"
            />

            <dialogFloatingIP 
            v-if="openFloatingIPDialog" 
            v-model="openFloatingIPDialog" 
            :item="activemenuinstance"/>

          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import dialogFloatingIP from "@/modules/instance/dialogFloatingIP";
import dialogDeleteInstance from "./dialogDeleteInstance";
import instancesDatatable from "@/modules/project/resource/instance.vue";
import dialogSyncInstance from "@/modules/instance/dialogsyncinstance.vue"
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import { INSTANCE } from "./namespace";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import popupquote from "../customsharedcomponents/popupquote.vue";
import { mapGetters } from "vuex";
import dialogResizeRootDisk from "./dialogResizeRootDisk.vue";
import localstorage from "@/lib/localstorage";
import Loading from "@/components/Loading";

import { AccessControl } from "@/lib/middleware";

export default {
  computed: {
    ...mapGetters({
      projectname: "PROJECT/getprojectname",
      privilagesGroup: "HOMEPAGE/privilagesGroup",
    }),
    userType() {
      return localstorage.getItem("type");
    },
    userRole() {
      return localstorage.getItem("role");
    },
  },
  components: {
    dialogFloatingIP,
    popupquote,
    dialogDeleteInstance,
    dialogSyncInstance,
    dialogResizeRootDisk,
    instancesDatatable,
    Loading
  },
  setup(props, context) {
    props;
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Instance'));
    const { fetchPaginatedInstances, deleteInstance, openconsole } =
      useNamespacedActions(INSTANCE, [
        "fetchPaginatedInstances",
        "deleteInstance",
        "openconsole",
      ]);

    const user_role = localstorage.getItem("role");
    const openResizeRootDisk = ref(false);
    const openFloatingIPDialog = ref(false);
    const openSyncDialog = ref(false);

    const openSyncDialogHandler = () => {
      openSyncDialog.value = true;
    };

    const { instances, isLoading } = useNamespacedState(INSTANCE, [
      "instances",
      "isLoading",
    ]);
    const selected = ref("list");

    function isSelected(val) {
      return selected.value == val;
    }

    const showMenu = ref(false);
    const coordinate = reactive({ x: 0, y: 0 });
    const activemenuinstance = ref({});

    function show(e, instance) {
      e.preventDefault();

      activemenuinstance.value = instance;
      showMenu1.value = false;
      coordinate.x = e.clientX - 20;
      coordinate.y = e.clientY + 10;
      context.root.$nextTick(() => {
        showMenu1.value = true;
      });
    }

    const { addfloatingip, UNASSIGN_FLOATING_IP } = useNamespacedActions(
      "NETWORKFLOATINGIP",
      ["addfloatingip", "UNASSIGN_FLOATING_IP"]
    );

    const assignFloatingIP = async (id) => {
      let response = await addfloatingip(id);
      if (response.status === 200) await fetchPaginatedInstances();
    };

    const unassignFloatingIP = async (id) => {
      let response = await UNASSIGN_FLOATING_IP(id);
      if (response.status === 200) await fetchPaginatedInstances();
    };

    const showMenu1 = ref(false);
    const { validateprivilages, validateprivilagesync } = useNamespacedActions(
      "HOMEPAGE",
      ["validateprivilages", "validateprivilagesync"]
    );
    const getStatusColor = (instance) => {
      if (
        ["RESIZE", "RESIZING", "VERIFY_RESIZE"].includes(instance.state) ||
        !["", null].includes(instance.revert_expired)
      )
        return "orange";
      else if (instance.state == "ACTIVE") return "primary";
      else if (instance.state == "SHUTOFF") return "error";
      else if (instance.state == "" || instance.state == "NOT EXIST") return "disabled";
      else return "error";
    };

    onMounted(() => {
      fetchPaginatedInstances();
    });

    return {
      openFloatingIPDialog,
      read_only,
      openSyncDialog,
      openSyncDialogHandler,

      openResizeRootDisk,
      fetchPaginatedInstances,
      isBuilding: (uuid) => (uuid ? false : true),
      unassignFloatingIP,
      assignFloatingIP,
      validateprivilages,
      validateprivilagesync,
      isLoading,
      opendialogdelete: ref(false),
      deleteInstance,
      coordinate,
      showMenu1,
      instances,
      selected,
      isSelected,
      showMenu,
      show,
      activemenuinstance,
      getStatusColor,
      user_role,
      async openConsole(project_id, openstack_vm_uuid) {
        let params = {
          project_id: project_id,
          openstack_vm_uuid: openstack_vm_uuid,
        };
        await openconsole(params);
      }, // End of Open Console
    };
  },
  methods: {
    async doDelete(val) {
      if (val) {
        await this.deleteInstance({
          project_id: this.activemenuinstance.project_id,
          instance_id: this.activemenuinstance.id,
        });
        this.fetchPaginatedInstances;
        this.opendialogdelete = false;
      } else {
        this.opendialogdelete = false;
      }
    },
  },
  data() {
    return {
      popo: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "IP Address", value: "ipaddress" },
        { text: "Region", value: "region" },
        { text: "Created date", value: "createddate" },
        // {text: "Tags", value: "tags"},
        { text: "Action", sortable: false, align: "center", value: "action" },
      ],
    };
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
    overflow-wrap: initial;
    padding: 0px 0px 0px 12px;
    font-size: 12px;
  }
}
</style>
<style lang="scss">
#DataTableListInstance {
  font-weight: 600;

  td {
    padding-top: 20px;
    padding-bottom: 14px;
  }
}
.fullheight {
  height: 100%;
}
</style>
