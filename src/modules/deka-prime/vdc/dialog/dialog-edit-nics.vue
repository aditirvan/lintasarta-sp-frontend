<template>
  <v-dialog v-model="dialog" max-width="1200">
    <v-card class="pt-7 rounded-lg" id="container">
      <v-card-text>
        <div class="d-flex flex-row">
          <p class="fz-21 font-weight-bold mb-0">Edit NICs for {{ '"'+ data.Name + '"' }}</p>
        </div>
      </v-card-text>

      <v-card-text>
        <div class="d-flex">
          <span class="primary--text fz-16 ml-4" style="cursor: pointer" @click="addNew">
            NEW
          </span>
          <span v-if="radio1" class="primary--text fz-16 ml-4" style="cursor: pointer" @click="deleteRow">
            DELETE
          </span>
          <span v-else class="grey--text fz-16 ml-4" style="">
            DELETE
          </span>
        </div>
        <v-data-table :headers="headersNic" :items="nicsValues" item-key="id" single-line class="elevation-0 mt-4" hide-default-footer>
          <!-- <template #[`item`]="{ item, index }">
            <NicsRow
            :value="item"
            :radio1="radio1"
            :primaryRadio="primaryRadio"
            @rowClicked="radio1 = $event"
            @primaryClicked="primaryRadio = $event"
            @getRowClicked="rowValue = $event"
            @getRowPrimaryClicked="rowValuePrimary = $event"
            />
          </template> -->

          <template #[`item.radio`]="{ item, index }">
            <v-radio-group v-model="radio1">
              <v-radio :value="item.id" @click="getRow(item, index)" :key="nicsValues.indexOf(item)"></v-radio>
            </v-radio-group>
          </template>

          <template #[`item.NeedsCustomization`]="{ item }">
            <div>
              <v-radio-group v-model="primaryRadio">
                <v-radio :value="item.id" @click="getRowPrimary(item)" :key="item.id" :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-marked'"></v-radio>
              </v-radio-group>
            </div>
          </template>

          <template #[`item.IsConnected`]="{ item }">
            <div>
              <v-checkbox :input-value="item.IsConnected" @click="item.IsConnected = !item.IsConnected">{{ item.IsConnected }}</v-checkbox>
            </div>
          </template>

          <template #[`item.NetworkAdapterType`]="{ item }">
            <v-select style="width: 200px;" :disabled="!item.adding" :items="listNat" v-model="item.NetworkAdapterType" ></v-select>
          </template>
          
          <template #[`item.Network`]="{ item }">
            <!-- <v-select :items="networkNics" v-model="item.Network" ></v-select> -->
            <NetworkSelect
            v-model="item"
            @networkVal="(val) => { 
              if(val == 'none') { 
                item.IPAddressAllocationMode = 'NONE'
                }else{
                  item.IPAddressAllocationMode = 'DHCP'
                }
              }"
            />
          </template>
          
          <template #[`item.IPAddressAllocationMode`]="{ item }">
            <v-select style="width: 200px;" :items="ipModes" v-model="item.IPAddressAllocationMode" 
            @change="($event) => {
              if($event == 'NONE'){
                item.Network = 'none'
              }
            }"></v-select>
          </template>

          <template #[`item.IPAddress`]="{ item }">
            <IpAddressField
            v-model="item"
            />
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn
            :disabled="isLoadingBtn"
            depressed
            height="35"
            block
            class="accent"
            @click="
              () => {
                dialog = false
              }
            "
            >Cancel</v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="3">
            <v-btn
            :loading="isLoadingBtn"
            :disabled="isLoadingBtn"
            id="Add"
            depressed
            height="35"
            block
            class="secondary"
            @click="update"
            >
            Save
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { onMounted, ref } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { VDC } from '../namespace';
import useVuelidate from '@vuelidate/core';
import IpAddressField from './ipAddress-field.vue'
import NetworkSelect from './network-select.vue'

export default {
  components: {
    IpAddressField,
    NetworkSelect
  },
  props: ["value", "data"],
  setup(props, context) {
    const { networkNics, isLoadingBtn } = useNamespacedGetters(VDC, [
      "networkNics",
      "isLoadingBtn"
    ]);
    const { getNetworkNics, updateNics } = useNamespacedActions(VDC, [
      "getNetworkNics",
      "updateNics",
    ]);
    const { dialog } = useDialog(props, context)

    onMounted(() => {
      let dp = JSON.parse(localStorage.getItem("dekaPrime"))

      getNetworkNics({ idVdc: dp.vmwareProjectId  })
      if(props.data.NetworkConnectionSection.NetworkConnection){
        nicsValues.value = props.data?.NetworkConnectionSection?.NetworkConnection.map((x) => {
          let id = Math.random()
          if(x.NetworkConnectionIndex == props.data.NetworkConnectionSection.PrimaryNetworkConnectionIndex){
            primaryRadio.value = id
          }
          return{
            ...x,
            id: id,
          }
        })
      }
      // console.log(nicsValues.value)
    })
    const listNat = ref(["E1000", "E1000E", "SRIOVETHERNETCARD", "VMXNET2", "VMXNET3", "VMXNET3VRDMA"]);
    const ipModes = ref([
      { text: 'NONE', value: 'NONE' },
      { text: 'DHCP', value: 'DHCP' },
      { text: 'Static - IP Pool', value: 'POOL' },
      { text: 'Static - Manual', value: 'MANUAL' },
    ])

    const radio1 = ref();
    const primaryRadio = ref();
    const rowValue = ref()
    const rowValuePrimary = ref()
    const nicsValues = ref([])
    const headersNic = ref([
      { text: "", value: "radio", sortable: false },
      // { text: "NIC", value: "NetworkConnectionIndex", sortable: false },
      { text: "Primary NIC", value: "NeedsCustomization", sortable: false, width: '120px' },
      { text: "Connected", value: "IsConnected", sortable: false },
      { text: "Adapter Type", value: "NetworkAdapterType", sortable: false },
      { text: "Network", value: "Network", sortable: false },
      { text: "IP Mode", value: "IPAddressAllocationMode", sortable: false },
      { text: "IP", value: "IPAddress", sortable: false },
      { text: "MAC Address", value: "MACAddress", sortable: false },
    ]);

    const getRow = (item, index) => {
      rowValue.value = index
      // console.log(context.root.$route.params)
    }
    const getRowPrimary = (item) => {
      // console.log(item)
      rowValuePrimary.value = item
    }

    const addNew = () => {
      rowValue.value = null
      radio1.value = null
      nicsValues.value.unshift({
        ExternalIpAddress: "",
        IPAddress: "",
        IPAddressAllocationMode: "NONE",
        IsConnected: true,
        MACAddress: "",
        NeedsCustomization: false,
        Network: "none",
        NetworkAdapterType: "VMXNET3",
        NetworkConnectionIndex: nicsValues.value.length,
        id: Math.random(),
        adding: true,
      })
    }
    const deleteRow = () => {
      nicsValues.value.splice(rowValue.value,1)
      rowValue.value = null
      radio1.value = null
    }

    const $v = useVuelidate()
    const update = async() => {
      $v.value.$touch()
      if ($v.value.$errors.length) {
        let container = document.getElementById("container");
        container.scrollIntoView({behavior: "smooth"})
        return;
      }
      
      let lengthNics = nicsValues.value.length
      let primaryIdx
      let nics = nicsValues.value.map((x, i) => {
        if(primaryRadio.value == x.id){
          primaryIdx = ((lengthNics-1) - nicsValues.value.indexOf(x))
        }

        return{
          ExternalIpAddress: "",
          IPAddress: x.IPAddressAllocationMode == 'MANUAL' || x.IPAddressAllocationMode == 'POOL' ? x.IPAddress : "",
          IPAddressAllocationMode: x.IPAddressAllocationMode,
          IsConnected: x.IsConnected,
          MACAddress: x.MACAddress,
          NeedsCustomization: x.adding ? false  : true,
          Network: x.Network,
          NetworkAdapterType: x.NetworkAdapterType,
          NetworkConnectionIndex: ((lengthNics-1) - nicsValues.value.indexOf(x)),
        }
      })
      let params = context.root.$route.params
      let payload = {
        id: {
          id_vdc: params.id,
          id_vapp: params.id_vapp,
          id_vm: params.id_vm,
        },
        body: {
          networkConnection: nics,
          primaryNetworkConnectionIndex: primaryIdx
        }
      }
      // console.log(payload)
      await updateNics(payload)
      dialog.value = false
    }
    return{
      dialog,
      update,
      headersNic,
      nicsValues,
      listNat,
      networkNics,
      ipModes,
      radio1,
      getRow,
      addNew,
      deleteRow,
      primaryRadio,
      rowValue,
      getRowPrimary,
      isLoadingBtn,
    }
  },
}
</script>