<template>
  <div style="margin-bottom: 3rem">
    <v-data-table
      class="elevation-0"
      id="DataTableListInstance"
      :hide-default-footer="true"
      :server-items-length="instancePaginator.count"
      :search="instanceSearch"
      :options.sync="instanceOptions"
      :headers="headers"
      :items="instances"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:no-data>
        <!-- <span v-if="isLoading">Loading..</span> -->
        <v-progress-circular
          v-if="isLoading"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <div class="my-7 text-center" v-else>
          <p
            style="
              font-size: 16px;
              margin-bottom: 10px;
              text-transform: capitalize;
            "
            class="font-weight-bold"
          >
            Looks like you don’t have any Instances
          </p>
          <v-row class="d-flex justify-center">
            <v-col
              cols="12"
              lg="6"
              md="12"
              class="text-center"
              style="color: #a5b3bf"
            >
              <p
                style="
                  font-size: 12px;
                  color: #a5b3bf;
                  margin-bottom: 20px;
                  font-weight: normal;
                "
              >
                Build and release faster with scalable instance products in the
                cloud. Provides flexible server configurations sized for any
                application, industry leading price to performance, and
                predictable pricing that is the same across regions and usage
                volumes.
              </p>
            </v-col>
          </v-row>
          <v-btn
            v-if="!read_only"
            to="/instance/create"
            width="100%"
            max-width="300"
            height="50"
            depressed
            class="secondary mr-5"
            exact
          >
            Create Instance
          </v-btn>

          <v-btn                  
            v-if="!read_only"
            depressed
            height="50"
            width="150"
            append
            to="/instance/servergroup"
            class="secondary"
            >Server Group</v-btn
          >
        </div>
      </template>
      <template v-slot:item.name="{ item }">
        <div class="d-flex instance-name" style="align-items: center; width:200px;">
          <v-tooltip top color="#333" transition="slide-y-reverse-transition">
            <template v-slot:activator="{ on, attrs }">
              <div v-on="on" v-bind="attrs">
                <!-- If vm is deleting -->
                <beat-loader
                  v-if="item.is_deleting"
                  :isLoading="true"
                  :color="'#eb5757'"
                  :size="'10px'"
                  class="mr-2"
                ></beat-loader>
                <!-- If vm has error message -->
                <v-icon
                  v-else-if="item.error_message"
                  class="mr-3"
                  v-on="on"
                  v-bind="attrs"
                  color="error"
                  >mdi-close-circle</v-icon
                >
                <!-- If vm status is on loading -->
                <Loading v-else-if="(item.state === 'loading')" :loading_model="'style-a'"/>
                <!-- If vm has been built and has state -->
                <v-icon
                  v-else-if="(!item.error_message && item.openstack_vm_uuid) || item.state === 'NOT EXIST'"
                  class="mr-3"
                  v-on="on"
                  v-bind="attrs"
                  :color="getStatusColor(item)"
                  >mdi-circle</v-icon
                >
                <!-- If vm is building -->
                <beat-loader
                  v-else-if="!item.error_message && !item.openstack_vm_uuid"
                  :isLoading="true"
                  :color="'#1f60a8'"
                  :size="'10px'"
                  class="mr-2"
                ></beat-loader>
              </div>
            </template>
            <!-- If vm is deleting -->
            <span v-if="item.is_deleting">Deleting</span>
            <!-- If vm has error message -->
            <span v-else-if="item.error_message">{{ item.error_message }}</span>
            <!-- If vm has been built and has state -->
            <span v-else-if="!item.error_message && item.openstack_vm_uuid">
              {{
                item.state
                  ? capitalizeFirstLetter(item.state.replaceAll("_", " "))
                  : "N/A"
              }}</span
            >
            <!-- If vm is building -->
            <span v-else-if="!item.error_message && !item.openstack_vm_uuid"
              >Building</span
            >
          </v-tooltip>
          <div>
            <span v-if="!item.openstack_vm_uuid || item.is_deleting">{{
              item.instanceName
            }}</span>
            <router-link
              v-else
              :to="{ path: `/project/${projectname}/${item.project_id}/${item.id}/` }"
            >
              <span class="primary--text">{{
                item.instanceName
              }}</span></router-link
            >
            <p v-if="item.image">
              {{ item.image.name }} {{ item.image.file_system }}
              {{ item.image.version_number }}
            </p>
            <p>
              {{ item.package.vcpu }}vCPU / {{ item.package.ram }}GB RAM /
              {{ item.package.root_disk }}GB Root Disk ({{ item.storage_type }})
            </p>
          </div>
        </div>
      </template>
      <template v-slot:item.ipaddress="{ item }">
        <div 
          v-if="item.ins_vpc_port != null"
        >          
          <span class="primary--text"
            @click="
              () => {
                openIpAddressDialog = true;
                activemenuinstance = item;
              }
            "
          >
            See all IP Address
          </span>          
        </div>
        <div
          v-else
        >          
          <span>
            No IP Attached
          </span>          
        </div>
        <!-- <table class="table-ip" style="border-bottom: none"> -->
          <!-- <tr v-if="item.openstack_vm_uuid && item.ipv4">
            <td style="padding-top: 0 !important; padding-bottom: 0 !important">
              Internal
            </td>
            <td style="padding-top: 0 !important; padding-bottom: 0 !important">
              <span class="mx-2">:</span> {{ item.ipv4 }}
            </td>
          </tr> -->
          <!-- <tr v-if="item.openstack_vm_uuid && item.vpc_port">
            <td style="padding-top: 0 !important; padding-bottom: 0 !important">
              Internal
            </td>
            <td style="padding-top: 0 !important; padding-bottom: 0 !important">
              <span class="mx-2">:</span> {{ item.vpc_port }}
            </td>
          </tr>
          <tr v-if="item.openstack_vm_uuid && item.ip_gateway">
            <td style="padding-top: 0 !important; padding-bottom: 0 !important">
              Gateway
            </td>
            <td style="padding-top: 0 !important; padding-bottom: 0 !important">
              <span class="mx-2">:</span> {{ item.ip_gateway }}
            </td>
          </tr>
          <tr v-if="item.openstack_vm_uuid && item.ipext">
            <td style="padding-top: 0 !important; padding-bottom: 0 !important">
              External
            </td>
            <td style="padding-top: 0 !important; padding-bottom: 0 !important">
              <span class="mx-2">:</span> {{ item.ipext }}
            </td>
          </tr>          
        </table> -->
      </template>
      <template v-slot:item.createddate="{ item }">
        {{ $moment(new Date(item.createddate)).format("DD/MM/YYYY") }}
      </template>
      <template v-slot:item.package_storage="{ item }">
        <!-- {{ item.package_storage && item.package_storage.type && item.package_storage.type.name ? item.package_storage.type.name : '-' }} -->
        {{ item }}
      </template>
      <template v-slot:item.billing_type="{ item }">
        {{ getBillingTypeLabel(item.billing_type) }}
      </template>
      <template v-slot:item.region="{ item }">
        {{ item.region.city.toUpperCase() }}
      </template>

      <template v-slot:item.action="{ item }">
        <popupquote
          v-model="popo"
          :offsetTop="20"
          :coordinate="coordinate"
          :documentid="'popup' + item.id"
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
                  rotate: item.id == activemenuinstance.id && popo,
                }"
                :id="'popup' + item.id"
                color="primary"
                >mdi-chevron-down
              </v-icon>
            </label>
          </template>
          <v-list>
            <v-list-item
              v-if="!read_only"
              :disabled="
                disabledField ||
                isFloatingIPLoading ||
                !item.openstack_vm_uuid ||
                item.is_deleting ||
                ![null, ''].includes(item.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(item.state)
              "
              @click="
                () => {
                  openFloatingIPDialog = true;
                  activemenuinstance = item;
                }
              "
              exact
            >
              <v-list-item-title>Add Floating IP</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only && item.is_floating_ip_exist"
              :disabled="
                disabledField ||
                isFloatingIPLoading ||
                ![null, ''].includes(item.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(item.state)
              "
              @click="
                () => {
                  // unassignFloatingIP(item.floating_ip);
                  openUnAssFloatingIPDialog = true;
                  activemenuinstance = item;
                }
              "
              exact
            >
              <v-list-item-title>Unassign Floating IP</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="
                disabledField ||
                !item.openstack_vm_uuid ||
                item.is_deleting ||
                ![null, ''].includes(item.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(item.state)
              "
              @click="
                () => {
                  openAttachInterfaceDialog = true;
                  activemenuinstance = item;
                }
              "
              exact
            >
              <v-list-item-title>Attach Interface</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="
                disabledField ||
                !item.openstack_vm_uuid ||
                item.is_deleting ||
                ![null, ''].includes(item.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(item.state) ||
                item.ins_vpc_port == null
              "
              @click="
                () => {
                  openDetachInterfaceDialog = true;
                  activemenuinstance = item;
                }
              "
              exact
            >
              <v-list-item-title>Detach Interface</v-list-item-title>
            </v-list-item>            
            <v-list-item
              v-if="!read_only"
              :disabled="
                disabledField ||
                !activemenuinstance.openstack_vm_uuid ||
                activemenuinstance.is_deleting ||
                ![null, ''].includes(activemenuinstance.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(activemenuinstance.state) ||
                item.state === 'SHUTOFF'
              "
              @click="
                () => {
                  openConsole(item.project_id, item.openstack_vm_uuid);
                }
              "
            >
              <v-list-item-title>Access Console</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="
                disabledField ||
                !activemenuinstance.openstack_vm_uuid ||
                activemenuinstance.is_deleting ||
                ![null, ''].includes(activemenuinstance.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(activemenuinstance.state)
              "
              :to="'/instance/' + activemenuinstance.id + '/resize'"
              exact
            >
              <v-list-item-title>Resize Instance</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="
                disabledField ||
                !activemenuinstance.openstack_vm_uuid ||
                activemenuinstance.is_deleting ||
                ![null, ''].includes(activemenuinstance.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(activemenuinstance.state)
              "
              @click="openResizeRootDisk = true"
              exact
            >
              <v-list-item-title>Resize Root Disk</v-list-item-title>
            </v-list-item>
            <v-list-item
              :disabled="
                disabledField ||
                !activemenuinstance.openstack_vm_uuid ||
                activemenuinstance.is_deleting ||
                ![null, ''].includes(activemenuinstance.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(activemenuinstance.state)
              "
              :to="'/instance/' + activemenuinstance.id + '/agent'"
            >
              <v-list-item-title>View Usage</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="
              isLoadingReboot
              || getInstanceLoadingTurn(item.id) 
              || !activemenuinstance.openstack_vm_uuid
              || ![null, ''].includes(activemenuinstance.revert_expired)
              || !['ACTIVE'].includes(activemenuinstance.state)
              "
              @click="
              ()=>{
                validateprivilages(['Instance', 'editor']).then(
                    () => {
                      opendialogcycle = true;
                      rebootMode = 'soft'
                    }
                  );
              }"
            >
              <v-list-item-title>Soft Reboot</v-list-item-title>
            </v-list-item>
             <v-list-item
              v-if="!read_only"
              :disabled="
              isLoadingReboot
              || getInstanceLoadingTurn(item.id) 
              || !activemenuinstance.openstack_vm_uuid
              || ![null, ''].includes(activemenuinstance.revert_expired)
              || !['ACTIVE'].includes(activemenuinstance.state)
              "
               @click="
              ()=>{
                validateprivilages(['Instance', 'editor']).then(
                    () => {
                      opendialogcycle = true;
                      rebootMode = 'hard'
                    }
                  );
              }"
             >
              <v-list-item-title>Hard Reboot</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="getInstanceLoadingTurn(item.id) 
              || disabledField 
              || ['RESIZE', 'RESIZING', 'VERIFY_RESIZE'].includes(item.state) 
              || ![null, ''].includes(item.revert_expired) 
              || item.is_expired"
              @click="() => {
                if(isTurnedOn(item)) opendialogturnoff = true
                else startInstance({
                  id: item.id,
                  project_id: item.project_id,
                  openstack_vm_uuid: item.openstack_vm_uuid}
                )

              }"
             >
              <v-list-item-title>Turn {{ isTurnedOn(item) ?'Off' : 'On' }}</v-list-item-title>
            </v-list-item>
            <!-- <v-list-item
              :disabled="
                disabledField
              "
              :to="
                '/instance/' + activemenuinstance.id + '/backups'
              "
            > -->
            <v-list-item
              v-if="!read_only"
              disabled
              :to="'/instance/' + activemenuinstance.id + '/backups'"
            >
              <v-list-item-title>Enable Backup</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="
                disabledField ||
                !activemenuinstance.openstack_vm_uuid ||
                activemenuinstance.is_deleting ||
                ![null, ''].includes(activemenuinstance.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(activemenuinstance.state)
              "
              :to="'/instance/' + activemenuinstance.id + '/snapshots'"                     
            >
              <v-list-item-title>Create Snapshot</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="
                disabledField ||
                item.is_deleting ||
                ![null, ''].includes(item.revert_expired) ||
                !['ACTIVE', 'SHUTOFF'].includes(item.state)
              "
              @click="
                () => {
                  openRenameDialog = true;
                  activemenuinstance = item;
                }
              "
              exact
              style="border-bottom: 1px solid lightgray"
            >
              <v-list-item-title>Rename</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="!read_only"
              :disabled="disabledField || activemenuinstance.is_deleting"
              @click="
                () => {
                  validateprivilages(['Instance', 'editor']).then(() => {
                    opendialogdelete = true;
                  });
                }
              "
            >
              <v-list-item-title class="error--text"
                >Delete Instance
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </popupquote>
      </template>
      <template v-slot:footer="{ props }" v-if="instances.length">
        <custom-footer-datatable
          @input="(val) => (instanceOptions = val)"
          :props="props"
        />
      </template>
    </v-data-table>
    <dialogDeleteInstance
      v-if="activemenuinstance"
      v-model="opendialogdelete"
      :selectedinstance="activemenuinstance"
    />
    <dialogResizeRootDisk
      v-if="openResizeRootDisk"
      v-model="openResizeRootDisk"
      :selectedInstance="activemenuinstance"
      @close="openResizeRootDisk = false"
    />

    <dialogFloatingIP v-if="openFloatingIPDialog" v-model="openFloatingIPDialog" :item="activemenuinstance" />
    <dialogUnAssFloatingIP v-if="openUnAssFloatingIPDialog" v-model="openUnAssFloatingIPDialog" :item="activemenuinstance" />
    <dialogAttachInterface v-if="openAttachInterfaceDialog" v-model="openAttachInterfaceDialog" :item="activemenuinstance" />
    <dialogDetachInterface v-if="openDetachInterfaceDialog" v-model="openDetachInterfaceDialog" :item="activemenuinstance" />
    <dialogIpAddress v-if="openIpAddressDialog" v-model="openIpAddressDialog" :item="activemenuinstance" />
    <dialogRecycle v-model="opendialogcycle" @close="rebootInstance"/>
    <dialogRename v-if="openRenameDialog" v-model="openRenameDialog" :item="activemenuinstance" />
    <dialogTurnOff v-model="opendialogturnoff" @close="turnOff"/>
  </div>
</template>

<script>
import dialogFloatingIP from "@/modules/instance/dialogFloatingIP";
import dialogUnAssFloatingIP from "@/modules/instance/dialogUnAssFloatingIP";
import dialogAttachInterface from "@/modules/instance/dialogAttachInterface";
import dialogDetachInterface from "@/modules/instance/dialogDetachInterface";
import dialogIpAddress from "@/modules/instance/dialogIpAddress";
import dialogDeleteInstance from "@/modules/instance/dialogDeleteInstance";
import dialogResizeRootDisk from "@/modules/instance/dialogResizeRootDisk";
import dialogRecycle from "@/modules/instance/instance_detail/dialogRecycle";
import dialogRename from "@/modules/instance/dialogRename";
import Loading from "@/components/Loading";
import { reactive, ref, watch, onMounted } from "@vue/composition-api";
import { INSTANCE } from "@/modules/instance/namespace";
import { mapGetters } from "vuex";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import popupquote from "@/modules/customsharedcomponents/popupquote.vue";

import { AccessControl } from "@/lib/middleware";
import dialogTurnOff from '@/modules/instance/instance_detail/dialogTurnOff'

const isDevModeFloatingIP = true;

export default {
  components: {
    popupquote,
    dialogDeleteInstance,
    dialogResizeRootDisk,
    dialogFloatingIP,
    dialogUnAssFloatingIP,
    dialogAttachInterface,
    dialogDetachInterface,
    dialogIpAddress,
    dialogRecycle,
    dialogRename,
    Loading,
    dialogTurnOff,
  },
  computed: {
    ...mapGetters({
      projectname: "PROJECT/getprojectname",
      isLoading: "INSTANCE/getIsLoading",
      isLoadingReboot: "INSTANCE/getIsLoadingReboot",
      isFloatingIPLoading: "NETWORKFLOATINGIP/getIsFloatingIPLoading",
      privilagesGroup: "HOMEPAGE/privilagesGroup",
      getInstanceLoadingTurn: "INSTANCE/getInstanceLoadingTurn",
    }),
  },
  setup(props, context) {
    props;
    const {
      fetchPaginatedInstances,
      openconsole,
      deleteinstance: Deleteinstance,
      restartInstance,
      startInstance,
      stopInstance,
    } = useNamespacedActions(INSTANCE, [
      "fetchPaginatedInstances",
      "deleteinstance",
      "openconsole",
      "restartInstance",
      "startInstance",
      "stopInstance",
    ]);

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Instance'));
    const openResizeRootDisk = ref(false);
    const { instances, instancePaginator } = useNamespacedState(INSTANCE, [
      "instances",
      "instancePaginator",
    ]);

    const selected = ref("list");

    function isSelected(val) {
      return selected.value == val;
    }

    const showMenu = ref(false);
    const coordinate = reactive({ x: 0, y: 0 });
    const activemenuinstance = ref({});

    function deleteinstance() {
      Deleteinstance(activemenuinstance.value.id);
    }

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

    const showMenu1 = ref(false);

    const disabledField = ref(false);
    const opendialogcycle = ref(false);
    const rebootMode = ref('');
    
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);

    validateprivilagesyncnew(["Instance", "editor"]).then((res) => {
      disabledField.value = res;
    });

    const { addfloatingip, UNASSIGN_FLOATING_IP } = useNamespacedActions(
      "NETWORKFLOATINGIP",
      ["addfloatingip", "UNASSIGN_FLOATING_IP"]
    );

    const rebootInstance = async(val)=>{
      opendialogcycle.value = false
      if(val){
        restartInstance({
            project_id:activemenuinstance.value.project_id,
            openstack_vm_uuid:activemenuinstance.value.openstack_vm_uuid,
            mode:rebootMode.value
          })
      }
    }

    const assignFloatingIP = async (id) => {
      let response = await addfloatingip(id);
      if (response.status === 200) await fetchPaginatedInstances();
    };
    const unassignFloatingIP = async (id) => {
      let response = await UNASSIGN_FLOATING_IP(id);
      if (response.status === 200) await fetchPaginatedInstances();
    };

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

    const isTurnedOn = (instance) => {
      if (
        ["RESIZE", "RESIZING", "VERIFY_RESIZE"].includes(instance.state) ||
        !["", null].includes(instance.revert_expired)
      )
        return true;
      else if (instance.state == "ACTIVE") return true;
      else return false
    };

    // ======== FOR INSTANCE PAGINATION ========
    const instanceSearch = ref("");
    const instanceOptions = ref({});
    watch(instanceOptions, async (val) => {
      let params = {
        limit: val.itemsPerPage,
        page: val.page,
        order_column: val.sortBy[0],
        order_by: val.sortDesc[0] ? "desc" : "asc",
      };
      await fetchPaginatedInstances(params);
    });
    let search = null;
    watch(instanceSearch, (val) => {
      if (search) {
        clearTimeout(search);
        search = setTimeout(function () {
          instanceOptions.value = { ...instanceOptions.value, search: val };
        }, 500);
      } else {
        search = setTimeout(function () {}, 500);
      }
    });

    const itemsPerPage = 10;
    // ======== END OF INSTANCE PAGINATION ========
    const getBillingTypeLabel = (type) => {
      if (type == "PPU") return "Pay Per Use";
      else return type;
    };

    const opendialogturnoff = ref(false)

    const turnOff = (val) => {
      opendialogturnoff.value = false
      if (val && activemenuinstance) {
        stopInstance({
          id: activemenuinstance.value.id,
          project_id: activemenuinstance.value.project_id,
          openstack_vm_uuid: activemenuinstance.value.openstack_vm_uuid
        })
      } else isTurnedOn.value = !isTurnedOn.value
    }

    return {
      read_only,
      
      getBillingTypeLabel,
      disabledField,
      itemsPerPage,
      instanceSearch,
      instanceOptions,
      instancePaginator,
      getStatusColor,
      unassignFloatingIP,
      assignFloatingIP,
      validateprivilages,
      validateprivilagesync,
      opendialogdelete: ref(false),
      coordinate,
      showMenu1,
      fetchPaginatedInstances,
      instances,
      selected,
      isSelected,
      deleteinstance,
      showMenu,
      show,
      activemenuinstance,
      openResizeRootDisk,
      restartInstance,
      rebootInstance,
      rebootMode,
      opendialogcycle,
      opendialogturnoff,
      isTurnedOn,
      turnOff,
      startInstance,
      stopInstance,
      capitalizeFirstLetter: (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      },
      async openConsole(project_id, openstack_vm_uuid) {
        let params = {
          project_id: project_id,
          openstack_vm_uuid: openstack_vm_uuid,
        };
        await openconsole(params);
      },
    };
  },
  data() {
    return {
      isDevModeFloatingIP,
      openFloatingIPDialog: false,
      openUnAssFloatingIPDialog: false,
      openRenameDialog: false,
      openAttachInterfaceDialog: false,
      openDetachInterfaceDialog: false,
      openIpAddressDialog: false,
      popo: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Billing Type", value: "billing_type" },
        { text: "IP Address", value: "ipaddress" },
        // { text: "Floating IP", value: "ipext" },
        { text: "Region", value: "region" },
        { text: "Created date", value: "createddate" },
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

.v-data-table {
  ::v-deep table {
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
</style>
