<template>
  <v-dialog v-model="modal" max-width="800">
  <v-card>
    <!-- <v-card-title class="px-7">
      <div class="headline font-weight-bold font--text pb-4">
        IPSec Detail
      </div>
    </v-card-title> -->
    <v-card-text>
      
    <!--  <br />
    <v-divider />
     --><br />

    <v-card-title class="px-0 py-2">
      <div class="headline font-weight-bold font--text">
        IPSec Encryption Algorithm Phase 1
      </div>
    </v-card-title>
    <br />

    <v-simple-table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Keylen</th>
            <th>Hash</th>
            <th>DH GROUP</th>
          </tr>
        </thead>
        <tbody style="font-weight: 600">
          <tr v-for="(encVal, i) in dataEncPhaseOne" :key="i" >
            <td>{{uppercaseWord(encVal.encryption_algorithm_name)}}</td>
            <td>{{(encVal.encryption_algorithm_keylen)}}</td>
            <td>{{uppercaseWord(encVal.hash_algorithm)}}</td>
            <td>{{(encVal.dhgroup)}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    
     <br />
     <br />
    <v-divider />
    <br />

    <v-card-title class="px-0 py-2">
      <div class="headline font-weight-bold font--text">
        IPSec Encryption Algorithm Phase 2
      </div>
    </v-card-title>
    <br />

    <v-simple-table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Keylen</th>
          </tr>
        </thead>
        <tbody style="font-weight: 600">
          <tr v-for="(enctwoVal, i) in dataEncPhaseTwo" :key="i" >
            <td>{{uppercaseWord(enctwoVal.encryption_algorithm_option_name)}}</td>
            <td>{{enctwoVal.encryption_algorithm_option_keylen}}</td>
          </tr>
        </tbody>
      </v-simple-table>

     <br />
     <br />
    <v-divider />
    <br />

    </v-data-table>
    <v-card-title class="px-0 py-2">
      <div class="headline font-weight-bold font--text">
        IPSec Hash Algorithm Phase 2
      </div>
    </v-card-title>
    <br />

    <div v-for="(hashVal, i) in dataHashPhaseTwo" :key="i" >
        <v-checkbox class="py-0 mt-2" hide-details v-model="isSelected" :disabled="isReadonly">
          <template v-slot:label>
              <span style="color: black;">
                {{hashVal.hash_algorithm_option.replace("hmac_", "").toUpperCase()}}
              </span>
          </template>
        </v-checkbox>
    </div>
    <br />
    <div>
      <v-row>
        <v-col md="4" sm="12">
          <span class=" font-weight-bold">Description</span>
        </v-col>
        <v-col>
          <span class=" font-weight-bold">{{ vpn_ipsec_p1.descr }}</span>
        </v-col>
      </v-row>
    </div>
    </v-card-text>
    <v-card-text>
      <v-row>
        <v-col>
          <v-btn
          block
          height="45"
          depressed
          class="accent fz-14"
          @click="modal = false"
        >
          <span>Close</span>
        </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  </v-dialog>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { VPN } from '../../namespace';

export default defineComponent({
  props:["value", "dataValue"],
  setup(props, context) {
    const { disconnectIPsec, connectIPsec, fetchIpsecById } = useNamespacedActions(VPN, ["disconnectIPsec", "connectIPsec", "fetchIpsecById"])
    const { ipsecById, isLoadingConn } = useNamespacedGetters(VPN, ["ipsecById", "isLoadingConn"])
    const headers = ref([
      { text: "IKE Type", value: "vpn_ipsec_p1.iketype", sortable: false  },
      { text: "Interface", value: "vpn_ipsec_p1.interface", sortable: false  },
      { text: "Protocol", value: "vpn_ipsec_p2.protocol", sortable: false  },
      { text: "DH-Group", value: "vpn_ipsec_p2.pfsgroup", sortable: false  },
      { text: "Remote Subnet", value: "vpn_ipsec_p2.remoteid_address", sortable: false  },
      { text: "Remote VPN", value: "vpn_ipsec_p1.remote_gateway", sortable: false  },
    ]);
    const isSelected = ref(true);
    const isReadonly = ref(true);
    //const ipsecById[0].encryption_vpn_ipsec_p1 = ref([])

    // const headersPhaseOne = ref([
    //   { text: "Name", value: "encryption_vpn_ipsec_p1.encryption_algorithm_name", sortable: false  },
    //   { text: "Keylen", value: "encryption_vpn_ipsec_p1.encryption_algorithm_keylen", sortable: false  },
    //   { text: "Hash Algorithm", value: "encryption_vpn_ipsec_p1.hash_algorithm", sortable: false  },
    //   { text: "DH Group", value: "encryption_vpn_ipsec_p1.dhgroup", sortable: false  },
    // ]);

    // const headersPhaseTwo = ref([
    //   { text: "Name", value: "encryption_vpn_ipsec_p2.encryption_algorithm_name", sortable: false  },
    //   { text: "Keylen", value: "encryption_vpn_ipsec_p2.encryption_algorithm_keylen", sortable: false  },
    //   { text: "Hash Algorithm", value: "encryption_vpn_ipsec_p2.hash_algorithm", sortable: false  },
    //   { text: "DH Group", value: "encryption_vpn_ipsec_p2.dhgroup", sortable: false  },
    // ]);

    // const headersHash = ref([
    //   { text: "Hash Name", value: "hash_algorithm_vpn_ipsec_p2.hash_algorithm_option", sortable: false  },
    // ]);
    
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

    const doConnect = async(item) => {
      // context.emit('close')
      let payload = {
        id: item.id
      }
      let resp;
      resp = await connectIPsec(payload)
      // console.log(resp)
      
      fetchIpsecById({id_ipsec: props.dataValue.id})
      // if(resp.status == 200){
      //   context.emit('refreshTable')
      //   window.location.href = `/network/vpn/config/ipsec`;
      // }else{
      //   console.log(resp)
      // }
    }

    const doDisconnect = async(item) => {
      // context.emit('close')
      let payload = {
        id: item.id
      }
      let resp;
      resp = await disconnectIPsec(payload)
      
      // console.log(resp)
      fetchIpsecById({id_ipsec: props.dataValue.id})

      // if(resp.status == 200){
      //   context.emit('refreshTable')
      //   window.location.href = `/network/vpn/config/ipsec`;
      // }else{
      //   console.log(resp)
      // }
    }

    const dataEncPhaseOne = ref([]);
    const dataEncPhaseTwo = ref([]);
    const dataHashPhaseTwo = ref([]);
    const vpn_ipsec_p1 = ref({})

    onMounted(async() => {
      await fetchIpsecById({id_ipsec: props.dataValue[0].vpn_ipsec_id})
      dataEncPhaseOne.value = ipsecById.value[0].encryption_vpn_ipsec_p1
      dataEncPhaseTwo.value = ipsecById.value[0].encryption_vpn_ipsec_p2
      dataHashPhaseTwo.value = ipsecById.value[0].hash_algorithm_vpn_ipsec_p2
      vpn_ipsec_p1.value = ipsecById.value[0].vpn_ipsec_p1
    })
    
    return {
      doDisconnect,
      doConnect,
      modal,
      uppercaseWord,
      convertDatetime,
      headers,
      vpn_ipsec_p1,
      // headersPhaseOne,
      // headersPhaseTwo,
      // headersHash,
      isSelected,
      isReadonly,
      ipsecById,
      dataEncPhaseOne,
      dataEncPhaseTwo,
      dataHashPhaseTwo,
      //ipsecById[0].encryption_vpn_ipsec_p1
      isLoadingConn
    }
  },
  filters:{
    hurufGede (str){
      return str.toUpperCase()
    }
  }
})
</script>
