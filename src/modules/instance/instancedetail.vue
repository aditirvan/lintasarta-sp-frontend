<template>
  <v-container fluid class="pa-0" v-if="instanceDetail">
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-0">
          <v-card-title class="pb-0" style="padding-left:30px;padding-right:30px;padding-top:30px">
            <v-row class="d-flex flex-row">
              <v-col class="flex-grow-0 pa-0">
                <v-tooltip top color="#333" transition="slide-y-reverse-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-on="on" v-bind="attrs">
                      <v-icon style="font-size:50px;" v-if="['SHUTOFF', 'ERROR'].includes(instanceStatus) && ![null, ''].includes(instanceDetail.revert_expired)" class="mr-3" v-on="on" v-bind="attrs" color="error">mdi-close-circle</v-icon>
                      <v-icon style="font-size:50px;" v-if="['RESIZE', 'VERIFY_RESIZE', 'RESIZING'].includes(instanceStatus) || ![null, ''].includes(instanceDetail.revert_expired)" class="mr-3" v-on="on" v-bind="attrs" color="orange">mdi-circle</v-icon>
                      <v-icon style="font-size:50px;" v-if="['ACTIVE'].includes(instanceStatus) && [null, ''].includes(instanceDetail.revert_expired)" class="mr-3" v-on="on" v-bind="attrs" color="primary">mdi-circle</v-icon>
                    </div>
                  </template>
                  <span v-if="['RESIZE', 'RESIZING', 'VERIFY_RESIZE'].includes(instanceStatus) || ![null, ''].includes(instanceDetail.revert_expired)">Resizing</span>
                  <span v-else-if="['ACTIVE'].includes(instanceStatus)">Active</span>
                  <span v-else-if="['SHUTOFF'].includes(instanceStatus)">Shutoff</span>
                  <span v-else-if="['ERROR'].includes(instanceStatus)">Error</span>
                  <span v-else>N/A</span>
                </v-tooltip>
              </v-col>
              <v-col class="py-0 flex-grow-1">
                <div v-if="instanceDetail" class="headline font-weight-bold font--text text-uppercase">
                  {{ instanceDetail.name }}
                </div>
                <p v-if="instanceDetail" class="my-0" style="font-size: 12px">
                  in {{ instanceDetail.project.name }} / 
                  {{ instanceDetail.package_instance ? instanceDetail.package_instance.v_cpu : '-'  }} vCPU / 
                  {{ instanceDetail.package_instance ? `${instanceDetail.package_instance.ram} GB` : '-' }} RAM / 
                  {{ instanceDetail.root_disk_package ? `${instanceDetail.root_disk_package.volume_size}GB` : 
                      instanceDetail.package_instance ? `${instanceDetail.package_instance.root_disk}GB` : '-'  }} Root Disk
                </p>
              </v-col>
              <v-col class="d-flex flex-grow-0 flex-row justify-end pt-0">
                <p class="align-self-center mb-0 font-weight-bold" style="white-space:nowrap">
                  {{ isTurnedOn ? 'ON' : 'OFF' }}
                </p>
                <div style="display: inline-block; width: 20px; height: auto"/>
                <v-switch v-if="instanceStatus"
                  :disabled="getInstanceLoadingTurn(instanceDetail.id) || disabledField || ['RESIZE', 'RESIZING', 'VERIFY_RESIZE'].includes(instanceStatus) || ![null, ''].includes(instanceDetail.revert_expired) || instanceDetail.is_expired || read_only"
                  @click="() => {
                    if(isTurnedOn == false) opendialogturnoff = true
                    else startInstance({
                      id: instanceDetail.id,
                      project_id: instanceDetail.project_id,
                      openstack_vm_uuid: instanceDetail.openstack_vm_uuid}
                    )

                  }"
                  v-model="isTurnedOn" inset>
                </v-switch>
                <div v-else>
                  <v-progress-circular
                      indeterminate
                      color="primary"
                  ></v-progress-circular>
                </div>
                <div style="display: inline-block; width: 20px; height: auto"/>
                <v-btn
                  v-if="!read_only"
                  :disabled="isLoadingConsole || disabledField || !isTurnedOn || !['ACTIVE', 'SHUTOFF'].includes(instanceStatus) || ![null, ''].includes(instanceDetail.revert_expired)"
                  depressed
                  height="50"
                  width="150"
                  class="secondary align-self-center"
                  @click="openConsole({ project_id: instanceDetail.project_id, openstack_vm_uuid: instanceDetail.openstack_vm_uuid })"
                >
                  <beat-loader v-if="isLoadingConsole" :loading="isLoadingConsole" :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
                  <span v-else style="font-size: 14px">Open Console</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider/>
          <v-card-text class="py-0">
            <v-row>
              <v-col cols="3">
                <p class="mb-0" style="font-size: 12px">
                  <span style="font-weight: 700">Region:</span> {{ instanceDetail ? instanceDetail.region : '-' }}
                </p>
              </v-col>
              <v-col cols="3">
                <p class="mb-0" style="font-size: 12px">
                  <span style="font-weight: 700">Zone:</span> {{ instanceDetail && instanceDetail.zone ? instanceDetail.zone : '-' }}
                </p>
              </v-col>
              <v-col cols="4" v-if="role === 'Superadmin'">
                <p class="mb-0" style="font-size: 12px">
                  <span style="font-weight: 700">Host:</span> {{ instanceDetail && instanceDetail.hostname ? instanceDetail.hostname : '-' }}
                </p>
              </v-col>
              <!-- <v-col>
                <p class="mb-0" style="font-size: 12px">
                  <span style="font-weight: 700">IP Internal:</span> {{ instanceDetail ? instanceDetail.ip_address_internal : '-' }}
                </p>
              </v-col>
              <v-col>
                <p class="mb-0 " style="font-size: 12px">
                  <span style="font-weight: 700">IP Gateway:</span> {{ instanceDetail && instanceDetail.vpc ? instanceDetail.vpc.ip_gateway : null }}
                </p>
              </v-col> -->
              <!-- <v-col>
                <p class="mb-0 " style="font-size: 12px">
                  <span style="font-weight: 700"> Floating IP: </span>
                  <span v-if="instanceDetail && instanceDetail.floating_ip">
                    {{ instanceDetail && instanceDetail.floating_ip ? instanceDetail.floating_ip.ip_address : null }}
                  </span>
                  <span
                    v-else
                    tag="button"
                    @click="
                      if(read_only_network){
                        openDialogDontHavePermition()
                        return
                      }
                      openFloatingIPDialog = true
                    "
                    :disabled="!['ACTIVE', 'SHUTOFF'].includes(instanceStatus) || ![null, ''].includes(instanceDetail.revert_expired)"
                    class="primary--text fz-16 linkpointer"
                    :style="[read_only_network ? {'color': '#a9a9a9 !important'} : {}]"
                    style="cursor: pointer; font-size: 12px;"
                  >Enable Now</span> -->
                    <!-- :class="{ 'linkpointer': ['ACTIVE', 'SHUTOFF'].includes(instanceStatus) || ![null, ''].includes(instanceDetail.revert_expired) }" -->
                <!-- </p>
              </v-col> -->
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4" md="2">
        <v-card flat class="rounded-lg pa-3">
          <!-- <v-card-text>
            <router-link replace to="usage" class="flex-row d-flex"
            ><p class="mb-0">Usage </p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text> -->
          <v-card-text>
          <router-link replace to="agent" class="flex-row d-flex"
            ><p class="mb-0">Deka Agent </p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>
          <v-card-text v-if="!read_only">
            <router-link replace to="power" class="flex-row d-flex"
            ><p class="mb-0">Power</p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>
          <v-card-text >
            <router-link replace to="storage" class="flex-row d-flex"
            ><p class="mb-0">Storage</p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>
          <v-card-text>
            <router-link replace to="resize" class="flex-row d-flex"
            ><p class="mb-0">Resize</p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>
          <v-card-text>
            <router-link replace to="networking" class="flex-row d-flex"
            ><p class="mb-0">Networking</p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>
        <!-- <v-card-text>
          <router-link replace to="backups" class="flex-row d-flex"
          ><p class="mb-0">Backups</p>
            <v-spacer/>
            <v-icon>mdi-chevron-right</v-icon>
          </router-link
          >
        </v-card-text> -->
          <v-card-text>
            <router-link replace to="snapshots" class="flex-row d-flex"
            ><p class="mb-0">Snapshot</p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>
          <v-card-text v-if="!read_only">
            <router-link replace to="delete" class="flex-row d-flex"
            ><p class="mb-0">Delete</p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>
          <!--<v-card-text>
            <router-link replace to="tags" class="flex-row d-flex"
            ><p class="mb-0">Tags</p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>
          <v-card-text>
            <router-link replace to="recovery" class="flex-row d-flex"
            ><p class="mb-0">Recovery</p>
              <v-spacer/>
              <v-icon>mdi-chevron-right</v-icon>
            </router-link
            >
          </v-card-text>-->
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="10" class="pt-0">
        <router-view v-if="instanceDetail" :instanceid="instanceDetail.id" :instance="instanceDetail"></router-view>
      </v-col>
    </v-row>
    <dialogTurnOff v-model="opendialogturnoff" @close="turnOff"/>
    <dialogFloatingIP v-if="openFloatingIPDialog" v-model="openFloatingIPDialog" :item="instanceDetail" :id-instance="idInstance" />
  </v-container>
</template>
<script>
import { useRoute } from 'vue-router'
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { onMounted, watch, ref } from "@vue/composition-api";
import { INSTANCE } from "@/modules/instance/namespace";
import { mapGetters } from "vuex";
import dialogTurnOff from './instance_detail/dialogTurnOff'
import dialogFloatingIP from "@/modules/instance/dialogFloatingIP";
import localstorage from "@/lib/localstorage";

import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    dialogTurnOff,
    dialogFloatingIP,
  },
  computed: {
    ...mapGetters({
      isLoadingConsole: "INSTANCE/getIsLoadingConsole",
      getInstanceLoadingTurn: "INSTANCE/getInstanceLoadingTurn",
    }),
  },
  setup(props, context) {
    const {
      openconsole: openConsole,
      startInstance,
      stopInstance,
      fetchInstanceDetail,
      fetchInstanceStatus,
    } = useNamespacedActions(INSTANCE, ["openconsole", "fetchInstanceDetail", "startInstance", "stopInstance", "fetchInstanceStatus"]);
    const {
      instanceDetail,
      instanceStatus,
    } = useNamespacedState(INSTANCE, ["instanceDetail", "instanceStatus"]);

    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Instance'));
    const networkPrivilegeName = access_control.is_admin() ? 'Project Network' : 'Network'
    const read_only_network = ref(access_control.is_read_mode_multi_role(networkPrivilegeName));

    const isFirstTime = ref(true)
    const isTurnedOn = ref(false)
    const instanceId = ref(undefined)
    const opendialogturnoff = ref(false)
    const isVerifyingResize = ref(false)

    const turnOff = (val) => {
      opendialogturnoff.value = false
      if (val) {
        stopInstance({
          id: instanceDetail.value.id,
          project_id: instanceDetail.value.project_id,
          openstack_vm_uuid: instanceDetail.value.openstack_vm_uuid
        })
      } else isTurnedOn.value = !isTurnedOn.value
    }

    const role = localstorage.getItem("role");

    const disabledField = ref(false);
    const {
      validateprivilagesyncnew,
      openDialogDontHavePermition
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilagesyncnew",
      "openDialogDontHavePermition"
    ]);

    validateprivilagesyncnew(["Instance", "editor"]).then((res) => {
      disabledField.value = res;
    });

    const idInstance = ref(context.root._route.params.instanceid)

    onMounted(async () => {
      await fetchInstanceDetail(context.root._route.params.instanceid)
    })

    watch(instanceDetail, async val => {
      if (val.state === 'SHUTOFF'){
        isTurnedOn.value = false
        isFirstTime.value = false
      }
      if (val.state === 'VERIFY_RESIZE' || val.state === 'RESIZE') {
        isTurnedOn.value = true
      }
      if (val.state === 'ACTIVE') isTurnedOn.value = true
    })

    // watch(isTurnedOn, async val => {
    //   if(isFirstTime.value) return isFirstTime.value = false
    //   if (val) {
    //     await startInstance({
    //       project_id: instanceDetail.value.project_id,
    //       openstack_vm_uuid: instanceDetail.value.openstack_vm_uuid
    //     })
    //   } else {
    //     opendialogturnoff.value = true
    //   }
    // })

    return {
      read_only,
      read_only_network,
      openDialogDontHavePermition,

      disabledField,
      validateprivilagesyncnew,
      fetchInstanceDetail,
      openConsole,
      startInstance,
      stopInstance,
      fetchInstanceStatus,
      instanceStatus,
      instanceDetail,
      isFirstTime,
      isTurnedOn,
      instanceId,
      opendialogturnoff,
      turnOff,
      idInstance,
      role,
    }
  },
  data() {
    return {
      openFloatingIPDialog: false,
    }
  }
};
</script>
<style>
 .row {
   margin-top: 0 !important;
   margin-bottom: 0 !important;
 }
</style>
<style lang="scss" scoped>
.router-link-active {
  p,
  .v-icon {
    color: var(--v-primary);
    font-weight: 700;
  }
}

.v-card__text {
  padding-top: 15px;
  padding-bottom: 15px;
  font-weight: 400;
}

.linkpointer {
  font-weight: 600;
}

.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }

  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}
</style>