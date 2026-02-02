<template>
    <v-card flat class="rounded-lg pa-4 mt-3">
     <v-card-text class="d-flex flex-row align-center">
        <v-row>
            <v-col class="d-flex flex-row align-center">
              <p class="mb-0 font-weight-bold fz-21">Manage Server Group</p>
              <v-spacer />

              <div style="height: auto; width: 30px" />            
              <v-btn
                v-if="!read_only && (user_role === 'Superadmin' || user_role === 'Owner')"
                id="CreateServerGroup"
                depressed
                height="50"
                width="150"
                class="secondary"
                @click="
                  () => {
                    selectedServerGroup = null
                    openDialogAdd = true
                  }
                "
              >
                <span class="fz-14">Create Server Group</span>
              </v-btn>
            </v-col>
        </v-row>
      </v-card-text>
     <v-card-text>
        <v-row>
            <v-col>
              <v-data-table
                id="my-table"
                hide-default-footer
                :headers="headers"
                :items-per-page="servergroupPaginator.limit"
                :search="search"
                :items="servergroupByProject"
                :options.sync="options"
                class="table-servergroup"
              >                                   
                <template v-slot:item.action="{ item }">
                  <popupquote
                  v-model="item.open"
                  :offsetTop="20"
                  :documentid="'popup' + item.id"
                  offset-y
                  allow-overflow
                >
                  <template v-slot:activator="{ on, attrs }">
                    <label
                      v-bind="attrs"
                      class="primary--text linkpointer"
                      style="position: relative; white-space: nowrap"
                      @click="
                        ($event) => {
                          on.click($event);                        
                          show($event, item);                        
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
                    <!-- <v-list-item
                      v-if="!read_only"
                      @click="
                        () => {
                          selectedServerGroup = item
                          openDialogAdd = true
                        }
                      "
                    >
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item> -->
                    <v-list-item
                      v-if="!read_only"
                      @click="
                        () => {
                          selectedServerGroup = item
                          openDialogDetail = true
                        }
                      "
                    >
                      <v-list-item-title>Detail</v-list-item-title>
                    </v-list-item>                                    
                    <v-list-item
                      style="min-height: 1px; margin-left: -16px; margin-right: -16px"
                    >
                      <v-divider style="min-width: 160px" />
                    </v-list-item>
                    <v-list-item
                      v-if="!read_only && (user_role === 'Superadmin' || user_role === 'Owner')"
                      @click="
                        () => {
                          selectedServerGroup = item
                          openDialogDelete = true
                        }
                      "                    
                    >
                      <v-list-item-title class="error--text">Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>                
                </popupquote>                
                </template>
                <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                    @input="
                      (val) => {
                        options = { ...options, ...val };
                      }
                    "
                    :props="props"
                  />
                </template>
              </v-data-table>
            </v-col>
        </v-row>
      </v-card-text>
      <dialogAdd
        v-model="openDialogAdd"
        :selectedServerGroup="selectedServerGroup"
        @create="(payload) => doCreate(payload)"
      />    

      <dialogDetail
        v-model="openDialogDetail"
        :item="selectedServerGroup"
      />

      <dialogDelete
        v-model="openDialogDelete"
        :selectedServerGroup="selectedServerGroup"
        @delete="(payload) => doDelete(payload)"
      />

    </v-card>
  </template>
  <script lang="ts">
  import { defineComponent, ref, Ref, watch, onMounted } from "@vue/composition-api";
  import dialogAdd from "./dialogAdd.vue";
  import dialogDetail from "./dialogDetail.vue";
  import dialogDelete from "./dialogDelete.vue";
  import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
  import { SERVERGROUP } from '../servergroup/namespace'
  import localstorage from "@/lib/localstorage";
  import { AccessControl } from "../../../lib/middleware";
  export default defineComponent({
    components: {
      dialogAdd,
      dialogDetail,
      dialogDelete,
    },
    setup(props,  { root }) {
      const access_control = new AccessControl(root.$store);
      const read_only = ref(access_control.is_read_mode('Project Instance'));
      const servergroupselectedvalue: Ref<any> = ref("");

      const user_role = localstorage.getItem("role");

      const headers = ref([
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Policy',
          value: 'policy_name',
        },
        {
          text: 'Action',
          value: 'action',
        },
      ])        
      const {
        servergroupByProject,
        servergroupPaginator,
      } = useNamespacedState(SERVERGROUP, [
        'servergroupByProject',
        'servergroupPaginator',
      ])
      const {
        fetchServerGroupByProject,
        createServerGroup,
        deleteServerGroup,
      } = useNamespacedActions(SERVERGROUP, [
        'fetchServerGroupByProject',
        'createServerGroup',
        'deleteServerGroup',
      ])
      const openDialogAdd = ref(false)
      const openDialogDetail = ref(false)
      const openDialogDelete = ref(false)
      const selectedServerGroup = ref(null)
      const search = ref(null)
      const options = ref(null)
      const doCreate = async (payload:any) => {
        const response = await createServerGroup(payload)            
        if (response.status == 200) {
          openDialogAdd.value = false
          root.$emit('resetFormServerGroup')    
          
          let params = {
            limit: 10,
            page: 1,
            // order_column: val.sortBy[0],
            order_by: 'asc',
            project_id: projObj.id
          }
          await fetchServerGroupByProject(params)
        }
      }    
      
      const doDelete = async (id:any) => {
        const response = await deleteServerGroup(id)
        openDialogDelete.value = false

        let params = {
          limit: 10,
          page: 1,
          // order_column: val.sortBy[0],
          order_by: 'asc',
          project_id: projObj.id
        }
        await fetchServerGroupByProject(params)
        
      }
      const projObj = JSON.parse(localstorage.getItem("currentProj"));
      onMounted(() => {
        // fetchServerGroupByProject()
      })
      watch(options, async (val:any) => {
        let params = {
          limit: val.itemsPerPage,
          page: val.page,
          // order_column: val.sortBy[0],
          order_by: val.sortDesc[0] ? 'desc' : 'asc',
          project_id: projObj.id
        }
        await fetchServerGroupByProject(params)
      })
      return {
        read_only,
        doCreate,
        doDelete,
        openDialogAdd,
        openDialogDetail,
        openDialogDelete,
        servergroupByProject,
        servergroupPaginator,
        selectedServerGroup,
        search,
        options,
        headers,
        servergroupselectedvalue,
        show: ($event: any, item: any) => {
          selectedServerGroup.value = item;
        },
        user_role,
      }
    },
    created() {
    },
  });
  </script>
  <style lang="scss" scoped>
  .search {
    ::v-deep .v-input__slot {
      margin-bottom: 0px;
    }
  }
  .v-input--is-label-active {
    ::v-deep .v-input--switch__track {
      background-color: #27ae60;
      opacity: 1 !important;
    }
    ::v-deep .v-input--switch__thumb {
      background-color: white;
    }
  }
  .v-input--switch {
    ::v-deep .v-input--switch__track {
      height: 20px;
      width: 42px;
      border-radius: 10px;
    }
    ::v-deep .v-input--selection-controls__ripple {
      display: none;
    }
    ::v-deep .v-input--switch__thumb {
      left: 8px;
      top: 8.5px;
      height: 12px;
      width: 12px;
    }
  }
  .mdi-chevron-down.rotate::before {
    transform: rotate(-180deg);
    transition: 100ms linear all;
  }
  .mdi-chevron-down::before {
    transition: 100ms linear all;
  }
  .v-input{
    ::v-deep .v-input__append-outer{
    margin: 0px 0px !important;
  }
  }
  .table-servergroup table{
    width: 100%;
  }
  .table-servergroup table thead tr th{
      position: relative;
      min-height: 35px;
  }
  </style>