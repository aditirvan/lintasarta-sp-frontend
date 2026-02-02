<template>
  <div>
    <div class="d-flex">
      <span class="headline font-weight-bold font--text" style="padding-top: 15px;">
        IPsec Connection
      </span>
      <v-spacer></v-spacer>
      <v-btn fab
        icon
        color="green"
        @click="refreshStatus">
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </div>
    <v-data-table
    :loading="isLoadingConn"
    :headers="headers"
    :items="listStatusIpsec"
    :items-per-page="10"
    :options.sync="options"
    :server-items-length="totalRowsStatusIpsec"
    class="elevation-0 py-2"
    hide-default-footer
    >
      <template v-slot:item.id="{ item }">
        {{ item['con-id']+'#'+item['uniqueid'] }}
      </template>

      <template v-slot:item.description="{ item }">
        {{ getListIpsec[0] && getListIpsec[0].id }}
      </template>

      <template v-slot:item.local="{ item }">
        <table style="border-bottom: none">
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">ID</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["local-id"] }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Host</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["local-host"]+':'+item["local-port"] }}</td>
          </tr>
          <!-- <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">SPI</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["initiator-spi"] }}</td>
          </tr> -->
        </table>
      </template>

      <template v-slot:item.remote="{ item }">
        <table style="border-bottom: none">
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">ID</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["remote-id"] }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Host</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["remote-host"]+':'+item["remote-port"] }}</td>
          </tr>
          <!-- <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">SPI</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["responder-spi"] }}</td>
          </tr> -->
        </table>
      </template>

      <template v-slot:item.role="{ item }">
        <span>IKEv2 Initiator</span>
      </template>

      <template v-slot:item.timers="{ item }">
        <table style="border-bottom: none">
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Rekey</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["rekey-time"]+'s' }} {{ convertTime(item["rekey-time"]) }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Reauth</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["reauth-time"]+'s' }} {{ convertTime(item["reauth-time"]) }}</td>
          </tr>
        </table>
      </template>

      <template v-slot:item.algo="{ item }">
        <span> {{ item['encr-alg'] }}</span>
        <span> {{ item['integ-alg'] }} </span>
        <span> {{ item['prf-alg'] }} </span>
        <span> {{ item['dh-group'] }} </span>
      </template>

      <template v-slot:no-data>
        <v-progress-circular v-if="isLoadingConn"
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
            Looks like there is no connection
          </p>
        </div>
      </template>
    </v-data-table>

    <br />
      <v-divider style="min-width: 160px" />
    <br />
    <v-btn
    :outlined="btnRouteOpen"
    color="info"
    class="mb-2"
    v-if="listStatusIpsec.length"
    @click="() => { btnRouteOpen = !btnRouteOpen}"
    >
      <v-icon class="mr-1">mdi-{{ !btnRouteOpen ? 'plus' : 'minus' }}-circle-outline</v-icon>
      {{ !btnRouteOpen ? 'Show' : 'Hide' }} Child SA Entries
    </v-btn>

    <div
    v-if="listStatusIpsec.length && btnRouteOpen"
    class="headline font-weight-bold font--text pb-4">
      Phase 2
    </div>
    <v-data-table
    v-if="listStatusIpsec.length && btnRouteOpen"
    :headers="headersChild"
    :items="childValue"
    :items-per-page="10"
    class="elevation-0 py-2"
    hide-default-footer
    >
      <template v-slot:item.id="{ item }">
        {{ item['name']+'#'+item['uniqueid'] }}
      </template>

      <template v-slot:item.description="{ item }">
        {{ 'ipsec-p2-'+currentVpn.instance_name }}
      </template>

      <template v-slot:item.local="{ item }">
        <!-- <span>{{ splitStraight(item["local-ts"][0]) }}</span> -->
        <span v-for="(val, i) in childValue" :key="i" >
          <span v-for="(va, i) in val['local-ts']" :key="i" >
            {{splitStraight(va)}} </br>
          </span>
        </span>
      </template>

      <template v-slot:item.spi="{ item }">
        <table style="border-bottom: none">
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Local</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["spi-in"] }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Remote</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["spi-out"] }}</td>
          </tr>
        </table>
      </template>

      <template v-slot:item.remote="{ item }">
        <!-- <span>{{ splitStraight(item["remote-ts"][0]) }}</span> -->
        <span v-for="(val, i) in childValue" :key="i" >
          <span v-for="(va, i) in val['remote-ts']" :key="i" >
            {{splitStraight(va)}} </br>
          </span>
        </span>
      </template>

      <template v-slot:item.timers="{ item }">
        <table style="border-bottom: none">
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Rekey</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["rekey-time"]+'s' }} {{ convertTime(item["rekey-time"]) }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Life</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["life-time"]+'s' }} {{ convertTime(item["life-time"]) }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Install</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["install-time"]+'s' }} {{ convertTime(item["install-time"]) }}</td>
          </tr>
        </table>
      </template>

      <template v-slot:item.algo="{ item }">
        <span> {{ item['encr-alg'] }}</span>
        <span> {{ item['integ-alg'] }} </span>
        <span> {{ item['dh-group'] }} </span>
        <span>IPComp: None</span>
      </template>

      <template v-slot:item.stats="{ item }">
        <table style="border-bottom: none">
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Bytes-In</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["bytes-in"] }} {{ '('+formatBytes(item["bytes-in"])+')' }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Packets-In</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["packets-in"] }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Bytes-Out</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["bytes-out"] }}</td>
          </tr>
          <tr class="my-0 py-0" style="padding-top: 0 !important; padding-bottom: 0 !important">
            <td class="my-0 py-0">Packets-Out</td>
            <td class="my-0 py-0"><span class="mx-2">:</span>  {{ item["packets-out"] }}</td>
          </tr>
        </table>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { VPN } from "../../namespace"

export default defineComponent({
  props:["value", "dataValue"],
  setup(props, context) {
    const { fetchIpsecStatus, refreshIPsec } = 
    useNamespacedActions(VPN, ["fetchIpsecStatus", "refreshIPsec"])
    
    const { isLoadingConn, totalRowsStatusIpsec, listStatusIpsec, getListIpsec } = 
    useNamespacedGetters(VPN, ["isLoadingConn", "totalRowsStatusIpsec", "listStatusIpsec", "getListIpsec"])

    let currentVpn = JSON.parse(localStorage.getItem('vpn'))

    const headers = ref([
      // { text: "ID", value: "id", sortable: false, width: "80px"  },
      // { text: "Description", value: "description", sortable: false, width: "100px" },
      { text: "Local", value: "local", sortable: false,  },
      { text: "Remote", value: "remote", sortable: false, },
      { text: "Role", value: "role", sortable: false  },
      // { text: "Timers", value: "timers", sortable: false, width: "220px" },
      // { text: "Algo", value: "algo", sortable: false  },
    ]);
    const headersChild = ref([
      // { text: "ID", value: "id", sortable: false, width: "80px"  },
      // { text: "Description", value: "description", sortable: false, width: "120px" },
      { text: "Local", value: "local", sortable: false, },
      // { text: "SPI", value: "spi", sortable: false, width: "180px" },
      { text: "Remote", value: "remote", sortable: false, },
      // { text: "Timers", value: "timers", sortable: false, width: "210px" },
      // { text: "Algo", value: "algo", sortable: false  },
      { text: "Stats", value: "stats", sortable: false,   },
    ]);
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      instance_name: currentVpn.instance_name
    })
    const btnRouteOpen = ref(false)

    const convertTime = (str) => {
      var date = new Date(null);
      date.setSeconds(str); 
      var hhmmssFormat = date.toISOString().substr(11, 8);
      // console.log(hhmmssFormat);
      return '('+ hhmmssFormat + ')'
    }

    const childValue = ref([])
    const filterChild = (items) => {
      for(const [key, value] of Object.entries(items)){
        childValue.value.push({...value, key: key})
      }
    }

    const splitStraight = (val) => {
      let v = val.split("|")
      return v[0]
    }

    const formatBytes = (bytes, decimals = 2) => {
      if (!+bytes) return '0 Bytes'

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return `${parseFloat((Math.round(bytes / Math.pow(k, i))))} ${sizes[i]}`
    }

    const refreshStatus = async () => {
      let resp;
      resp = await refreshIPsec({ vpnname: currentVpn.instance_name })
      // console.log(resp)
      
      if(resp.status == 200){
        await fetchIpsecStatus(options.value)
      }else{
        console.log(resp)
      }
    }

    onMounted(async() => {
      //console.log(props.dataValue)
      //if(getListIpsec.value[0].connection_status != "DISCONNECTED"){
      //if(getListIpsec.length > 0){
      if(totalRowsStatusIpsec){
        await fetchIpsecStatus(options.value)
        if(listStatusIpsec.value.length){
          for (let i = 0; i < listStatusIpsec.value.length; i++) {
            filterChild(listStatusIpsec.value[i]['child-sas'])
          }
          //filterChild(listStatusIpsec.value[0]['child-sas'])
        }
      }
      //console.log(listStatusIpsec.value[0]['child-sas'])
    })
    return {
      currentVpn,
      convertTime,
      headers,
      isLoadingConn,
      options,
      totalRowsStatusIpsec,
      listStatusIpsec,
      getListIpsec,
      btnRouteOpen,
      headersChild,
      childValue,
      splitStraight,
      formatBytes,
      refreshStatus
    }
  },
  filters:{
    hurufGede (str){
      return str.toUpperCase()
    }
  }
})
</script>
