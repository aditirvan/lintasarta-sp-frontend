<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row
              ><v-col md="6">
                <div class="headline font-weight-bold font--text">Manage Management</div>
              </v-col>
              <v-col md="6" class="d-flex justify-end">
                <v-btn
                  v-if="!read_only"
                  color="secondary"
                  dark
                  height="45"
                  class="fz-14"
                  @click="
                    () => {
                      selectedRegion = null;
                      openDialogAdd = true;
                    }
                  "
                  >Create New Management</v-btn
                >
              </v-col></v-row
            >
            <v-row>
              <v-col md="12">
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
                    {{ item.region_name ? item.region_name : "-" }}
                  </template>
                  <template v-slot:item.name="{ item }">
                    {{ item.name ? item.name : "-" }}
                  </template>
                  <template v-slot:item.description="{ item }">
                    {{ item.description ? item.description : "-" }}
                  </template>
                   <template v-slot:item.type_region="{ item }">
                    {{ item.type_region ? item.type_region : "-" }}
                  </template>
                  <template v-slot:item.volume_limit="{ item }">
                    <span :class="{ 'error--text': item.volume_usage >= item.volume_limit }">
                      {{ item.volume_limit ? `${item.volume_usage}/${item.volume_limit} GB` : "-" }}
                    </span>
                  </template>
                  <template #[`item.status`]="{ item }">
                    <div class="min-width-130">
                      <v-switch
                        flat
                        readonly
                        :disabled="read_only"
                        @click="
                          () => {
                            if (read_only) {
                              return;
                            }
                            regionselectedvalue = item;
                            opendialogactivateregion = true;
                          }
                        "
                        :input-value="item.status"
                      ></v-switch>
                    </div>
                  </template>
                  <template v-slot:item.action="{ item }">
                    <popupquote v-model="item.open" :offsetTop="21" :documentid="'popup' + item.id" offset-y allow-overflow>
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
                          </v-icon>
                        </label>
                      </template>
                      <v-list>
                        <v-list-item
                          :disabled="read_only"
                          @click="
                            () => {
                              selectedRegion = item;
                              openDialogAdd = true;
                            }
                          "
                        >
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="
                            () => {
                              selectedRegion = item;
                              openDialogDetail = true;
                            }
                          "
                        >
                          <v-list-item-title>Detail</v-list-item-title>
                        </v-list-item>

                          <!-- <v-list-item
                          @click="
                            () => {
                              selectedRegion = item;
                              openDialogAddRegion = true;
                            }
                          "
                        >
                          <v-list-item-title>Dekabox Region</v-list-item-title>
                        </v-list-item> -->

                         

                         <v-list-item
                          :disabled="read_only"
                          @click="
                            () => {
                              $router.push(`manage-bucket/${item.id}`);
                            }
                          "
                        >
                          <v-list-item-title>Management Site</v-list-item-title>
                        </v-list-item>

                        <v-list-item style="min-height: 1px; margin-left: -16px; margin-right: -16px">
                          <v-divider style="min-width: 160px" />
                        </v-list-item>
                        <v-list-item
                          :disabled="read_only"
                          @click="
                            () => {
                              selectedRegion = item;
                              openDialogDelete = true;
                            }
                          "
                        >
                          <v-list-item-title class="error--text delete">Delete </v-list-item-title>
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
                </v-data-table> </v-col
            ></v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <dialogAdd
      v-model="openDialogAdd"
      :selectedRegion="selectedRegion"
      :formState="openDialogAdd"
      @create="(payload) => doCreate(payload)"
      @update="(payload) => doUpdate(payload)"
    />
    <dialogDetail v-model="openDialogDetail" :selectedRegion="selectedRegion" v-if="openDialogDetail" />
    <dialogDelete v-model="openDialogDelete" :selectedRegion="selectedRegion" @delete="(payload) => doDelete(payload)" />
    <dialogActivateRegion :data-status="regionselectedvalue" :open-dialog.sync="opendialogactivateregion" v-if="opendialogactivateregion" />
    <dialogAddRegion v-model="openDialogAddRegion" :selectedRegion="selectedRegion" v-if="openDialogAddRegion" @addRegion="(payload) => doAddRegion(payload)"/>
  </div>
</template>
<script>
import { defineComponent, ref, watch, onMounted } from "@vue/composition-api";
import dialogAdd from "./dialog/dialogAdd.vue";
import dialogDelete from "./dialog/dialogDelete.vue";
import dialogDetail from "./dialog/dialogDetail.vue";
import dialogAddRegion from "./dialog/dialogAddRegion.vue";
import dialogActivateRegion from "./dialog/dialogActivateRegion.vue";
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
import { AccessControl } from "@/lib/middleware";
import { DEKABOXREGION } from "../namespace";
import dialogAddRegionVue from "./dialog/dialogAddRegion.vue";

export default defineComponent({
  components: {
    dialogAdd,
    dialogDetail,
    dialogDelete,
    dialogActivateRegion,
    dialogAddRegion,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Region"));
    const headers = ref([
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Volume Limit", value: "volume_limit" },
      { text:"Type", value:"type_region"},
      { text: "Status", value: "status" },
      { text: "Action", value: "action" },
    ]);
    const { regions, regionPaginator } = useNamespacedState(DEKABOXREGION, ["regions", "regionPaginator"]);

    const { fetchRegions, createRegion, updateRegion, deleteRegionByID, updateRegionDekabox } = useNamespacedActions(DEKABOXREGION, [
      "fetchRegions",
      "createRegion",
      "updateRegion",
      "deleteRegionByID",
      "updateRegionDekabox",
    ]);

    const regionselectedvalue = ref("");
    const opendialogactivateregion = ref(false);
    const openDialogAdd = ref(false);
    const openDialogDelete = ref(false);
    const openDialogDetail = ref(false);
    const openDialogAddRegion = ref(false)
    const selectedRegion = ref(null);
    const search = ref(null);
    const options = ref(null);

    const doCreate = async (payload) => {
      const response = await createRegion(payload);
      if (response.status == 200) {
        openDialogAdd.value = false;
        context.root.$emit("resetFormRegion");
      }
    };

    const doUpdate = async (payload) => {
      const response = await updateRegion(payload);
      if (response.status == 200) openDialogAdd.value = false;
    };

    const doDelete = async (regionID) => {
      const response = await deleteRegionByID(regionID);
      openDialogDelete.value = false;
    };


     const doAddRegion = async (payload) => {
      const response = await updateRegionDekabox(payload);
      console.log("response ", response);
      openDialogAddRegion.value=false;
    };


    onMounted(() => {
      fetchRegions();
    });

    watch(options, async (val) => {
      let params = {
        limit: val.itemsPerPage,
        page: val.page,
        order_column: val.sortBy[0],
        order_by: val.sortDesc[0] ? "desc" : "asc",
      };
      await fetchRegions(params);
    });

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
      opendialogactivateregion,
      regionselectedvalue,
      openDialogAddRegion,
      doAddRegion,
    };
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
.v-input {
  ::v-deep .v-input__append-outer {
    margin: 0px 0px !important;
  }
}
</style>
