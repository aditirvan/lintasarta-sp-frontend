<template>
    <v-container fluid class="pa-7">
      <v-row>
        <v-card class="rounded-lg" flat>
          <v-container fluid class="ps-3">
            <div style="color: #556272;margin-bottom:3px; text-align: center; font-weight: 800; font-size: 28px; line-height: 36px; letter-spacing: 0.04em; font-family: &quot;Fira sans&quot;; font-style: normal;">{{ security_group.name }}</div>
          </v-container>
        </v-card>
      </v-row>
      <hr width="500px;" size="1" style="border-color: rgba(0, 0, 0, 0.12); max-width: 100%;">
      <v-row class="pb-5">
        <v-col class="d-flex flex-row align-center">
          <div class="title">Inbound Rule</div>
          <v-spacer />
          <!-- <v-btn style="height: 45px; width: 150px" class="success" depressed @click="() => {toEdit()}">
            Edit Rule
          </v-btn> -->
          <v-btn style="height: 45px; width: 150px" class="success" depressed @click="() => {
            selectedRole = null
            editDialog = true
            direction = 'ingress'
          }">
            New Rule
          </v-btn>
          <v-btn style="height: 45px; width: 150px; margin-left: 10px;" depressed color="accent" @click="() => {selectSecurityGroup(null)}">
            Back
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table
        :headers="rules_header"
        :items="security_group_roles_ingress"
        :items-per-page="10"
        :server-items-length="inPaginate.itemsLength"
        class="elevation-0"
        hide-default-footer>
        <template v-slot:item.range="{ item }">
          <div style="display:inline-block;width:75px;margin-right:1rem;">
            <v-badge
              :content="`Min: ${item.port_range_min ? item.port_range_min : 'Any'}`"
              color="blue"
            ></v-badge>
          </div>
          <div style="display:inline-block;width:75px;margin-right:1rem;">
            <v-badge
              :content="`Max: ${item.port_range_max ? item.port_range_max : 'Any'}`"
              color="red"
            ></v-badge>
          </div>
        </template>
        <template v-slot:item.protocol="{ item }">
          <span> {{ item.protocol ? item.protocol.toUpperCase() : 'Any'  }} </span>
        </template>
        <template v-slot:item.remote_ip_prefix="{ item }">
          <span> {{ item.remote_ip_prefix ? item.remote_ip_prefix : 'Any'  }} </span>
        </template>
        <template v-slot:item.action="{ item }">
          <div>
            <span class="primary--text edit" @click="() => {
              selectedRole = item
              editDialog = true
            }">Edit</span>
            <span class="error--text delete ml-4" 
            @click="() => {
              selectedRole = item
              deleteDialog = true
            }">Delete</span>
          </div>
        </template>
        <!-- <template v-slot:item.type="{ item }">
            <span v-if="item.type == 'tcp'">Custom TCP Rule</span>
            <span v-else-if="item.type == 'udp'">Custom UDP Rule</span>
            <span v-else-if="item.type == 'icmp'">All ICMP Rule</span>
            <span v-else>{{ item.type }}</span>
        </template> -->
        <!-- <template v-slot:item.sources="{ item }">
          <div>
            {{ item.sources ? item.sources : 'Any' }}
          </div>
        </template> -->
        <template v-slot:footer="{ props }">
          <custom-footer-datatable :props="props" 
            v-if="security_group_roles_ingress.length"
            @input="
              (val) => {
                inOptions = val;
                changePage(getIngress, val);
              }
            "/>
        </template>
      </v-data-table>
      <div style="width: auto; height: 28px" />
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <div class="title">Outbound Rule</div>
          <v-spacer />
          <v-btn 
            style="height: 45px; width: 150px" 
            class="success" 
            depressed 
            @click="() => {
              selectedRole = null
              editDialog = true
              direction = 'egress'
            }">New Rule
          </v-btn>
        </v-col>
      </v-row>
      <div style="width: auto; height: 28px" />
  
      <v-data-table
        :headers="rules_header"
        :items="security_group_roles_egress"
        :items-per-page="10"
        :server-items-length="outPaginate.itemsLength"
        class="elevation-0 mb-4"
        hide-default-footer
      >
      <template v-slot:item.range="{ item }">
          <div style="display:inline-block;width:75px;margin-right:1rem;">
            <v-badge
              :content="`Min: ${item.port_range_min ? item.port_range_min : 'Any'}`"
              color="blue"
            ></v-badge>
          </div>
          <div style="display:inline-block;width:75px;margin-right:1rem;">
            <v-badge
              :content="`Max: ${item.port_range_max ? item.port_range_max : 'Any'}`"
              color="red"
            ></v-badge>
          </div>
        </template>
        <template v-slot:item.protocol="{ item }">
          <span> {{ item.protocol ? item.protocol.toUpperCase() : 'Any'  }} </span>
        </template>
        <template v-slot:item.action="{ item }">
          <div>
            <span class="primary--text edit" @click="() => {
              selectedRole = item
              editDialog = true
            }">Edit</span>
            <span class="error--text delete ml-4"
            @click="() => {
              selectedRole = item
              deleteDialog = true
            }"
            >Delete</span>
          </div>
        </template>
        <!-- <template v-slot:item.type="{ item }">
            <span v-if="item.type == 'tcp'">Custom TCP Rule</span>
            <span v-else-if="item.type == 'udp'">Custom UDP Rule</span>
            <span v-else-if="item.type == 'icmp'">All ICMP Rule</span>
            <span v-else>{{ item.type }}</span>
        </template> -->
        <!-- <template v-slot:item.sources="{ item }">
          <div>
            {{ item.sources ? item.sources : 'Any' }}
          </div>
        </template> -->
        <template v-slot:footer="{ props }">
          <custom-footer-datatable :props="props" 
            v-if="security_group_roles_egress.length"
            @input="
              (val) => {
                outOptions = val;
                changePage(getEggress, val);
              }
            "/>
        </template>
      </v-data-table>
      <v-row class="pt-5">
        <v-spacer />
        
      </v-row>
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card>
          <v-card-title>
            <div class="headline font-weight-bold font--text pb-4">Delete this rule ?</div>
          </v-card-title>
          <v-card-text class="pb-0">
            <p>Port will be not accessible. Are you sure?</p>
          </v-card-text>
          <v-card-actions>
            <v-row class="ma-2">
              <v-col cols="6">
                <v-btn color="accent" block depressed height="50" @click="deleteDialog = false"> Cancel </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="error"
                  block
                  height="50"
                  @click="
                    () => {
                      doDeleteRole();
                    }
                  "
                  depressed
                >
                  Yes
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <dialogDetail :value="editDialog" v-model="editDialog" :selected_role="selectedRole" :selected_group="security_group" :direction="direction"/>
    </v-container>
  </template>
  
  <script>
  import { reactive, ref, onMounted, computed } from "@vue/composition-api";
  import { DEKAROCK } from "@/modules/deka-rock/namespace";
  import dialogDetail from "./dialogDetail.vue";

  import {
     useNamespacedActions,
     useNamespacedState
   } from "vuex-composition-helpers";
import { async } from "rxjs";
  
  export default {
    props: ['security_group'],
    components: {
      dialogDetail
    },
    setup(props, context) {
      const { getSecuritGroupRoles, deleteSecuritGroupRole } = useNamespacedActions(DEKAROCK, ["getSecuritGroupRoles", "deleteSecuritGroupRole"]);
      const { security_group_roles_ingress, security_group_roles_egress, sec_ingress_pagination, sec_egress_pagination } = useNamespacedState(DEKAROCK, [
        "security_group_roles_ingress", "security_group_roles_egress", "sec_ingress_pagination", "sec_egress_pagination"
      ]);

      const editDialog = ref(false);
      const deleteDialog = ref(false);
      const selectedRole = ref(null);
      const inOptions = ref({});
      const outOptions = ref({});
      const direction = ref("ingress");

      const inPaginate = computed({
        get: () => {
          return {
            itemsLength: sec_ingress_pagination.value.total_data,
            pageCount: sec_ingress_pagination.value.total_page,
            itemsPerPage: sec_ingress_pagination.value.limit,
            page: sec_ingress_pagination.value.page,  
          }
        }
      })
      const outPaginate = computed({
        get: () => {
          return {
            itemsLength: sec_egress_pagination.value.total_data,
            pageCount: sec_egress_pagination.value.total_page,
            itemsPerPage: sec_egress_pagination.value.limit,
            page: sec_egress_pagination.value.page,  
          }
        }
      })

      function selectSecurityGroup(data) {
        this.$emit('select', data);
      }

      function toEdit() {
        this.$emit('set_mode', 'edit');
      }
      
      const rules_header = reactive([
          { text: "Protocol", value: "protocol", width: '120px'},
          { text: "Ethertype", value: "ethertype", width: '120px'},
          { text: "Port Range", value: "range", width: '250px'},
          { text: "Source", value: "remote_ip_prefix"},
          { text: "Description", value: "description"},
          { text: "Action", sortable: false, align: "center", value: "action" }
      ]);

      async function getIngress(paginate=null){
        let params = {cluster_id:context.root.$route.params.id, security_group_id: props.security_group.id, 'direction': 'ingress'}
        if (paginate){
          params = {...params, ...paginate}
        }
        await getSecuritGroupRoles({params:params})
      }

      async function getEggress(paginate=null){
        let params = {cluster_id:context.root.$route.params.id, security_group_id: props.security_group.id, 'direction': 'egress'}
        if (paginate){
          params = {...params, ...paginate}
        }
        await getSecuritGroupRoles({params:params})
      }

      const changePage = async (func, val) => {
        await func({ page: val.page, limit: val.itemsPerPage } )
      };

      const doDeleteRole = async () => {
        console.log(selectedRole)
        await deleteSecuritGroupRole(selectedRole.value.id)
        if (selectedRole.value.direction == 'ingress'){
          await getIngress()
        }else if (selectedRole.value.direction == 'egress'){
          await getEggress()
        }
        deleteDialog.value = false
      }

      onMounted(async () => {
        await getIngress()
        await getEggress()
      })
  
      return {
        selectSecurityGroup,
        toEdit,
  
        rules_header,
        security_group_roles_ingress,
        security_group_roles_egress,
        inPaginate, 
        outPaginate,
        selectedRole,
        
        getIngress,
        getEggress,
        changePage,
        doDeleteRole,
        
        editDialog,
        deleteDialog,
        direction,

        inOptions,
        outOptions
      };
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .title {
    font-style: normal;
    font-weight: bold;
    font-size: 21px;
    line-height: 140%;
    color: #556272;
  }
  .v-data-table {
    ::v-deep table {
      border-bottom: 1px solid #e0e0e0;
    }
  }
  </style>