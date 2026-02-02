<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
   <v-card-text class="d-flex flex-row align-center">
      <v-row>
          <v-col class="d-flex flex-row align-center">
            <p class="mb-0 font-weight-bold fz-21">Manage Zone</p>
            <v-spacer />
          
            <div style="height: auto; width: 30px" />            
            <v-btn
              v-if="!read_only"
              id="CreateNewZone"
              depressed
              height="50"
              width="150"
              class="secondary"
              @click="
                () => {
                  selectedZone = null
                  openDialogAdd = true
                }
              "
            >
              <span class="fz-14">Create New Zone</span>
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
              :items-per-page="zonePaginator.limit"
              :search="search"
              :items="zoneByRegion"
              :options.sync="options"
              class="table-zone"
            >                          
              <!-- <template #[`item.status`]="{ item }">
                  <div class="min-width-130">
                      <v-switch
                          true-value="active"
                          false-value="deactive"
                          flat
                          readonly
                          :disabled="read_only"
                          @click="()=>{
                          if (read_only){
                            return
                          }
                          zoneselectedvalue = item
                          opendialogactivatezone = true
                          }"
                          :input-value="item.status"
                      ></v-switch>
                  </div>
              </template> -->
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
                  <v-list-item
                    v-if="!read_only"
                    @click="
                      () => {
                        selectedZone = item
                        openDialogAdd = true
                      }
                    "
                  >
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="!read_only"
                    @click="
                      () => {
                        selectedZone = item
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
                    v-if="!read_only"
                    @click="
                      () => {
                        selectedZone = item
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
      :selectedZone="selectedZone"
      @create="(payload) => doCreate(payload)"
      @update="(payload) => doUpdate(payload)"
    />

    <dialogDetail
      v-model="openDialogDetail"
      :selectedZone="selectedZone"
    />

    <dialogDelete
      v-model="openDialogDelete"
      :selectedZone="selectedZone"
      @delete="(payload) => doDelete(payload)"
    />

    <dialogActivateZone
      zone="zone"
      :onoff="zoneselectedvalue.status == 'active' ? 'off' : 'on'"
      v-model="opendialogactivatezone"
      @confirm="
        () => {
          changestatus(zoneselectedvalue).then(() => {
            opendialogactivatezone = false;
            zoneselectedvalue.status =
              zoneselectedvalue.status == 'active' ? 'deactive' : 'active';
          });
        }
      "
    />
  </v-card>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, watch, onMounted } from "@vue/composition-api";
import dialogAdd from "./dialogAdd.vue";
import dialogDetail from "./dialogDetail.vue";
import dialogDelete from "./dialogDelete.vue";
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
import { MANAGEZONE, MANAGEFLAVOR } from '../../namespace'
import dialogActivateZone from "./dialogActivateZone.vue";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: {
    dialogAdd,
    dialogDetail,
    dialogDelete,
    dialogActivateZone,
  },
  setup(props,  { root }) {
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Pricing'));
    const zoneselectedvalue: Ref<any> = ref("");
    const headers = ref([
      {
        text: 'Region',
        value: 'region',
      },
      {
        text: 'Name',
        value: 'name',
      },      
      {
        text: 'Zone',
        value: 'zone',
      },
      {
        text: 'Action',
        value: 'action',
      },
    ])
    const { changestatus } = useNamespacedActions(MANAGEFLAVOR, [
      "changestatus",
    ]);
    const opendialogactivatezone = ref(false);
    const {
      zoneByRegion,
      zonePaginator,
    } = useNamespacedState(MANAGEZONE, [
      'zoneByRegion',
      'zonePaginator',
    ])

    const {
      fetchZoneByRegion,
      createZone,
      updateZone,
      deleteZoneById,
    } = useNamespacedActions(MANAGEZONE, [
      'fetchZoneByRegion',
      'createZone',
      'updateZone',
      'deleteZoneById',
    ])

    const openDialogAdd = ref(false)
    const openDialogDetail = ref(false)
    const openDialogDelete = ref(false)
    const selectedZone = ref(null)
    const search = ref(null)
    const options = ref(null)
    const url = root._route.path;
    const lastIndex = url.lastIndexOf('/');
    const regionID = url.substring(lastIndex+1)    

    // const url = root._route.path;
    // const lastIndex = url.lastIndexOf('/');
    // const payload = {
    //     region_id: url.substring(lastIndex+1),        
    //   };

    const doCreate = async (payload:any) => {
      const response = await createZone(payload)
      if (response.status == 200) {
        openDialogAdd.value = false
        root.$emit('resetFormZone')
      }
    }

    const doUpdate = async (payload:any) => {
      const response = await updateZone(payload)
      if (response.status == 200) openDialogAdd.value = false
    }
    
    const doDelete = async (id:any) => {
      let params = {
        id: id,        
        region_id: regionID    
      }
      const response = await deleteZoneById(params)
      openDialogDelete.value = false
    }

    // let payload = {
    //   region_id: regionID
    // }
    // onMounted(() => {
    //   fetchZoneByRegion(payload)
    // })

    watch(options, async (val:any) => {      
      let params = {
        limit: val.itemsPerPage,
        page: val.page,
        order_column: val.sortBy[0],
        order_by: val.sortDesc[0] ? 'desc' : 'asc',    
        region_id: regionID    
      }
      await fetchZoneByRegion(params)
    })

    return {
      read_only,

      doCreate,
      doUpdate,
      doDelete,
      openDialogAdd,
      openDialogDetail,
      openDialogDelete,
      zoneByRegion,
      zonePaginator,
      selectedZone,
      search,
      options,
      headers,
      zoneselectedvalue,
      changestatus,
      opendialogactivatezone,
      show: ($event: any, item: any) => {
        selectedZone.value = item;
      },
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
.table-zone table{
  width: 100%;
}
.table-zone table thead tr th{
    position: relative;
    min-height: 35px;
}
</style>