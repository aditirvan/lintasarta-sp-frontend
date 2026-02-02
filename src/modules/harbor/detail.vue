<template>
  <div class="ml-3">
    <v-row class="py-0 my-0">
      <v-col cols="12" class="pl-0 pt-0">
        <v-card class="rounded-0 rounded-t-lg" flat>
          <v-container fluid class="pa-7 pb-0">
            <v-row>
              <v-col class="d-flex">
                <div class="page-title mt-2">Detail Deka Harbor</div>
                <v-spacer></v-spacer>
                <v-btn
                v-if="rowsDelete.length"
                color="error"
                width="150"
                height="50"
                class="secondary fz-14 mr-2"
                depressed
                @click="() => {
                  validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                    doDeleteSelected()
                  })
                }">
                  Delete Selected
                </v-btn>
                <v-btn
                width="150"
                height="50"
                class="secondary fz-14"
                depressed
                v-if="headerName == 'Worker'"
                @click="() => {
                  validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                    openDialogAdd(actionHead = 'add')
                  })
                }"
                >
                  Create {{ headerName }}
                </v-btn>
              </v-col>
            </v-row>

            <v-tabs class="pt-2">
              <!-- <v-tab :to="`/harbor/detail/${$route.params.harborid}/master`"><span>Master</span></v-tab> -->
              <v-tab :to="`/harbor/detail/${$route.params.harborid}/worker`"><span>Worker</span></v-tab>
              <v-tab :to="`/harbor/detail/${$route.params.harborid}/kubeconfig`"><span>Config</span></v-tab>
              <v-tab :to="`/harbor/detail/${$route.params.harborid}/securitygroup`"><span>Security Group</span></v-tab>
              <v-tab :to="`/harbor/detail/${$route.params.harborid}/auditsg`"><span>Security Audit</span></v-tab>
              <v-tab :to="`/harbor/detail/${$route.params.harborid}/loadbalancer`"><span>Load Balancer</span></v-tab>
              <v-tab :to="`/harbor/detail/${$route.params.harborid}/settings`"><span>Settings</span></v-tab>
            </v-tabs>
          </v-container>
        </v-card>
        <v-divider />

        <v-tabs-items v-model="$route.path" style="background: transparent">
          <!-- <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/master`">
            <router-view></router-view>
          </v-tab-item> -->
          <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/worker`">
            <router-view></router-view>
          </v-tab-item>
          <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/kubeconfig`">
            <router-view></router-view>
          </v-tab-item>
          <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/securitygroup`">
            <router-view></router-view>
          </v-tab-item>
          <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/auditsg`">
            <router-view></router-view>
          </v-tab-item>
          <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/loadbalancer`">
            <router-view></router-view>
          </v-tab-item>
          <v-tab-item :value="`/harbor/detail/${$route.params.harborid}/settings`">
            <router-view></router-view>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <create-worker
    v-if="openDialogCreate"
    v-model="openDialogCreate"
    :header="actionHead"
    @refreshTable="refreshTable"
    />

    <dialog-delete
    v-if="openDialogDelete"
    v-model="openDialogDelete"
    :header="headerDelete"
    :itemSelected="rowsDelete"
    @refreshTable="refreshTable"
    @clearItem="clearItem"
    />
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers';
import { HARBOR } from './namespace';
import { AccessControl } from "@/lib/middleware";
import createWorker from './create-worker.vue'
import dialogDelete from './dialog-delete.vue'

export default {
  components:{
    createWorker,
    dialogDelete
  },
  setup(props, context) {
    const { harborid } = context.root._route.params;
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Harbor'));
    const { fetchHarborInstance } = useNamespacedActions(HARBOR,["fetchHarborInstance"])
    const { getListHarborInstance, getTRHarborInstance, isLoading, } = useNamespacedGetters(HARBOR, ["getListHarborInstance", "getTRHarborInstance", "isLoading", ])
    const { rowsDelete } = useNamespacedState(HARBOR, ["rowsDelete"])
    const {
      validateprivilages,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
    ]);

    const refreshTab = async() => {
      options.value.page = 1
      // options.value.instance_id = vyos.value.instance_id
      // if(headerName.value === 'Floating IP'){
      //   await fetchInterfaces(options.value)
      // }else if(headerName.value === 'Static Route'){
      //   await fetchStaticRouting(options.value)
      // }else if(headerName.value === 'NAT'){
      //   await fetchNatGateway(options.value)
      // }
    }

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      // instance_id: vpc.value?.vyos?.instance_id || vyos.value.instance_id
    })

    const openDialogCreate = ref(false)
    const openDialogDelete = ref(false)
    const headerDelete = ref('')

    const openDialogAdd = (name) => {
      // console.log(name)
      openDialogCreate.value = true
      // if(name === 'Floating IP'){
      //   dialogAddInterface.value = true
      // }else if(name === 'Static Route'){
      //   dialogAddRoute.value = true
      // }else if(name === 'NAT'){
      //   dialogAddNat.value = true
      // }
      // console.log(vyos.value)
    }
    const headerName = ref('')
    const namePath = ref([])
    const actionHead = ref('')

    const refreshTable = async() => {
      await fetchHarborInstance({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        harborid: harborid,
        type: 'all'
      })
    }

    watch(() => context.root.$route.path, (newVal) => {
      namePath.value = newVal.split('/')
      if(namePath.value.at(-1) == 'worker'){
        headerName.value = 'Worker'
      }else{
        headerName.value = ''
      }
    })

    const doDeleteSelected = async() => {
      headerDelete.value = 'Selected Worker'
      openDialogDelete.value = true
    }

    const clearItem = () => {
      context.root.$store.commit('DEKAHARBOR/setSelectedRows', [])
    }

    onMounted(async () => {
      // console.log(context.root.$route)

      namePath.value = context.root.$route.path.split('/')
      if(namePath.value.at(-1) == 'worker'){
        headerName.value = 'Worker'
      }else{
        headerName.value = ''
      }
    })
    return{
      headerName,
      refreshTab,
      openDialogAdd,
      read_only,
      openDialogCreate,
      actionHead,
      refreshTable,
      validateprivilages,
      openDialogDelete,
      headerDelete,
      rowsDelete,
      doDeleteSelected,
      clearItem
    }
  },
  // beforeRouteLeave (to, from , next) {
  //   localStorage.removeItem("vyos")
  //   next()
  // }
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