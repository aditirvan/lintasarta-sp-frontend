<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row>
              <v-col cols="9">
                <div class="firewall-title mt-2">Deka Harbor</div>
              </v-col>
              <v-col cols="3" class="text-right">
                  <v-btn
                    style="height: 45px; width: 150px; font-size: 12px"
                    class="secondary"
                    depressed
                    v-if="getListCLuster.length"
                    @click="() =>{
                      validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                        to_create()
                      });
                    }"
                    >Create Cluster</v-btn
                  >
              </v-col>
            </v-row>
            <br />
            <v-data-table
            v-if="getListCLuster.length"
            :headers="headersCluster"
            :options.sync="options"
            :items="getListCLuster"
            :items-per-page="10"
            :server-items-length="getTRCluster"
            class="elevation-0"
            hide-default-footer
            >
              <template v-slot:item.master="{ item }">
                <div>
                  {{ filterNameFlavor(item.flavor_master) + ' / ' + item.total_master +' node'  }}
                </div>
              </template>
              <template v-slot:item.worker="{ item }">
                <div>
                  {{ (item.total_worker+item.total_master) +' nodes'  }}
                </div>
              </template>
              <template v-slot:item.status="{ item }">
                <span
                class="black--text"
                :class="{
                  'success--text': item.status == 'CREATED',
                  'error--text' : item.status == 'FAILED',
                  'grey--text' : item.status == 'ON-PROGRESS' 
                  }"
                >{{ item.status }}</span>
              </template>
              <template v-slot:item.action="{ item }">
                <popupquote
                v-model="item.open"
                :offsetTop="20"
                :documentid="'popup' + item.id"
                offset-y
                allow-overflow
                >
                    <template v-slot:activator="{ on, attrs }">
                      <label v-if="item.status == 'ON-PROGRESS'" class="grey--text">
                        More
                          <v-icon>
                          mdi-chevron-down
                        </v-icon>
                      </label>
                      <label
                        v-else
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
                            rotate: item.open,
                        }"
                        :id="'popup' + item.id"
                        color="primary"
                        >mdi-chevron-down</v-icon
                        >
                        </label>
                    </template>
                    <v-list>  

                      <v-list-item
                      v-if="item.status == 'CREATED'"
                      style="cursor:pointer"
                      @click="() => {
                        validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                          to_link(item.dashboard_url)
                        })
                      }"
                      >
                        <v-list-item-title class="mr-4 edit">Kubernetes Dashboard</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-else>
                        <v-list-item-title style="color: rgb(0 0 0 / 38%)" class="mr-4">Kubernetes Dashboard</v-list-item-title>
                      </v-list-item>

                      <!-- <v-list-item
                      v-if="item.status == 'CREATED'"
                      style="cursor:pointer"
                      @click="downloadConfig({harbor_id: item.id})"
                      >
                        <v-list-item-title class="mr-4 edit">Kubernetes Config</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-else>
                        <v-list-item-title style="color: rgb(0 0 0 / 38%)" class="mr-4">Kubernetes Config</v-list-item-title>
                      </v-list-item> -->

                      <v-list-item
                      v-if="item.status == 'CREATED'"
                      style="cursor:pointer;"
                      @click="
                        () => {
                          toDetail(item)
                        }
                      ">
                        <v-list-item-title class="">Detail</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-else>
                        <v-list-item-title style="color: rgb(0 0 0 / 38%)" class="mr-4">Detail</v-list-item-title>
                      </v-list-item>

                      <v-list-item style="min-height: 1px; margin-left: -16px; margin-right: -16px">
                        <v-divider style="min-width: 160px" />
                      </v-list-item>

                      <v-list-item
                        @click="
                        () => {
                          validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                            selectedItem = item
                            openDialogDelete = true
                          });                         
                        }
                        ">
                          <v-list-item-title class="error--text"> Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                </popupquote>
              </template>
              <template v-slot:footer="{ props }">
              <custom-footer-datatable
              @input="
              (val) => {
                options = val ;
              }
              "
              :props="props"/>
            </template>
            </v-data-table>
            <v-card flat outlined class="rounded-lg" v-else>
              <v-col md="12">
                <v-card
                  flat
                  class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
                >
                  <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                    <p
                      style="
                        font-size: 16px;
                        margin-bottom: 10px;
                        text-transform: capitalize;
                      "
                      class="font-weight-bold"
                    >
                      Looks like you don’t have any Deka Harbor Cluster
                    </p>
                    <v-row>
                      <v-col>
                        <p
                          style="
                            font-size: 12px;
                            color: #a5b3bf;
                            margin-bottom: 20px;
                          "
                        >
                          
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-btn
                          width="100%"
                          append
                          max-width="300"
                          height="50"
                          depressed
                          class="secondary"
                          exact
                          @click="() =>{
                            validateprivilages(['Deka Harbor', 'editor', true]).then(() => {
                              to_create()
                            });
                          }"
                        >
                          Create Cluster
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-card>

            <create-worker
            v-if="openDialogCreateWorker"
            v-model="openDialogCreateWorker"
            :selectedItem="itemselected"
            :header="headerDialog"
            />

            <dialog-delete
            v-if="openDialogDelete"
            v-model="openDialogDelete"
            :itemSelected="selectedItem"
            :header="'Harbor'"
            @refreshTable="refreshTable"
            />

          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted, ref, watch } from '@vue/composition-api'
import createWorker from './create-worker.vue'
import dialogDelete from './dialog-delete.vue'
import { HARBOR } from './namespace'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'

export default {
  components:{
    createWorker,
    dialogDelete
  },
  setup(props, context) {
    const { fetchCluster, downloadConfig } = useNamespacedActions(HARBOR, ["fetchCluster", "downloadConfig"])
    const { getListCLuster, getTRCluster } = useNamespacedGetters(HARBOR, ["getListCLuster", "getTRCluster"])
    const {
        validateprivilages,
      } = useNamespacedActions("HOMEPAGE", [
        "validateprivilages",
      ]);
    const currentProj = JSON.parse(localStorage.getItem('currentProj'))
    
    const selectedItem = ref()
    const headersCluster = ref([
      { text: "Name", value: "name",  },
      // { text: "Flavor", value: "master",  },
      { text: "Version", value: "version",  },
      { text: "Zone", value: "zone_name",  },
      { text: "Nodes", value: "worker",  },
      { text: "Status", value: "status",  },
      { text: "Action", sortable: false, align: "center", value: "action" }
    ])
    const clusters = ref([
      { name: 'Harbor-dumy', master: { flavor: '2vcpu/2ram', node: 3}, worker: { flavor: '2 VCPU/2GB RAM', node: 2 }, status: 'CREATED' }
    ])

    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      projek: currentProj.openstack_project_id
    })

    watch(options,async (val) => {
      try {
        await fetchCluster(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const openDialogCreateWorker = ref(false)
    const openDialogDelete = ref(false)
    const itemselected = ref()
    const headerDialog = ref()

    const toDetail = (item) => {
      localStorage.setItem('slb_id', item.slb_id)
      context.root.$router.push(`/harbor/detail/${item.id}`); 
    }

    const to_link = (link) => {
      // console.log(link)
      window.open(link)
    }
    const to_create = () => {
      context.root.$router.push('/harbor/create-harbor')
    }

    const refreshTable = async() => {
      await fetchCluster({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        projek: currentProj.openstack_project_id
      })
    }

    const filterNameFlavor = (val) => {
      let name_flv = ''
      switch(val){
        case 'm1.small':
        name_flv = '1 VCPU/2GB RAM'
        break;
        case 'm1.medium':
          name_flv = '2 VCPU/4GB RAM'
          break;
        case 'm1.large':
          name_flv = '2 VCPU/8GB RAM'
          break
        case 'm1.xlarge':
          name_flv = '4 VCPU/16GB RAM'
          break
        case 'm1.2xlarge':
          name_flv = '8 VCPU/32GB RAM'
          break
        default:
          name_flv = val
      }
      return name_flv
    }

    onMounted(async() => {
      await fetchCluster(options.value)
    })

    return{
      headersCluster,
      clusters,
      itemselected,
      openDialogCreateWorker,
      headerDialog,
      openDialogDelete,
      options,
      getListCLuster,
      getTRCluster,
      filterNameFlavor,
      toDetail,
      to_link,
      selectedItem,
      refreshTable,
      validateprivilages,
      to_create,
      downloadConfig
    }
  },
}
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