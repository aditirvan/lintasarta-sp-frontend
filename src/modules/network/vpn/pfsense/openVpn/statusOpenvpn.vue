<template>
  <div class="pb-0 mb-0">
    <div v-if="isLoadingStatusVpn" class="d-flex justify-center">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>
    <div
    v-else
    v-for="(statusOpenvpn, i) in getListStatusOpenvpn" :key="i"
    class="my-3 pb-0"
    >
    <!-- style="border: 2px solid grey; border-radius: 5px" -->
      <!-- <tr>
        <td class="fz-14 font-weight-bold">Name</td>
        <td class="px-5">:</td>
        <td><div class="fz-16 font-weight-bold">{{ statusOpenvpn.name }}</div></td>
      </tr> -->
      <div v-if="statusOpenvpn.conns.length">
        <tr>
          <td class="fz-14 font-weight-bold">Client Connection</td>
          <td class="px-5">:</td>
          <td><div class="fz-16 font-weight-bold">{{ statusOpenvpn.conns.length }}</div></td>
        </tr>
        <v-data-table
        :headers="headers"
        :items="statusOpenvpn.conns"
        :items-per-page="10"
        :loading="isLoadingStatusVpn"
        class="elevation-0 py-2"
        hide-default-footer
        >
        <template v-slot:no-data>
          <v-progress-circular v-if="isLoadingStatusVpn"
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
        <template v-slot:item.common_name="{ item }">
          <!-- <span>{{ user[0].username }}</span> -->
          <span>{{ item.user_name }}</span>
        </template>
        <template v-slot:footer="{ props }">
          {{ changePage(props) }}
          <custom-footer-datatable 
            v-if="getListStatusOpenvpn.length"
            :props="props" />
        </template>
        </v-data-table>
        <v-btn
        color="info"
        class="mb-2"
        v-if="statusOpenvpn.conns.length && !btnRouteOpen"
        @click="() => { btnRouteOpen = !btnRouteOpen}"
        >
          <v-icon class="mr-1">mdi-plus-circle-outline</v-icon>
          Show Routing Table
        </v-btn>
        <v-btn
        outlined
        color="info"
        class="mb-2"
        v-else-if="statusOpenvpn.conns.length && btnRouteOpen"
        @click="() => { btnRouteOpen = !btnRouteOpen}"
        >
          <v-icon class="mr-1">mdi-minus-circle-outline</v-icon>
          Hide Routing Table
        </v-btn>
        <v-data-table
        v-if="statusOpenvpn.routes && btnRouteOpen"
        :headers="headersRouting"
        :items="statusOpenvpn.routes"
        :items-per-page="10"
        :options.sync="optionsRouting"
        class="elevation-0 py-2"
        hide-default-footer
        >
        </v-data-table>
        <v-divider class="pb-5"></v-divider>
      </div>
    </div>
    <div v-if="!isLoadingStatusVpn && !connExist">
      <v-data-table
        :headers="headers"
        :items="[]"
        :items-per-page="10"
        class="elevation-0 py-2"
        hide-default-footer
        >
        <template v-slot:no-data>
          <v-progress-circular v-if="isLoadingStatusVpn"
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
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, computed } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { VPN } from '../../namespace'

export default {
  props: ["dataValue"],
  setup(props) {
    const { fetchStatusOpenVpn } = useNamespacedActions(VPN, ["fetchStatusOpenVpn"])
    const { getListStatusOpenvpn, isLoadingStatusVpn } = useNamespacedGetters(VPN, ["getListStatusOpenvpn", "isLoadingStatusVpn"])
    
    const headers = ref([
        { text: "Username", value: "common_name", sortable: false },
        { text: "Real Address", value: "remote_host", sortable: false },
        { text: "Virtual Address", value: "virtual_addr", sortable: false },
        { text: "Connected Since", value: "connect_time", sortable: false },
        { text: "Bytes Sent", value: "bytes_sent", sortable: false },
        { text: "Bytes Received", value: "bytes_recv", sortable: false },
        { text: "Cipher", value: "cipher", sortable: false },
      ])
    const headersRouting = ref([
        { text: "Username", value: "common_name", sortable: false },
        { text: "Real Address", value: "remote_host", sortable: false },
        { text: "Target Network", value: "remote_host", sortable: false },
        { text: "Last Used", value: "last_time", sortable: false },
      ])

    const vpn = JSON.parse(localStorage.getItem("vpn"))
    const btnRouteOpen = ref(false)
    const connExist = ref(false)

    const hideStatus = computed(() => getListStatusOpenvpn.value)

    watch(hideStatus, (newVal) => {
      if(newVal.length){
        newVal.forEach((x) =>{
          if(x.conns.length){
            connExist.value = true
          }else{
            connExist.value = false
          }
        })
      }
    })

    onMounted(async() => {
      await fetchStatusOpenVpn({ vpnname: props.dataValue.instance_name })
      getListStatusOpenvpn.value.forEach((x) =>{
        if(x.conns.length){
          connExist.value = true
        }
      })
    })

    const optionsRouting = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
    })

    const changePage = (props) => {
      optionsRouting.value.page = props.pagination.page
      optionsRouting.value.page = props.pagination.itemsPerPage
    }
    
    return{
      headers,
      headersRouting,
      isLoadingStatusVpn,
      getListStatusOpenvpn,
      btnRouteOpen,
      connExist,
      changePage,
      optionsRouting
    }
  },
}
</script>

<style lang="scss">
.v-data-table > .v-data-table__wrapper > table > thead > tr > th{
     font-size: 13px !important; 
}
</style>
