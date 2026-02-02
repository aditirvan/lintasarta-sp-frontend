<template>
  <v-container fluid>
    <v-row>
      <v-col class="pa-0">
        <v-card flat class="rounded-lg pa-3">
          <v-card-title>
            <div class="headline font-weight-bold font--text">Turn off Instance</div>
          </v-card-title>
          <v-card-text class="pb-0">
            <p>
              When you turn off a VM from the control panel, we first try a
              graceful shutdown. If that fails, we do a forced shutdown, which
              may corrupt data. To ensure data integrity, we recommend shutting
              down from the command line with poweroff.
            </p>
            <p><b> When a VM is off:</b></p>
            <p>
              Its data and IP address are retained and its disk, CPU and RAM are
              reserved. You continue to accrue its data transfer allowance.
            </p>
            <p>
              <span class="error--text"><b>Warning:</b></span> You will still be
              billed for a turned off VM. To end billing, destroy the Instance
              instead.
            </p>
          </v-card-text>
          <v-card-text>
            <v-btn
                :disabled="!['ACTIVE', 'REBOOT'].includes(instanceDetail.state) || ![null, ''].includes(instanceDetail.revert_expired) || isLoadingTurn || instanceDetail.is_expired"
                depressed
                
                  @click="
                    () => {
                      validateprivilages([
                        'Storage',
                        'editor',
                      ]).then(() => {
                        opendialogturnoff = true 
                      });
                    }
                  "
                class="secondary" height="45" width="150">
              <span style="font-size: 12px;">
                <beat-loader v-if="isLoadingTurn" :loading="isLoadingTurn" :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
                <span v-else>Turn Off</span>
              </span>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="px-0 py-5">
        <v-card flat class="rounded-lg pa-3">
          <v-card-title>
            <div class="headline font-weight-bold font--text">Reboot</div>
          </v-card-title>
          <v-card-text class="pb-0">
            <p>
              A power cycle will immediately hard reset the server. You should only choose this option when you are
              unable to reboot the Instance from the command line.
            </p>
            <p>
              <b>Do you wish to proceed?</b><br/>

            </p>

          </v-card-text>
          <v-card-text>
            <v-btn
                :disabled="
                isLoadingReboot 
                || !['ACTIVE', 'REBOOT'].includes(instanceDetail.state)
                || ![null, ''].includes(instanceDetail.revert_expired)
                || instanceDetail.is_expired
                "
                depressed
                style="letter-spacing: 0.07em"
                class="secondary"
                height="50"
                width="145"
                @click="() => { 
                  validateprivilages([
                    'Instance',
                    'editor',
                  ]).then(() => {
                    opendialogcycle = true
                    rebootmode = 'soft'
                  });  
                }"
            >
              <beat-loader v-if="isLoadingReboot && rebootmode == 'soft'" :loading="isLoadingReboot" :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
              <span style="font-size: 12px;" v-else>Soft Reboot</span>
            </v-btn>
             <div style="display: inline-block; width: 20px; height: auto"/>
            <v-btn
                :disabled="
                isLoadingReboot 
                || !['ACTIVE', 'REBOOT'].includes(instanceDetail.state)
                || ![null, ''].includes(instanceDetail.revert_expired)
                || instanceDetail.is_expired
                "
                depressed
                style="letter-spacing: 0.07em"
                class="secondary"
                height="50"
                width="145"
                @click="() => { 
                  validateprivilages([
                    'Instance',
                    'editor',
                  ]).then(() => {
                    opendialogcycle = true
                    rebootmode = 'hard'
                  });  
                }"
            >
              <beat-loader v-if="isLoadingReboot && rebootmode == 'hard'" :loading="isLoadingReboot" :color="'white'" :size="'10px'" class="mr-2"></beat-loader>
              <span style="font-size: 12px;" v-else>Hard Reboot</span>
            </v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <dialogTurnOff v-model="opendialogturnoff" @close="turnOff"/>
    <dialogRecycle v-model="opendialogcycle" @close="Reboot"/>
  </v-container>
</template>
<script>
import {useNamespacedActions} from "vuex-composition-helpers"


import dialogTurnOff from './dialogTurnOff'
import dialogRecycle from './dialogRecycle'
import {INSTANCE} from "@/modules/instance/namespace";
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters({
      instanceDetail: "INSTANCE/getInstanceDetail",
      isLoadingTurn: "INSTANCE/getIsLoadingTurn",
      isLoadingReboot: "INSTANCE/getIsLoadingReboot",
    }),
  },
  
  setup(props, context) {
    const {
      stopInstance,
      restartInstance
    } = useNamespacedActions(INSTANCE, ["stopInstance", "restartInstance"]);
    const {
      validateprivilages,
      validateprivilagesync,
      
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
    ]);

    
    return {
      validateprivilages,
      validateprivilagesync,
      stopInstance,
      restartInstance
    }
  },
  data() {
    return {
      opendialogturnoff: false,
      opendialogcycle: false,
      rebootmode:null,
    }
  },
  components: {
    dialogTurnOff, dialogRecycle
  },
  methods: {
    turnOff(val) {
      this.opendialogturnoff = false
      if (val) {
        this.stopInstance({
          project_id: this.instanceDetail.project_id,
          openstack_vm_uuid: this.instanceDetail.openstack_vm_uuid
        })
      }
    },
    Reboot(val) {
      this.opendialogcycle = false
      if (val) {
         this.restartInstance({
            project_id: this.instanceDetail.project_id,
            openstack_vm_uuid: this.instanceDetail.openstack_vm_uuid,
            mode:this.rebootmode
          })
      }
    }
    
  }
  
}
</script>
<style scoped>
.headline {
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
}
</style>