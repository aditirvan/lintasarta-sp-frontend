<template>
  <div>
    <div class="px-3">
      <v-row>
        <v-col cols="12" class="pl-0">
          <v-card class="rounded-0 rounded-t-lg" flat>
            <v-container fluid class="pa-7 pb-0">
              <v-row>
                <v-col class="d-flex">
                  <div class="page-title mt-2">Network</div>
                  <v-spacer></v-spacer>
                  <v-btn
                    width="150"
                    height="50"
                    class="secondary fz-14 mr-5"
                    depressed
                    v-if="vpcs.length && $route.path == '/network/vpc' && !read_only && user_role === 'Superadmin'"
                    @click="() => {openSyncDialog = true;}"
                  >
                    Sync VPC Network
                  </v-btn>
                  <v-btn
                    width="150"
                    height="50"
                    class="secondary fz-14"
                    depressed
                    :to="path"
                    v-if="vpcs.length && $route.path == '/network/vpc' && !read_only"
                  >
                    Create VPC
                  </v-btn>
                  <v-btn
                  v-if="getListSlb.length && $route.path == '/network/slb' && !read_only"
                  depressed
                  width="180"
                  class="secondary"
                  :to="path"
                  >
                    <span class="fz-14">Create Load Balancer</span>
                  </v-btn>
                  <!-- <popupquote
                  v-model="buttonCreate"
                  :offsetTop="20"
                  :documentid="'popup1'"
                  offset-y
                  allow-overflow
                  v-if="vpcs.length && $route.path == '/network/vpc'"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                      width="150"
                      height="50"
                      class="secondary fz-14"
                      depressed
                      style="position: relative; white-space: nowrap"
                      v-bind="attrs"
                      v-on="on"
                      >
                        Create VPC
                        <v-icon
                        right
                        :class="{
                          rotate: buttonCreate,
                        }"
                        :id="'popup1'"
                        color="white"
                        >mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>                                    
                      <v-list-item
                      :to="{ path: '/network/vpc/create' }">
                        <v-list-item-title class="">Wizard Simple</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                      to="/network/vpc/createexpert">
                        <v-list-item-title class="">Wizard Expert</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </popupquote> -->
                  <v-btn
                    width="150"
                    class="secondary fz-14"
                    depressed
                    :to="path"
                    v-else-if="$route.path == '/network/vpn' && showBtnVpn && !read_only && getListPfsense.length"
                  >
                    Create VPN
                  </v-btn>
                </v-col>
              </v-row>

              <v-tabs class="pt-2">
                <v-tab to="/network/vpc"><span>VPC</span></v-tab>
                <v-tab to="/network/nat"><span>NAT Gateway</span></v-tab>
                <v-tab to="/network/floatingip">Floating IP</v-tab>
                <!-- <v-tab to="/network/loadbalancer">
                  Load Balancer 
                  <span 
                    class="px-2 py-1 ml-1 rounded-pill primary white--text" 
                    style="font-weight:500; font-size:12px"
                  >Beta</span>
                </v-tab> -->
                <v-tab to="/network/slb">
                  Load Balancer
                  <!-- <span 
                    class="px-2 py-1 ml-1 rounded-pill primary white--text" 
                    style="font-weight:500; font-size:12px"
                  >Beta</span> -->
                </v-tab>
                <v-tab to="/network/vpn">
                  VPN
                </v-tab>
              </v-tabs>
            </v-container>
          </v-card>
          <v-divider />

          <v-tabs-items v-model="$route.path" style="background: transparent">
            <v-tab-item value="/network/vpc">
              <router-view></router-view>
            </v-tab-item>

            <v-tab-item value="/network/floatingip">
              <router-view></router-view>
            </v-tab-item>

            <!-- <v-tab-item value="/network/loadbalancer">
              <router-view></router-view>
            </v-tab-item> -->

            <v-tab-item value="/network/slb">
              <router-view></router-view>
            </v-tab-item>

            <v-tab-item value="/network/nat">
              <router-view></router-view>
            </v-tab-item>
            
            <v-tab-item value="/network/vpn">
              <router-view></router-view>
            </v-tab-item>

            <!-- <v-tab-item value="/network/vpn/tunnels">
              <router-view></router-view>
            </v-tab-item>

            <v-tab-item value="/network/vpn/psk">
              <router-view></router-view>
            </v-tab-item> -->
          </v-tabs-items>
        </v-col>
      </v-row>

      <v-row v-if="loadbalances.length > 0 && $route.name === 'loadbalancer'">
        <v-col cols="12" class="pl-0">
          <v-card class="rounded-lg" flat>
            <v-container class="pa-8">
              <h3>Load Balance</h3>
              <br />
              <v-simple-table>
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Status</th>
                    <th>IP Address</th>
                    <th>Healthy</th>
                    <th>Req/s</th>
                    <th>Created</th>
                    <th v-if="!read_only">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="loadbalance in loadbalances"
                    :key="loadbalance.name"
                  >
                    <td>
                      <span class="blue--text">{{ loadbalance.name }}</span
                      ><br />REG x Instance
                    </td>
                    <td>X GB</td>
                    <td>192.191.000.2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td v-if="!read_only">
                      <router-link to="/network/loadbalancer/edit">
                        <span class="primary--text edit">Edit</span>
                      </router-link>
                      <span
                        class="error--text pr-3 delete ml-4"
                        @click="deleteModal()"
                        >Delete</span
                      >
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="floatingip.length > 0 && $route.name === 'floatingip'">
        <v-col cols="12" class="pl-0">
          
        </v-col>
      </v-row>

      <v-row v-if="domains.length > 0 && $route.name === 'dns'">
        <v-col cols="12" class="pl-0">
          <v-card class="rounded-lg" flat>
            <v-container class="pa-8">
              <h3>Domain</h3>
              <br />
              <v-simple-table>
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Direct to</th>
                    <th v-if="!read_only">Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="ip in domains" :key="ip.name">
                    <td><a href="">xxx.yyy.xyz</a></td>
                    <td>192.000.111.02</td>
                    <td v-if="!read_only">
                      <span class="primary--text edit">Edit</span
                      ><span
                        class="error--text pr-3 delete ml-4"
                        @click="deleteModal()"
                        >Delete</span
                      >
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-menu
        class="tip"
        v-model="showMenu"
        :position-x="x - 10"
        :position-y="y - 70"
        absolute
        allow-overflow
        width="310"
      >
        <v-list>
          <v-list-item>
            <div class="menu-title pa-3">Select Project</div>
          </v-list-item>

          <v-list-item>
            <v-divider />
            <div class="d-flex">
              <div class="dotblue"></div>
              <div class="project-list">Lintasarta</div>
            </div>
            <v-divider />
          </v-list-item>
          <v-list-item>
            <v-btn class="grey lighten-1" depressed block dark>Delete</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu
        v-model="showAssign"
        :position-x="x - 450"
        :position-y="y - 100"
        absolute
        allow-overflow
        width="471"
      >
        <v-list>
          <v-list-item>
            <v-text-field maxlength="50" label="Search for a Instance"></v-text-field>
          </v-list-item>
          <v-list-item style="border-bottom: 1px solid lightgrey">
            <v-list-item-title class="list"
              >Unassign floating IP</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <div class="d-flex">
              <div class="dotblue pt-2"></div>
              <div class="list">
                <div class="project-list">Lintasarta-super-server</div>
                <div>4 GB / 80 GB / SGP1</div>
              </div>
            </div>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu
        class="tip"
        v-model="more"
        :position-x="x - 10"
        :position-y="y"
        absolute
        allow-overflow
        width="310"
      >
        <v-list>
          <v-list-item>
            <v-list-item-title class="list" @click="assign()"
              >Reassign</v-list-item-title
            >
          </v-list-item>
          <v-list-item style="border-bottom: 1px solid lightgrey">
            <v-list-item-title class="list" @click="show(event)"
              >Move to...</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="error--text list"
              >Delete</v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <router-view name="create"></router-view>
    <dialogSyncNetwork
    v-if="openSyncDialog" 
    v-model="openSyncDialog"
    :isLoading="isLoading"
    @close="openSyncDialog = false" />
  </div>
</template>

<script>
import NetworkComposition from "./NetworkComposition";
import { onMounted, ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from 'vuex-composition-helpers';
import { NETWORKVPC } from './vpc/namespace';
import { AccessControl } from "@/lib/middleware";
import { SLB } from './slb/namespace';
import { VPN } from './vpn/namespace';
import dialogSyncNetwork from "./dialogSyncNetwork.vue";
import localstorage from "@/lib/localstorage";
export default {
  data() {
    return {
      showMenu: false,
      showAssign: false,
      more: false,
      x: 0,
      y: 0,
      event: "",
    };
  },
  methods: {
    show() {
      // e.preventDefault();
      this.showMenu = false;

      // this.x = this.e.clientX;
      // this.y = this.e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    },

    moreAction(e) {
      this.more = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.more = true;
      });
    },

    assign() {
      //e.preventDefault();
      this.showMenu = false;
      this.$nextTick(() => {
        this.showAssign = true;
      });
    },
  },
  components: { dialogSyncNetwork },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { vpcs, } = useNamespacedState(NETWORKVPC, ["vpcs"]);
    const { getListSlb } = useNamespacedGetters(SLB, ["getListSlb"])
    const { getListPfsense, getTotalRowsPfsense  } = useNamespacedGetters(VPN, ["getListPfsense", "getTotalRowsPfsense"])
    const { fetchPfsense } = useNamespacedActions(VPN, ["fetchPfsense"])
    const { fetchvpcs } = useNamespacedActions(NETWORKVPC, ["fetchvpcs"])
    const {
      loadbalances,
      floatingip,
      domains,
      // vpcs,
      deleteModal,
      editVpc,
    } = NetworkComposition();

    const openSyncDialog = ref(false);

    const user_role = localstorage.getItem("role");

    const openSyncDialogHandler = () => {
      openSyncDialog.value = true;
    };

    //	const isBalancePage = computed(() => this.$route.name === "loadbalance");
    function onEditVpc() {
      editVpc();
      this.$router.push("/network/vpc/edit");
    }
    const buttonCreate = ref(false)

    const path = ref('')
    watch(() => context.root.$route.path, (newVal) => {
      if(newVal == '/network/vpc'){
        path.value = '/network/vpc/create'
      }else if(newVal == '/network/slb'){
        path.value = '/network/slb/create'
      }else if(newVal == '/network/vpn'){
        path.value = '/network/vpn/create'
      }else{
        path.value = ''
      }
    })

    let currentProj = JSON.parse(localStorage.getItem('currentProj'))
    const showBtnVpn = ref(false)
    onMounted(async() => {
      // await FETCH_VPC()
      await fetchvpcs()
      await fetchPfsense({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        projek: currentProj.openstack_project_id
      })

      if(getTotalRowsPfsense.value){
        let filterVpc
        // getListPfsense.value.forEach( pf => {
        //   filterVpc = vpcs.value.filter(a => a.name != pf.existing_vpc_name)
        // })
        filterVpc = vpcs.value.filter( pf => {
          return !getListPfsense.value.some(a => a.existing_vpc_name == pf.name && a.status != 'FAILED')
        })
        if(filterVpc.length){
          showBtnVpn.value = true
        }else{
          showBtnVpn.value = false
        }
      }else{
        showBtnVpn.value = false
      }

      if(context.root.$route.path == '/network/vpc'){
        path.value = '/network/vpc/create'
      }else if(context.root.$route.path == '/network/slb'){
        path.value = '/network/slb/create'
      }else if(context.root.$route.path == '/network/vpn'){
        path.value = '/network/vpn/create'
      }else{
        path.value = ''
      }
    })

    return {
      read_only,
      user_role,

      deleteModal,
      loadbalances,
      floatingip,
      domains,
      vpcs,
      // vpcs: ref([1, 2]),
      onEditVpc,
      path,
      buttonCreate,
      getListSlb,
      getListPfsense,
      showBtnVpn,
      openSyncDialog,
      openSyncDialogHandler,
      //	isBalancePage,
    };
  },
};
</script>

<style scoped>
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
.list {
  cursor: pointer;
}

.v-btn {
  height: 45px !important;
}
.menu-title {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  color: #556272;
}

.project-list {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 19px;
  color: #556272;
}
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
</style>

<style lang="scss" scoped>
[role="menu"] {
  box-shadow: none;
  &::before {
    content: url('~@/assets/tri.png');
    position: relative;
    left: 5px;
  }
  // .v-list {
  //   border-radius: 5px;
  //   margin: -8px 2px 2px 2px;
  //   box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  // }
}
td {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
</style>
