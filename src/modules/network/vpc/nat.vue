<template>
  <div class="ml-3">
      <v-row class="py-0 my-0">
        <v-col cols="12" class="pl-0 pt-0">
          <v-card class="rounded-0 rounded-t-lg" flat>
            <v-container fluid class="pa-7 pb-0">
              <v-row>
                <v-col class="d-flex">
                  <div class="page-title mt-2">Configuration NAT Gateway</div>
                  <v-spacer></v-spacer>
                  <v-btn
                  width="150"
                  height="50"
                  class="secondary fz-14"
                  depressed
                  v-if="(headerName == 'Floating IP' && !read_only) || (headerName == 'Static Route' && !read_only) || (headerName == 'NAT' && interfaces.length && !read_only)"
                  @click="openDialogAdd(headerName)"
                  >
                    Create {{ headerName }}
                  </v-btn>
                </v-col>
              </v-row>

              <v-tabs class="pt-2">
                <v-tab :to="`/network/nat/${$route.params.vyosid}/networknat`"><span>Router</span></v-tab>
                <v-tab :to="`/network/nat/${$route.params.vyosid}/floatingip`"><span>Floating IP</span></v-tab>
                <v-tab :to="`/network/nat/${$route.params.vyosid}/routing`"><span>Static Route</span></v-tab>
                <v-tab :to="`/network/nat/${$route.params.vyosid}/nat`"><span>NAT</span></v-tab>
              </v-tabs>
            </v-container>
          </v-card>
          <v-divider />

          <v-tabs-items v-model="$route.path" style="background: transparent">
            <v-tab-item :value="`/network/nat/${$route.params.vyosid}/networknat`">
              <router-view></router-view>
            </v-tab-item>
            <v-tab-item :value="`/network/nat/${$route.params.vyosid}/floatingip`">
              <router-view></router-view>
            </v-tab-item>
            <v-tab-item :value="`/network/nat/${$route.params.vyosid}/routing`">
              <router-view></router-view>
            </v-tab-item>
            <v-tab-item :value="`/network/nat/${$route.params.vyosid}/nat`">
              <router-view></router-view>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    <dialog-add-interfaces
    v-if="dialogAddInterface == true"
    v-model="dialogAddInterface"
    :vyos="vyos"
    @refreshTab="refreshTab"
    />

    <dialogAddsr
    v-if="dialogAddRoute == true"
    v-model="dialogAddRoute"
    :vyos="vyos"
    @refreshTab="refreshTab"
    />

    <dialog-add-nat
    v-if="dialogAddNat == true"
    v-model="dialogAddNat"
    @refreshTab="refreshTab"
    />
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api';
import dialogAddInterfaces from '../vpc/vpc_detail/dialogAddInterface.vue'
import dialogAddsr from '../vpc/vpc_detail/dialogAddStaticRoute.vue'
import dialogAddNat from '../vpc/vpc_detail/dialogAddNat.vue'
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers';
import { NETWORKVPC } from './namespace';
import { AccessControl } from "@/lib/middleware";

export default {
  components:{
    dialogAddInterfaces,
    dialogAddsr,
    dialogAddNat
  },
  setup(props, context) {
    const { vyosid } = context.root._route.params;
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));

    const { 
      fetchInterfaces,
      fetchStaticRouting,
      fetchNatGateway,
      DETAIL_VYOS
      } = useNamespacedActions(NETWORKVPC, [
      "fetchInterfaces",
      "fetchStaticRouting",
      "fetchNatGateway",
      "DETAIL_VYOS"
    ]);

    const { 
      detailVyos: vyos,
      interfaces
      } = useNamespacedState(NETWORKVPC, [
      "detailVyos",
      "interfaces",
    ]);

    const dialogAddInterface = ref(false)
    const dialogAddRoute = ref(false)
    const dialogAddNat = ref(false)

    const refreshTab = async() => {
      options.value.page = 1
      options.value.instance_id = vyos.value.instance_id
      if(headerName.value === 'Floating IP'){
        await fetchInterfaces(options.value)
      }else if(headerName.value === 'Static Route'){
        await fetchStaticRouting(options.value)
      }else if(headerName.value === 'NAT'){
        await fetchNatGateway(options.value)
      }
    }

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      // instance_id: vpc.value?.vyos?.instance_id || vyos.value.instance_id
    })

    const openDialogAdd = (name) => {
      // console.log(name)
      if(name === 'Floating IP'){
        dialogAddInterface.value = true
      }else if(name === 'Static Route'){
        dialogAddRoute.value = true
      }else if(name === 'NAT'){
        dialogAddNat.value = true
      }
      // console.log(vyos.value)
    }
    const headerName = ref('')
    const namePath = ref([])

    watch(() => context.root.$route.path, (newVal) => {
      namePath.value = newVal.split('/')
      if(namePath.value.at(-1) == 'floatingip'){
        headerName.value = 'Floating IP'
      }else if(namePath.value.at(-1) == 'routing'){
        headerName.value = 'Static Route'
      }else if(namePath.value.at(-1) == 'nat'){
        headerName.value = 'NAT'
      }else{
        headerName.value = ''
      }
    })

    onMounted(async () => {
      // console.log(context.root.$route)
      await DETAIL_VYOS({vyosid: vyosid})
      localStorage.setItem("vyos", JSON.stringify(vyos.value))
      await fetchInterfaces({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        instance_id: vyos.value.instance_id
      })
      namePath.value = context.root.$route.path.split('/')
      if(namePath.value.at(-1) == 'floatingip'){
        headerName.value = 'Floating IP'
      }else if(namePath.value.at(-1) == 'routing'){
        headerName.value = 'Static Route'
      }else if(namePath.value.at(-1) == 'nat'){
        headerName.value = 'NAT'
      }else{
        headerName.value = ''
      }
    })
    return{
      headerName,
      refreshTab,
      vyos,
      openDialogAdd,
      dialogAddInterface,
      dialogAddRoute,
      dialogAddNat,
      interfaces,
      read_only
    }
  },
  beforeRouteLeave (to, from , next) {
    localStorage.removeItem("vyos")
    next()
  }
}
</script>


<style scoped>
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
</style>