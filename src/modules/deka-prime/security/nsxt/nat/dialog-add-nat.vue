<template>
  <v-dialog persistent v-model="dialog" max-width="550">
    <v-card class="overflow-x-hidden" id="container">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>{{ title }} NAT Rule</h2>
          </v-card-text>
        </v-col>
        <v-col class="pt-0">
          <v-card-text>
            <div class="d-flex justify-end mb-4">
              <span class="cursor-pointer" @click="dialog = false"><v-icon color="red">mdi-close-circle</v-icon></span>
            </div>
          </v-card-text>
        </v-col>
      </v-row>

      <v-card-text>
        <p class="font-weight-bold">Name</p>
        <v-text-field
        v-model="name"
        placeholder="Input Name"
        flat
        outlined
        :error-messages="$v.name.$errors.length ? $v.name.$errors[0].$message : ''"
        ></v-text-field>
      </v-card-text>

      <v-card-text>
        <p class="font-weight-bold">Description</p>
        <v-textarea
        v-model="description"
        placeholder="Input Description"
        flat
        outlined
        ></v-textarea>
      </v-card-text>

      <v-card-text>
        <p class="font-weight-bold">Interface Type</p>
        <v-select
        :items="interfaceTypes"
        v-model="type"
        placeholder="Choose a Interface"
        append-icon="mdi-chevron-down"
        outlined
        single-line
        :error-messages="$v.type.$errors.length ? $v.type.$errors[0].$message : ''"
        >
        </v-select>
      </v-card-text>

      <v-card-text>
        <p class="font-weight-bold">External IP</p>
        <v-text-field
        v-model="externalIp"
        placeholder="Input External IP"
        flat
        outlined
        :error-messages="$v.externalIp.$errors.length ? $v.externalIp.$errors[0].$message : ''"
        ></v-text-field>
      </v-card-text>
      
      <v-card-text v-if="type == 'DNAT'">
        <p class="font-weight-bold">External Port</p>
        <v-text-field
        v-model="externalPort"
        placeholder="Input External Port"
        flat
        outlined
        ></v-text-field>
      </v-card-text>

      <v-card-text>
        <p class="font-weight-bold">Internal IP</p>
        <v-text-field
        v-model="internalIp"
        placeholder="Input Internal IP"
        flat
        outlined
        :error-messages="$v.internalIp.$errors.length ? $v.internalIp.$errors[0].$message : ''"
        ></v-text-field>
      </v-card-text>
     
      <v-card-text v-if="type == 'SNAT'">
        <p class="font-weight-bold">Destination IP</p>
        <v-text-field
        v-model="destinationIp"
        placeholder="Input Detination IP"
        flat
        outlined
        ></v-text-field>
      </v-card-text>

      <v-card-text v-if="type == 'DNAT'">
        <v-card class="" elevation="0"
        >
        <v-col
        class="px-0"
          md="12"><v-row>
            <v-col class="pt-0 pb-0 pr-0 d-flex justify-space-between">
              <p class="mb-0 font-weight-bold"><b>Applications</b></p>
              <v-btn
              style="margin-top:-8px"
              icon
              color="primary"
              @click="
                () => {
                  openDialogApplications = true;
                }
              "
              ><v-icon class="">mdi-plus</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-card
        class="bs scroll"
        elevation="1">
          <!-- <div v-if="!dataSelectedApp || !dataSelectedApp.length" class="d-flex align-center" style="height: 100%">-</div> -->
          <div>
            <v-list dense  class="pb-0">
              <v-list-item-group>
                <v-list-item v-for="(item, i) in dataSelectedApp" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.name" class="fz-14-i"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon small color="red" @click="deleteApp(i)">mdi-close</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-card>
      </v-card>
      <DialogApplications
      v-if="openDialogApplications"
      v-model="openDialogApplications"
      :isSinggle="true"
      :dataSelected="dataSelectedApp"
      @sendSelected="dataSelectedApp = $event"
      />
      </v-card-text>

      <v-card-text>
        <span class="fz-18 font-weight-bold">
          <v-icon
          class="fz-28"
          color="grey"
          >
          mdi-cog</v-icon>
          Advanced Settings
        </span>
      </v-card-text>
      <v-card-text>
        <p class="font-weight-bold mb-0">State</p>
        <v-radio-group v-model="state" hide-details class="mr-2 mt-0" row>
          <v-row>
            <v-col md="3">
              <v-radio label="Enabled" :value="true">
                <template v-slot:label>
                  <span class="fs-14">Enabled</span>
                </template>
              </v-radio>
            </v-col>

            <v-col md="3">
              <v-radio label="Disabled" :value="false">
                <template v-slot:label>
                  <span class="fs-14">Disabled</span>
                </template>
              </v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-card-text>

      <v-card-text>
        <p class="font-weight-bold mb-0">Logging</p>
        <v-radio-group v-model="logging" hide-details class="mr-2 mt-0" row>
          <v-row>
            <v-col md="3">
              <v-radio label="Enabled" :value="true">
                <template v-slot:label>
                  <span class="fs-14">Enabled</span>
                </template>
              </v-radio>
            </v-col>

            <v-col md="3">
              <v-radio label="Disabled" :value="false">
                <template v-slot:label>
                  <span class="fs-14">Disabled</span>
                </template>
              </v-radio>
            </v-col>
          </v-row>
        </v-radio-group>
      </v-card-text>


      <v-card-text>
        <p class="font-weight-bold">Priority</p>
        <v-text-field
        v-model="priority"
        placeholder="Input Priority"
        flat
        outlined
        :error-messages="$v.priority.$errors.length ? $v.priority.$errors[0].$message : ''"
        ></v-text-field>
      </v-card-text>

      <v-card-text>
        <p class="font-weight-bold">Firewall Match</p>
        <v-select
        v-model="firewallMatch"
        :items="firewallMatches"
        placeholder="Choose a Firewall Match"
        append-icon="mdi-chevron-down"
        outlined
        single-line
        :error-messages="$v.firewallMatch.$errors.length ? $v.firewallMatch.$errors[0].$message : ''"
        >
        </v-select>
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn"
            depressed
            height="45"
            block
            class="accent"
            @click="
              () => {
                dialog = false
              }
            "
            >Cancel</v-btn>
          </v-col>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn"
            :loading="isLoadingBtn"
            id="Add"
            depressed
            height="45"
            block
            class="secondary"
            @click="save"
            > {{ title == 'Add' ? 'Create' : 'Save' }} </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { onMounted, ref } from '@vue/composition-api';
import useVuelidate from '@vuelidate/core';
import { required, minValue, requiredIf, } from '@vuelidate/validators'
import DialogApplications from '../firewall/dialog-applications.vue'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { DPSECURITY } from '../../namespace';

export default {
  components: {
    DialogApplications
  },
  props: ["value", "title", "rowSelected"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { createRuleNatNsxt, updateRuleNatNsxt } = useNamespacedActions(DPSECURITY, ["createRuleNatNsxt", "updateRuleNatNsxt"])
    const { isLoadingBtn } = useNamespacedGetters(DPSECURITY, [
      "isLoadingBtn"
    ]);
    const interfaceTypes = ref([
      { text: 'DNAT', value: 'DNAT'},
      { text: 'SNAT', value: 'SNAT'},
    ])
    const firewallMatches = ref([
      { text: 'Match Internal Address', value: 'MATCH_INTERNAL_ADDRESS' },
      { text: 'Match External Address', value: 'MATCH_EXTERNAL_ADDRESS' },
      { text: 'Bypass', value: 'BYPASS' },
    ])
    const name = ref('')
    const description = ref('')
    const type = ref('DNAT')
    const externalIp = ref('')
    const externalPort = ref('')
    const internalIp = ref('')
    const destinationIp = ref('')
    const state = ref(true)
    const logging = ref(false)
    const priority = ref(0)
    const firewallMatch = ref('MATCH_INTERNAL_ADDRESS')
    const openDialogApplications = ref(false)
    const dataSelectedApp = ref([])

    const $v = useVuelidate(
      {
        name: { required },
        type: { required },
        externalIp: { 
          required,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                val
              );
            },
          }
        },
        // externalPort: { required: requiredIf(() => type.value == 'DNAT') },
        internalIp: {
          required,
          regex: {
            $message: "Invalid ip value",
            $validator: (val) => {
              return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(
                val
              );
            },
          } 
        },
        // destinationIp: { required: requiredIf(() => type.value == 'SNAT')},
        priority: { required, minValue: minValue(0) },
        firewallMatch: { required },
      },
      {
        name,
        type,
        externalIp,
        // externalPort,
        internalIp,
        // destinationIp,
        priority,
        firewallMatch,
      })

      const deleteApp = (index) => {
        dataSelectedApp.value.splice(index, 1);
      };

      const save = async() => {
        $v.value.$touch()
        if ($v.value.$errors.length) {
          let container = document.getElementById("container");
          container.scrollIntoView({behavior: "smooth"})
          return;
        }
        const id = context.root.$route.params.idEdge;
        let payload = {
          name: name.value,
          description: description.value,
          enabled: state.value,
          type: type.value,
          externalAddresses: externalIp.value,
          internalAddresses: internalIp.value,
          logging: logging.value,
          priority: priority.value,
          firewallMatch: firewallMatch.value,
        }
        if(type.value == 'DNAT'){
          if(externalPort.value){
            payload.dnatExternalPort = externalPort.value
          }else{
            payload.dnatExternalPort = null
          }
          if(dataSelectedApp.value.length){
            payload.applicationPortProfile = dataSelectedApp.value[0]
          }else{
            payload.applicationPortProfile = null
          }
        }
        type.value == 'SNAT' ? payload.snatDestinationAddresses = destinationIp.value : ''

        // console.log(payload)
        if(props.title == 'Add'){
          await createRuleNatNsxt({id: id, params: payload })
        }else if(props.title == 'Edit'){
          payload.id = props.rowSelected.id
          console.log(payload)
          await updateRuleNatNsxt({edgeId: id, ruleId: payload.id, params: payload})
        }
        dialog.value = false
      }

      onMounted(() => {
        console.log('props.title ', props.title)
        if(props.title == 'Edit'){
          console.log(props.rowSelected)
          let row = props.rowSelected
          name.value = row.name
          description.value = row.description
          state.value = row.enabled
          type.value = row.type
          externalIp.value = row.externalAddresses
          internalIp.value = row.internalAddresses
          logging.value = row.logging
          priority.value = row.priority
          firewallMatch.value = row.firewallMatch
          row.type == 'SNAT' ? destinationIp.value = row.snatDestinationAddresses : ''
          if(row.type == 'DNAT'){
            externalPort.value = row.dnatExternalPort
            if (row.applicationPortProfile) {
              dataSelectedApp.value[0] = row.applicationPortProfile
            }
          }
        }
      })
    return{
      dialog,
      interfaceTypes,
      name,
      description,
      type,
      externalIp,
      externalPort,
      internalIp,
      destinationIp,
      state,
      logging,
      priority,
      firewallMatch,
      firewallMatches,
      openDialogApplications,
      dataSelectedApp,
      deleteApp,
      $v,
      save,
      isLoadingBtn
    }
  },
}
</script>

<style lang="scss" scoped>
.bs {
  box-shadow: none !important;
  border: 1px solid rgb(2 0 0 / 12%);
}
.scroll {
  height: 58px;
  overflow-y: auto;
  box-shadow: none !important;
  overflow-x: hidden;
  background-color: transparent;
}

.fz-14-i {
  font-size: 14px !important;
}
</style>