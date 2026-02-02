<template>
<div>
  <v-card class="rounded-lg pa-7" flat>
    <v-data-table
    v-if="true"
    :headers="headers"
    :items="getListFe"
    :items-per-page="10"
    :options.sync="options"
    :server-items-length="getTotalRowsFe"
    class="elevation-0"
    hide-default-footer
    >

      <template v-slot:item.acl="{ item }">
        <table class="table-ip" style="border-bottom:none;" v-if="item.rules.length == 1">
          <div v-for="rule in item.rules"  :key="rule.id">
            <tr>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important">Backend Name</td>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ rule.backend_name }}</td>
            </tr>
            <tr>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important">Switch Rule</td>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ rule.switching_rule_cond }}</td>
            </tr>
            <tr>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important">Acl</td>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ rule.name }}</td>
            </tr>
            <tr>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important">Criteria</td>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ rule.criterion }}</td>
            </tr>
            <tr>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important">Value</td>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ rule.acl_value }}</td>
            </tr>
          </div>
        </table>
        <span v-else-if="!item.rules.length">
          -
        </span>
        <span 
        v-else
        @click="seeAll(item.rules, 'acl')"
        class="primary--text text-decoration-underline" 
        style="cursor: pointer">
          See all Advanced ACL
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

      <!-- <template v-slot:item.switch_rule="{ item }">
        <table class="table-ip" style="border-bottom:none;" v-if="item.rules != null && item.rules.length <2">
          <div v-for="rule in item.rules"  :key="rule.id">
            <tr>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important">Backend Name</td>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ rule.backend_name }}</td>
            </tr>
            <tr>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important">Switch Rule</td>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ rule.switching_rule_cond }}</td>
            </tr>
            <tr>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important">Acl</td>
              <td style="padding-top: 0 !important;padding-bottom: 0 !important"><span class="mx-2">:</span> {{ rule.name }}</td>
            </tr>
          </div>
        </table>
        <span v-else-if="item.rules == null">
          -
        </span>
        <span
        v-else
        @click="seeAll(item.rules, 'sbr')"
        class="primary--text text-decoration-underline" 
        style="cursor: pointer">
          See all Switch Backend Rule
        </span>
      </template> -->
      <template v-slot:item.action="{ item }">
        <span
          class="primary--text edit"
          @click="
          () => {
            editFe(item)
          }
          "
          >Edit</span>
        <span
        class="error--text pr-3 delete ml-4"
        @click="
        () => {
          opendialogdelete = true
          selectedItem = item
          head = 'fe'
        }
        "
        >Delete</span
        >
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
              Looks like you don’t have any Frontend
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
                    to="/network/slb/config/frontend/create"
                    >
                    Create Frontend
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
import { ref, watch } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { SLB } from "../namespace"
import dialogDelete from "./dialogDelete";
import dialogAll from './dialogAll.vue'

export default {
  components: { dialogDelete, dialogAll },
    setup(props, context) {
      const fe = ref([])
      const opendialogdelete = ref(false)
      const opendialogAll= ref(false)
      const selectedItem = ref(null)
      const head = ref('')
      const textDelete = ref('')
      const itemData = ref([])
      const type = ref('')
      const headers = ref([
        { text: "Name", value: "frontend_name", sortable: false },
        { text: "Address", value: "bind_address", sortable: false},
        { text: "Port", value: "bind_port", sortable: false},
        { text: "Mode", value: "mode", sortable: false},
        // { text: "Log Mode", value: "loging_mode", },
        // { text: "Redirect HTTPS", value: "is_redirect_https", width: 150 },
        { text: "Default Backend", value: "default_backend", sortable: false},
        { text: "Advanced ACL", value: "acl", sortable: false},
        // { text: "Switch Backend Rule", value: "switch_rule", width: 320 },
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

    const { fetchFe, deleteFe } = useNamespacedActions(SLB, ["fetchFe", "deleteFe"])
    const { getListFe, getTotalRowsFe } = useNamespacedGetters(SLB, ["getListFe", "getTotalRowsFe",])

    const editFe = (item) => {
      localStorage.setItem('fe', JSON.stringify(item))
      context.root.$router.push('/network/slb/config/frontend/edit')
    }

    const doDelete = async() => {
      let payload = {
        slb_id: selectedItem.value.slb_id,
        config_name: selectedItem.value.frontend_name
      }
      let resp = await deleteFe(payload)
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
      await fetchFe(options.value)
    }

    const seeAll = (item, tipe) => {
      let data = []
      if(tipe == 'acl'){
        data = item.map((x) => {
          return{
            acl_value: x.name,
            criterion: x.criterion,
            value: x.acl_value,
            backend_name: x.backend_name,
            switch_rule: x.switching_rule_cond,
          }
        })
      }
      // else if(tipe == 'sbr'){
      //   data = item.map((x) => {
      //     return{
      //       backend_name: x.backend_name,
      //       switch_rule: x.switching_rule_cond,
      //       acl_value: x.name
      //     }
      //   })
      // }
      itemData.value = data
      type.value = tipe
      opendialogAll.value = true
    }

    watch(options,async (val) => {
      try {
          await fetchFe(val)
      } finally {
          // loading.value = false;
      }
    },
      { deep: true }
    );
    
      return {
        fe,
        headers,
        options,
        getListFe,
        getTotalRowsFe,
        opendialogdelete,
        opendialogAll,
        selectedItem,
        head,
        textDelete,
        doDelete,
        editFe,
        refreshTab,
        seeAll,
        itemData,
        type,
      }
  },
  filters:{
    hurufGede (str)
    {
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