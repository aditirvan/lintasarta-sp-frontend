<template>
<div>
  <v-card class="rounded-lg pa-7" flat>
    <v-data-table
      v-if="true"
      :headers="headers"
      :items="getListBe"
      :items-per-page="10"
      :options.sync="options"
      :server-items-length="getTotalRowsBe"
      class="elevation-0"
      hide-default-footer
      >
      <template v-slot:item.adv_check="{ item }">
        <div v-if="item.servers != null && item.servers.length && item.mode == 'tcp'">
          <span v-for="server in item.servers" :key="server.id">
            {{ server.server_address+ ':'+ server.server_port+item.http_check_uri + (item.mode == 'tcp' ? '/' : '') }} <br />
          </span>
        </div>
        <div v-else-if="item.servers != null && item.mode == 'http'">
          <span>
            {{ item.http_check_uri }} <br />
          </span>
        </div>
        <span v-else-if="item.servers == null">
          -
        </span>
      </template>
      <template v-slot:item.balance_algorithm="{ item }">
        <span>
          {{ item.balance_algorithm | kapitalisasiKata }}
        </span>
      </template>
      <template v-slot:item.mode="{ item }">
        <span>
          {{ item.mode | hurufGede }}
        </span>
      </template>
      <template v-slot:item.loging_mode="{ item }">
        <span>
          {{ item.loging_mode | hurufGede }}
        </span>
      </template>
      <template v-slot:item.action="{ item }">
        <span
          class="primary--text edit"
          @click="
          () => {
            editBe(item)
          }
          "
          >Edit</span>
        <span
          class="error--text pr-3 delete ml-4"
          @click="
          () => {
            opendialogdelete = true
            selectedItem = item
            head = 'be'
          }
          "
          >Delete</span>
        </template>
        <template v-slot:item.servers="{ item }">
          <table class="table-ip" style="border-bottom:none;" v-if="item.servers != null && item.servers.length <2">
            <div v-for="server in item.servers"  :key="server.id">
              <tr>
                <td style="padding-top: 0 !important;padding-bottom: 0 !important">Server Name</td>
                <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ server.server_name }}</td>
              </tr>
              <tr>
                <td style="padding-top: 0 !important;padding-bottom: 0 !important">HTTP Address</td>
                <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ server.server_address }}</td>
              </tr>
              <tr>
                <td style="padding-top: 0 !important;padding-bottom: 0 !important">HTTP Port</td>
                <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ server.server_port }}</td>
              </tr>
            </div>
          </table>
          <span v-else-if="item.servers == null">
            -
          </span>
          <span 
          v-else
          @click="seeAll(item.servers, 'servers')"
          class="primary--text text-decoration-underline" 
          style="cursor: pointer">
            See all Servers
          </span>
        </template>
        <template v-slot:footer="{ props }">
            <custom-footer-datatable 
            @input="
              (val) => {
                options = val;
              }
            " 
            :props="props" />
        </template>
    </v-data-table>
    <v-card flat outlined class="rounded-lg" v-else>
      <v-row>
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
              Looks like you don’t have any Backend
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
                    to="#"
                    >
                    Create Backend
                    </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
  <dialogDelete
  v-if="opendialogdelete == true"
  v-model="opendialogdelete"
  :dataValue="selectedItem"
  :head="head"
  :textDelete="textDelete"
  @close="opendialogdelete = false"
  @deleteText="textDelete = $event"
  @delete="doDelete"
  @refreshTable="refreshTab"
  />

  <dialogAll
  v-if="opendialogAll == true"
  v-model="opendialogAll"
  :item="itemData"
  :type="type"
  />
</div>
</template>

<script>
import { onMounted, ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { SLB } from "../namespace"
import dialogDelete from "./dialogDelete";
import dialogAll from './dialogAll.vue'

export default {
  components: { dialogDelete, dialogAll },
  setup(props, context) {
    const be = ref([])
    const opendialogdelete = ref(false)
    const opendialogAll= ref(false)
    const selectedItem = ref(null)
    const head = ref('')
    const textDelete = ref('')
    const itemData = ref([])
    const type = ref('')

    const { fetchBe, deleteBe } = useNamespacedActions(SLB, ["fetchBe", "deleteBe"])
    const { getListBe, getTotalRowsBe } = useNamespacedGetters(SLB, ["getListBe", "getTotalRowsBe",])

    const headers = ref([
      { text: "Name", value: "backend_name", sortable: false },
      { text: "Method", value: "balance_algorithm", sortable: false },
      { text: "Mode", value: "mode", sortable: false},
      { text: "Log Mode", value: "mode", sortable: false},
      { text: "URI", value: "adv_check", sortable: false},
      { text: "Server", value: "servers", sortable: false},
      { text: "Action", value: "action", align: "center", sortable: false},
    ]);

    const slb_id = localStorage.getItem('slb_id')
    const options = ref({
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      slb_id: slb_id
    })

    const editBe = (item) => {
      localStorage.setItem('be', JSON.stringify(item))
      context.root.$router.push('/network/slb/config/backend/edit')
    }
    
    const doDelete = async() => {
      let payload = {
        slb_id: selectedItem.value.slb_id,
        config_name: selectedItem.value.backend_name
      }
      let resp = await deleteBe(payload)
      if(resp.status == 200){
        refreshTab()
        opendialogdelete.value = false
        textDelete.value = ''
      }else{
        console.log(resp)
      }

    }

    const refreshTab = async() => {
      options.value.page = 1
      await fetchBe(options.value)
    }

    const seeAll = (item, tipe) => {
      
      if(tipe == 'servers'){
        let data = []
        data = item.map((x) => {
          return{
            server_name: x.server_name,
            server_address: x.server_address,
            server_port: x.server_port
          }
        })
        itemData.value = data
      }else{
        itemData.value = item.servers
      }
      type.value = tipe
      opendialogAll.value = true
    }

    watch(options,async (val) => {
      try {
          await fetchBe(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );

    onMounted(() => {

    })

    return {
      be,
      headers,
      options,
      getListBe,
      getTotalRowsBe,
      opendialogdelete,
      selectedItem,
      head,
      textDelete,
      editBe,
      doDelete,
      opendialogAll,
      itemData,
      type,
      refreshTab,
      seeAll
    }
  },
  filters:{
    kapitalisasiKata (str)
    {
    return str.replace(/\w\S*/g, function(kata){ 
      const kataBaru = kata.slice(0,1).toUpperCase() + kata.substr(1);
      return kataBaru
      });
    },
    hurufGede (str){
      return str.toUpperCase()
    }
  }
}
</script>


<style scoped>
.v-btn {
  height: 55px !important;
}
</style>