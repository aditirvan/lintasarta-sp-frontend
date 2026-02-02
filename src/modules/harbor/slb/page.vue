<template>
  <div>
    <v-card
      v-if="!getListSlbById.length"
      flat
      class="pa-7 rounded-0 rounded-b-lg"
    >
      <v-row>
        <v-col md="12">
          <!-- <v-card
            flat
            outlined
            class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
            v-if="project.region != 'TKP-Banten 1' "
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
                For Your Information.
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
                  Sorry, currently the load balancer feature has not available at TBS-Jakarta 1.
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>-->
          
          <v-card
            flat
            outlined
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
                Looks like you don’t have any Load Balancers
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
                    Load Balancers let you distribute traffic between multiple
                    Instance and are a good way to horizontally scale your app.
                    They’re fully managed by Lintasarta—no set up or configuration
                    required.
                  </p>
                </v-col>
              </v-row>
              <!-- <v-row>
                <v-col v-if="!read_only">
                  <v-btn
                    width="100%"
                    append
                    max-width="300"
                    height="50"
                    depressed
                    class="secondary"
                    exact
                    to="/network/slb/create"
                  >
                    Create Load Balancer
                  </v-btn>
                </v-col>
              </v-row> -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- <div v-if="isLoading" class="d-flex justify-center">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div> -->

    <v-card v-else flat class="rounded-lg pa-7">
      <!-- <v-row>
        <v-col class="d-flex flex-row align-center justify-end pt-0 pb-4">
          <v-btn
            v-if="!read_only"
            depressed
            width="180"
            class="secondary"
            to="/network/slb/create"
          >
            <span class="fz-14">Create Load Balancer</span>
          </v-btn>
        </v-col>
      </v-row> -->
      <v-row>
        <v-col>
          <v-data-table
            :hide-default-footer="true"
            :headers="headers"
            :items-per-page="10"
            :items="getListSlbById"
            :options.sync="options"
            class="elevation-0"
          >
            <template v-slot:no-data>
              {{ getLoading ? "Loading.." : "No data available" }}
            </template>
            <template v-slot:item.ha_count="{ item }">
              {{item.ha_count == 1 ? "No" : "Yes"}}
            </template>
            <template v-slot:item.floating_ip_slb="{ item }">
              <div v-if="item.floating_ip_slb">
                <!-- <div v-for="instance in item.instance" :key="instance.id"> -->
                  <span>{{ item.floating_ip_slb }}</span><br />
                <!-- </div> -->
              </div>
              <div v-else>
                <span>-</span>
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
              <div>
                  <span
                  v-if="item.status == 'ON-PROGRESS' || item.status == 'FAILED'"
                  class="mr-4 grey--text"
                  >Configuration</span>

                  <span
                  v-else
                  style="cursor:pointer"
                  class="mr-4 primary--text edit"
                  @click="toConfigure(item.id, item)"
                  >Configuration</span>
                <!-- <v-btn
                text
                :disabled="item.status == 'ONPROGGRESS' || item.status == 'FAILED'"
                style="cursor:pointer; font-size: 13px"
                class=" primary--text edit px-0"
                @click="toConfigure(item.id, item)">Configure</v-btn> -->
                <span
                v-if="item.status == 'ON-PROGRESS' || item.origin == 'dkh'"
                class="grey--text"
                >Delete</span>

                <span
                v-else
                style="cursor:pointer;"
                class="error--text"
                @click="
                  () => {
                    validateprivilages(['Network', 'editor', true]).then(() => {
                      opendialogdeletedload = true
                      selectedLB = item
                    });
                  }
                "
                  >Delete</span>
                  <!-- <v-btn
                  text
                  :disabled="item.status == 'ONPROGGRESS'"
                  style="cursor:pointer; font-size: 13px"
                    class="error--text px-0"
                    @click="
                      () => {
                        opendialogdeletedload = true
                        selectedLB = item
                      }
                    ">Delete</v-btn> -->
              </div>
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
        </v-col>
      </v-row>
    </v-card>
    <dialogDeleteSlb
      v-if="opendialogdeletedload == true"
      v-model="opendialogdeletedload"
      :loadBalancer="selectedLB"
      :textDelete="textDelete"
      @close="opendialogdeletedload = false"
      @deleteText="textDelete = $event"
      @delete="doDelete"
      @refreshTable="refreshTab"
    />
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";

import { onMounted, reactive, ref, watch } from "@vue/composition-api";
import dialogDeleteSlb from "./dialogDeleteSlb";
import localstorage from "@/lib/localstorage";
import { SLB } from "../../network/slb/namespace"
import { AccessControl } from "@/lib/middleware";

export default {
  components: { dialogDeleteSlb },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Project Network'));
    const { harborid } = context.root._route.params;

    const selectedLB = ref(null);

    const disabledField = ref(false);
    const textDelete = ref('')

    const loadBalancers = ref([])

    const { fetchSlbById, deleteSlb } = useNamespacedActions(SLB, ["fetchSlbById", "deleteSlb"])
    const { getListSlbById, getTotalRowsSlb, getLoading } = useNamespacedGetters(SLB, ["getListSlbById", "getTotalRowsSlb", "getLoading"])
    const { listSlb, isLoading } = useNamespacedState(SLB, ["isLoading", "listSlb"])
    const {
        validateprivilages,
      } = useNamespacedActions("HOMEPAGE", [
        "validateprivilages",
      ]);

    const project = JSON.parse(localstorage.getItem("currentProj"));

    const headers = ref([
      { text: "Name", value: "slb_instance_name", sortable: false },
      { text: "Floating IP", value: "floating_ip_slb", align: "center", sortable: false },
      { text: "Flavor", value: "flavor", sortable: false },
      // { text: "High Availability", value: "ha_count", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", value: "action", align: "center", sortable: false },
    ]);

    const slb_id = localStorage.getItem('slb_id')
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      slb_id: slb_id
    })

    watch(options,async (val) => {
      try {
          await fetchSlbById(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    const dummyLb = ref([{
      name: 'SLB-Test',
      flavor: '2GB RAM',
      ha_count: 1,
    }])

    const toConfigure = (id, item) => {
      localStorage.setItem('slb_id', id)
      localstorage.setItem('slb', JSON.stringify(item))
      context.root.$router.push(`/harbor/detail/${harborid}/loadbalancer/config`);      
    }

    const opendialogdeletedload = ref(false)
    const doDelete = async () => {
      let payload = {
        id: selectedLB.value.id,
        status: selectedLB.value.status
      }
      let resp = await deleteSlb(payload)
      if(resp.status == 200){
        refreshTab()
        opendialogdeletedload.value = false
        textDelete.value = ''
      }else{
        console.log(resp)
      }
      
    }

    const refreshTab = async() => {
      await fetchSlbById(options.value)
    }

    onMounted(async () => {
      if(read_only.value){
        headers.value.pop()
      }

      await fetchSlbById(options.value)
    })

    return {
      read_only,
      disabledField,
      selectedLB,
      opendialogdeletedload,
      headers,
      loadBalancers,
      dummyLb,
      options,
      getLoading,
      getListSlbById,
      listSlb,
      getTotalRowsSlb,
      doDelete,
      refreshTab,
      isLoading,
      toConfigure,
      textDelete,
      project,
      validateprivilages
    };
  },
};
</script>

<style scoped>
.v-btn {
  height: 55px !important;
}
</style>
