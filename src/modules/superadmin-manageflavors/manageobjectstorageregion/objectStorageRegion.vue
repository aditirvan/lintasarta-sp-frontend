<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
   <v-card-text class="d-flex flex-row align-center">
      <v-row>
          <v-col class="d-flex flex-row align-center">
            <p class="mb-0 font-weight-bold fz-21">Manage Region Object Storage</p>
            <v-spacer />
          
            <div style="height: auto; width: 30px" />
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
            >
              <template v-slot:item.region_name="{ item }">
                {{ item.region_name ? item.region_name : '-' }}
              </template>
              <template v-slot:item.name="{ item }">
                {{ item.name ? item.name : '-' }}
              </template>
              <template v-slot:item.description="{ item }">
                {{ item.description ? item.description : '-' }}
              </template>
              <template v-slot:item.volume_limit="{ item }">
                <span
                  :class="{'error--text': item.volume_usage >= item.volume_limit}"
                >
                  {{ item.volume_limit ? `${item.volume_usage}/${item.volume_limit} GB` : '-' }}
                </span>
              </template>
              <template v-slot:item.action="{ item }">
              <popupquote
                v-model="item.open"
                :offsetTop="21"
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
                        item.open = true;
                      }
                    "
                  >More
                    <v-icon
                      :class="{
                        rotate: item.open,
                      }"
                      :id="'popup' + item.id"
                      color="primary"
                    >mdi-chevron-down
                    </v-icon
                    >
                  </label>
                </template>
                <v-list>
                  <v-list-item
                    v-if="!read_only"
                    @click="() => {
                      selectedRegion = item
                      openDialogAdd = true
                    }"
                  >
                    <span class="font--text edit" style="font-weight: 600"
                    >Edit</span
                    >
                  </v-list-item>
                  <v-list-item
                    @click="() => {
                      selectedRegion = item
                      openDialogDetail = true
                    }"
                  >
                    <span class="font--text edit" style="font-weight: 600"
                    >Detail</span
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="!read_only"
                    @click="() => {
                      selectedRegion = item
                      openDialogDelete = true
                    }"
                  >
                    <v-list-item-title class="error--text delete"
                    >Delete
                    </v-list-item-title
                    >
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
      :selectedRegion="selectedRegion"
      :formState="openDialogAdd"
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
  </v-card>
</template>
<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "@vue/composition-api";
import dialogAdd from "./dialogAdd.vue";
import dialogDelete from "./dialogDelete.vue";
import dialogDetail from "./dialogDetail.vue";
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
import { MANAGEOBJECTSTORAGEREGION } from '../namespace'

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: {
    dialogAdd,
    dialogDetail,
    dialogDelete,
  },
  setup(props,  { root }) {
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Pricing'));
    const headers = ref([
      {
        text: 'Name',
        value: 'name',
      },
      {
        text: 'S3 Region Name',
        value: 's3_region_name',
      },
      {
        text: 'Description',
        value: 'description',
      },
      {
        text: 'Volume Limit',
        value: 'volume_limit',
      },
      {
        text: 'Action',
        value: 'action',
      },
    ])
    const {
      regions,
      regionPaginator,
    } = useNamespacedState(MANAGEOBJECTSTORAGEREGION, [
      'regions',
      'regionPaginator',
    ])

    const {
      fetchRegions,
      createRegion,
      updateRegion,
      deleteRegionByID,
    } = useNamespacedActions(MANAGEOBJECTSTORAGEREGION, [
      'fetchRegions',
      'createRegion',
      'updateRegion',
      'deleteRegionByID',
    ])

    const openDialogAdd = ref(false)
    const openDialogDelete = ref(false)
    const openDialogDetail = ref(false)
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
    
    const doDelete = async (regionID:any) => {
      const response = await deleteRegionByID(regionID)
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
      openDialogDelete,
      openDialogDetail,
      regions,
      regionPaginator,
      selectedRegion,
      search,
      options,
      headers,
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

</style>