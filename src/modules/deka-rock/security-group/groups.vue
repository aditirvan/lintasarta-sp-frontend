<template>
    <div>
       <v-row>
         <v-col cols="12">
           <v-card class="rounded-lg" flat>
             <v-container fluid class="px-7">
               <br />
               <v-data-table
                 v-if="security_groups.length"
                 :headers="table.headers"
                 :items="security_groups"
                 :items-per-page="10"
                 :server-items-length="paginate.itemsLength"
                 class="elevation-0"
                 hide-default-footer>
                 <template v-slot:item.total_instances="{ item }">
                   <div>
                     {{ item.total_instances > 1 ? item.total_instances > 1 ? `${item.total_instances} Instances` : `${item.total_instances} Instance` : "-" }}
                   </div>
                 </template>
                 <template  v-slot:item.action="{ item }">
                  <popupquote v-model="item.open" :offsetTop="20" :documentid="'popup' + item.id" offset-y allow-overflow>
                    <template v-slot:activator="{ on, attrs }">
                      <label
                        v-bind="attrs"
                        class="primary--text linkpointer"
                        style="position: relative; white-space: nowrap"
                        @click="
                          ($event) => {
                            on.click($event);
                          }">More
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
                      <v-list-item @click="() => {selectSecurityGroup(item)}">
                        <v-list-item-title>Detail</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </popupquote>
                 </template>
                 <template v-slot:footer="{ props }">
                  <custom-footer-datatable :props="props" 
                    v-if="security_groups.length"
                    @input="
                      (val) => {
                        options = val;
                        changePage(val);
                      }
                    "/>
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
                         Looks like you don’t have any Security Group
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
                             Manage access to the ports of your Instance with
                             security groups
                           </p>
                         </v-col>
                       </v-row>
                     </v-card-text>
                   </v-card>
                 </v-col>
               </v-card>
             </v-container>
           </v-card>
         </v-col>
       </v-row>
     </div>
 </template>
 
 <script>
   import { defineComponent, reactive, onMounted, ref, computed } from "@vue/composition-api";
   import {
     useNamespacedActions,
     useNamespacedState
   } from "vuex-composition-helpers";
   import { DEKAROCK } from "@/modules/deka-rock/namespace";
   
   export default defineComponent({
     setup(props,context) {
      const table = reactive({
        headers: [
          { text: "Name", value: "name" },
          { text: "Applied to", value: "total_instances" },
          { text: "Rules", value: "total_roles" },
          { text: "Action", sortable: false, align: "center", value: "action" }
        ]
      });
       
      const { getSecuritGroups } = useNamespacedActions(DEKAROCK, ["getSecuritGroups"]);
      const { security_groups, sec_gr_pagination } = useNamespacedState(DEKAROCK, ["security_groups", "sec_gr_pagination"]);

      const options = ref({});
      const paginate = computed({
        get: () => {
          return {
            itemsLength: sec_gr_pagination.value.total_data,
            pageCount: sec_gr_pagination.value.total_page,
            itemsPerPage: sec_gr_pagination.value.limit,
            page: sec_gr_pagination.value.page,  
          }
        }
      })

      function selectSecurityGroup(data, mode=null) {
        if (mode){
          this.$emit('set_mode', mode)
        }
        this.$emit('select', data);
      }

      const changePage = async (val) => {
        let params = {cluster_id:context.root.$route.params.id}
        let newPaginate = { page: val.page, limit: val.itemsPerPage }
        await getSecuritGroups({params:{...params, ...newPaginate}})
      };
      
      onMounted(async () => {
        let params = {cluster_id:context.root.$route.params.id}
        await getSecuritGroups({params:params})
      })
      return {
        table,
        getSecuritGroups,
        security_groups,
        paginate,
        options,
        
        changePage,
        selectSecurityGroup
      };
     },
   });
   </script>
   
   <style lang="scss">
   tbody {
     tr:hover {
       background-color: transparent !important;
     }
   }
   
   .edit,
   .delete {
     cursor: pointer;
   }
   
   .firewall-title {
     font-style: normal;
     font-weight: bold;
     font-size: 21px;
     line-height: 140%;
     color: #556272;
   }
   </style>
   