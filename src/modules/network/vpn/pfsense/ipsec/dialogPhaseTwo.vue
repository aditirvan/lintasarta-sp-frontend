<template>
  <v-dialog v-model="modal" max-width="1100">
    <v-card>
      <v-card-title class="px-7">
        <div class="headline font-weight-bold font--text pb-4"> IPSec Phase 2 </div>
      </v-card-title>
      <v-divider />
      <br />
      <v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mode</th>
              <th>Protocol</th>
              <th>Pfs Group</th>
              <th>Lifetime</th>
              <th>Local IP Subnet</th>
              <th>Remote IP Subnet</th>
              <th>Description</th>
              <th colspan="2">Action</th>
            </tr>
          </thead>
          <tbody style="font-weight: 600">
            <tr v-for="(val, i) in dataPhaseTwo" :key="i">
              <td>{{ i+1 }}</td>
              <td>{{(val.mode)}}</td>
              <td>{{uppercaseWord(val.protocol)}}</td>
              <td>{{(val.pfsgroup)}}</td>
              <td>{{(val.lifetime)}}</td>
              <td>{{(val.localid_type == "lan" ? uppercaseWord(val.localid_type) : val.localid_address.concat("/",val.localid_netbits))}}</td>
              <td>{{(val.remoteid_address.concat("/",val.remoteid_netbits))}}</td>
              <td>{{ val.descr }}</td>
              <!-- <td class="warning--text" style="cursor: pointer;" @click="doActionStatusPhase2(val.id)">Disable</td> -->
              <td>
                <popupquote
                v-model="val.open"
                :offsetTop="20"
                :documentid="'popup' + val.id"
                offset-y
                allow-overflow
                >
                  <template  v-slot:activator="{ on, attrs }">
                    <label
                      v-bind="attrs"
                      class="primary--text linkpointer"
                      style="position: relative; white-space: nowrap"
                      @click="
                      ($event) => {
                          on.click($event);
                      }
                      "
                      >More
                      <v-icon
                      :class="{
                          rotate: val.open,
                      }"
                      :id="'popup' + val.id"
                      color="primary"
                      >mdi-chevron-down</v-icon
                      >
                      </label>
                  </template>
                  <v-list>  
                    <v-list-item
                    v-if="val.disabled == false"
                    @click="doActionStatusPhase2(val.id,val.disabled)">
                      <v-list-item-title class="warning--text">Disable</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                    v-else
                    @click="doActionStatusPhase2(val.id,val.disabled)">
                      <v-list-item-title class="primary--text">Enable</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                    v-if="val.localid_type != 'lan'"
                    @click="doDeletePhase2(val.id)">
                      <v-list-item-title class="error--text">Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </popupquote>
              </td>

              <!-- <td v-if="val.localid_type == 'lan'" class="warning--text" style="cursor: pointer;" @click="doActionStatusPhase2(val.id,val.disabled)">Disable</td> -->
              <!-- <td v-if="val.disabled == false" class="warning--text" style="cursor: pointer;" @click="doActionStatusPhase2(val.id,val.disabled)">Disable</td>
              <td v-else class="primary--text" style="cursor: pointer;" @click="doActionStatusPhase2(val.id,val.disabled)">Enable</td>
              
              <td v-if="val.localid_type == 'lan'"></td>
              <td v-else class="error--text" style="cursor: pointer;" @click="doDeletePhase2(val.id)">Delete</td> -->
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn block height="45" depressed class="accent fz-14" @click="modal = false">
              <span>Close</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { VPN } from '../../namespace';

export default defineComponent({
  props:["value", "dataValue"],
  setup(props, context) {
    const { disconnectIPsec, connectIPsec, fetchIpsecById, deletePhaseTwo, disableIPsecPhaseTwo,enableIPsecPhaseTwo,fetchIpsec, fetchIpsecStatus } = useNamespacedActions(VPN, ["disconnectIPsec", "connectIPsec", "fetchIpsecById", "deletePhaseTwo", "disableIPsecPhaseTwo","enableIPsecPhaseTwo","fetchIpsec", "fetchIpsecStatus"])
    const { ipsecById, isLoadingConn } = useNamespacedGetters(VPN, ["ipsecById", "isLoadingConn"])
    const { dialog } = useDialog(props, context)
    
    const modal = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
          // textDel.value = ''
        }
        context.emit("input", false)
      }
    })

    const uppercaseWord = (str) => {
      return str.toUpperCase()
    }

    const convertDatetime = (str) => {
      // var date1 = new Date(); // current date
      // var date2 = new Date("07/12/2023"); // mm/dd/yyyy format
      var date2 = new Date(str);
      var date1 = new Date();
      var timeDiff = Math.abs(date1.getTime() - date2.getTime()); // in miliseconds
      var timeDiffInSecond = Math.ceil(timeDiff / 1000); // in second
      var timeDiffInMinutes = Math.ceil(timeDiff / (1000 * 60)); // in second
      var timeDiffInHours = Math.floor(timeDiff / 3600000); 
      var timeDiffInSeconds = timeDiffInSecond % 10;

      console.log('ini diff');
      console.log(timeDiff);

      return 'Established '+ timeDiffInSecond +' seconds ('+ timeDiffInHours +':'+ timeDiffInMinutes +':'+ timeDiffInSeconds +'0) ago' 
    }

    const doDeletePhase2 = async(idPhase) => {
      let payload = {
        id: idPhase
      }
      console.log(payload)
      
      let resp = await deletePhaseTwo(payload)
      // console.log(resp)
      if(resp.status){
        let currentProj = JSON.parse(localStorage.getItem('currentProj'))
        let currentVpn = JSON.parse(localStorage.getItem('vpn'))
        await fetchIpsec({
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          projek: currentProj.openstack_project_id,
          instance_name: currentVpn.instance_name

        })
        
        dialog.value = false
        //window.location.href = `/network/vpn/config/ipsec`;
      }else{
        console.log(resp)
      }
    }

    const doActionStatusPhase2 = async(idPhase, statusPhaseTwo) => {
      let payload = {
        id: idPhase
      }
      
      if(statusPhaseTwo == false){
        let resp = await disableIPsecPhaseTwo(payload)
        
        if(resp.status){
          // dialog.value = false
          await fetchIpsecById({id_ipsec: props.dataValue[0].vpn_ipsec_id})
          dataPhaseTwo.value = ipsecById.value[0].vpn_ipsec_p2
          //window.location.href = `/network/vpn/config/ipsec`;
        }else{
          console.log(resp)
        }
        
      }else{
        let resp = await enableIPsecPhaseTwo(payload)
        
        if(resp.status){
          // dialog.value = false
          await fetchIpsecById({id_ipsec: props.dataValue[0].vpn_ipsec_id})
          dataPhaseTwo.value = ipsecById.value[0].vpn_ipsec_p2
          //window.location.href = `/network/vpn/config/ipsec`;
        }else{
          console.log(resp)
        }

      }
    }

    const dataPhaseTwo = ref([]);
    const ipPrefix = ref();
    const networkSize = ref();
    let currentVpc = JSON.parse(localStorage.getItem('vpc'))
    // console.log("currentVpc")
    // console.log(currentVpc.ip_prefix.network_size)


    onMounted(async() => {
      await fetchIpsecById({id_ipsec: props.dataValue[0].vpn_ipsec_id})
      dataPhaseTwo.value = ipsecById.value[0].vpn_ipsec_p2
      ipPrefix.value = currentVpc.ip_prefix
      networkSize.value = currentVpc.network_size
    })
    
    return {
      modal,
      uppercaseWord,
      convertDatetime,
      ipsecById,
      dataPhaseTwo,
      doDeletePhase2,
      ipPrefix,
      networkSize,
      isLoadingConn, 
      doActionStatusPhase2,
      dialog
    }
  },
  filters:{
    hurufGede (str){
      return str.toUpperCase()
    }
  }
})
</script>

<style lang="scss" scoped>
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
</style>
