<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
   <v-card-text class="d-flex flex-row align-center">
      <v-row>
          <v-col class="d-flex flex-row align-center">
            <p class="mb-0 font-weight-bold fz-21">Manage Region Instance</p>
            <v-spacer />
          
            <div style="height: auto; width: 30px" />
            <!-- <v-btn
              to="/manage-pricing/manage-region/manage-zone"
              class="secondary--text mr-4"
              depressed
              height="50"
              width="150"
              style="border: 2px solid #2c94d2; background-color: white"
              ><span class="fz-14">Manage Zone</span></v-btn
            > -->
            <v-btn
              v-if="!read_only"
              id="CreateNewType"
              depressed
              height="50"
              width="150"
              class="secondary"
              @click="
                () => {
                  selectedRegion = null
                  openDialogAdd = true
                }
              "
            >
              <span class="fz-14">Create New Region</span>
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
              :items-per-page="regionPaginator.limit"
              :search="search"
              :items="regions"
              :options.sync="options"
              class="table-region"
            >
              <template v-slot:item.description="{ item }">
                {{ item.description ? item.description : '-' }}
              </template>
              <template v-slot:item.cpu_limit="{ item }">
                <span
                  :class="{'error--text': item.cpu_usage >= item.cpu_limit}"
                >
                  {{ item.cpu_limit ? `${item.cpu_usage}/${item.cpu_limit}` : '-' }}
                </span>
              </template>
              <!-- <template v-slot:item.gpu_limit="{ item }">
                <span
                  :class="{'error--text': item.gpu_usage >= item.gpu_limit}"
                >
                  {{ item.gpu_limit ? `${item.gpu_usage}/${item.gpu_limit}` : '-' }}
                </span>
              </template> -->
              <template v-slot:item.ram_limit="{ item }">
                <span
                  :class="{'error--text': item.ram_usage >= item.ram_limit}"
                >
                  {{ item.ram_limit ? `${item.ram_usage}/${item.ram_limit}` : '-' }}
                </span>
              </template>
              <!-- <template v-slot:item.root_disk="{ item }">
                {{ item.root_disk ? item.root_disk : '-' }}
              </template>
              <template v-slot:item.data_disk="{ item }">
                {{ item.data_disk ? item.data_disk : '-' }}
              </template>
              <template v-slot:item.snapshot_instance_vol="{ item }">
                {{ item.snapshot_instance_vol ? item.snapshot_instance_vol : '-' }}
              </template>
              <template v-slot:item.snapshot_storage_vol="{ item }">
                {{ item.snapshot_storage_vol ? item.snapshot_storage_vol : '-' }}
              </template>
              <template v-slot:item.daily_backup_vol="{ item }">
                {{ item.daily_backup_vol ? item.daily_backup_vol : '-' }}
              </template>
              <template v-slot:item.custom_image_vol="{ item }">
                {{ item.custom_image_vol ? item.custom_image_vol : '-' }}
              </template> -->
              <!-- status -->
              <template #[`item.status`]="{ item }">
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
                          regionselectedvalue = item
                          opendialogactivateregion = true
                          }"
                          :input-value="item.status"
                      ></v-switch>
                  </div>
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
                        selectedRegion = item
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
                        selectedRegion = item
                        openDialogDetail = true
                      }
                    "
                  >
                    <v-list-item-title>Detail</v-list-item-title>
                  </v-list-item>                  
                  <v-list-item
                    v-if="!read_only"
                    @click="
                      () => {
                        $router.push(`/manage-pricing/manage-region/manage-zone/${item.ID}`);
                      }
                    "
                  >
                    <v-list-item-title>Manage Zone</v-list-item-title>
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
                        selectedRegion = item
                        openDialogDelete = true
                      }
                    "                    
                  >
                    <v-list-item-title class="error--text">Delete</v-list-item-title>
                  </v-list-item>
                </v-list>                
              </popupquote>
                <!-- <span
                  class="primary--text pr-3 edit"
                  @click="() => {
                    if(read_only){
                      return
                    }
                    selectedRegion = item
                    openDialogAdd = true
                  }"
                  :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
                >Edit
                </span>
                <span
                  class="primary--text pr-3 detail"
                  @click="() => {
                    selectedRegion = item
                    openDialogDetail = true
                  }"
                >Detail
                </span>
                <span
                  class="error--text pr-3 delete ml-4"
                  @click="() => {
                    if(read_only){
                      return
                    }
                    selectedRegion = item
                    openDialogDelete = true
                  }"
                  :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
                >Delete
                </span> -->
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
      :selectedRegion="selectedRegion"
      @create="(payload) => doCreate(payload)"
      @update="(payload) => doUpdate(payload)"
    />

    <dialogDetail
      v-model="openDialogDetail"
      :selectedRegion="selectedRegion"
    />

    <dialogDelete
      v-model="openDialogDelete"
      :selectedRegion="selectedRegion"
      @delete="(payload) => doDelete(payload)"
    />

    <dialogActivateRegion
      region="region"
      :onoff="regionselectedvalue.status == 'active' ? 'off' : 'on'"
      v-model="opendialogactivateregion"
      @confirm="
        () => {
          changestatus(regionselectedvalue).then(() => {
            opendialogactivateregion = false;
            regionselectedvalue.status =
              regionselectedvalue.status == 'active' ? 'deactive' : 'active';
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
import { MANAGEINSTANCEREGION, MANAGEFLAVOR } from '../namespace'
import dialogActivateRegion from "./dialogActivateRegion.vue";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: {
    dialogAdd,
    dialogDetail,
    dialogDelete,
    dialogActivateRegion,
  },
  setup(props,  { root }) {
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Pricing'));
    const regionselectedvalue: Ref<any> = ref("");
    const headers = ref([
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'Description',
        value: 'description',
      },
      {
        text: 'CPU Limit',
        value: 'cpu_limit',
      },
      {
        text: 'Memory Limit',
        value: 'ram_limit',
      },
      {
        text: 'Status',
        value: 'status',
      },
      // {
      //   text: 'GPU Limit',
      //   value: 'gpu_limit',
      // },
      // {
      //   text: 'Root Disk',
      //   value: 'root_disk',
      // },
      // {
      //   text: 'Data Disk',
      //   value: 'data_disk',
      // },
      // {
      //   text: 'Snapshot Instance Volume',
      //   value: 'snapshot_instance_vol',
      // },
      // {
      //   text: 'Snapshot Storage Volume',
      //   value: 'snapshot_storage_vol',
      // },
      // {
      //   text: 'Daily Backup Volume',
      //   value: 'daily_backup_vol',
      // },
      // {
      //   text: 'Custom Image Volume',
      //   value: 'custom_image_vol',
      // },
      {
        text: 'Action',
        value: 'action',
      },
    ])
    const { changestatus } = useNamespacedActions(MANAGEFLAVOR, [
      "changestatus",
    ]);
    const opendialogactivateregion = ref(false);
    const {
      regions,
      regionPaginator,
    } = useNamespacedState(MANAGEINSTANCEREGION, [
      'regions',
      'regionPaginator',
    ])

    const {
      fetchRegions,
      createRegion,
      updateRegion,
      deleteRegionByName,
    } = useNamespacedActions(MANAGEINSTANCEREGION, [
      'fetchRegions',
      'createRegion',
      'updateRegion',
      'deleteRegionByName',
    ])

    const openDialogAdd = ref(false)
    const openDialogDetail = ref(false)
    const openDialogDelete = ref(false)
    const selectedRegion = ref(null)
    const search = ref(null)
    const options = ref(null)

    const doCreate = async (payload:any) => {
      const response = await createRegion(payload)
      if (response.status == 200) {
        openDialogAdd.value = false
        root.$emit('resetFormRegion')
      }
    }

    const doUpdate = async (payload:any) => {
      const response = await updateRegion(payload)
      if (response.status == 200) openDialogAdd.value = false
    }
    
    const doDelete = async (regionName:any) => {
      const response = await deleteRegionByName(regionName)
      openDialogDelete.value = false
    }

    onMounted(() => {
      fetchRegions()
    })

    watch(options, async (val:any) => {
      let params = {
        limit: val.itemsPerPage,
        page: val.page,
        order_column: val.sortBy[0],
        order_by: val.sortDesc[0] ? 'desc' : 'asc'
      }
      await fetchRegions(params)
    })

    return {
      read_only,

      doCreate,
      doUpdate,
      doDelete,
      openDialogAdd,
      openDialogDetail,
      openDialogDelete,
      regions,
      regionPaginator,
      selectedRegion,
      search,
      options,
      headers,
      regionselectedvalue,
      changestatus,
      opendialogactivateregion,
      show: ($event: any, item: any) => {
        selectedRegion.value = item;
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
.table-region table{
  width: 100%;
}
.table-region table thead tr th{
    position: relative;
    min-height: 35px;
}
</style>