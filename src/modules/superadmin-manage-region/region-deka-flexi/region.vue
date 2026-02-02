<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-row class="d-flex justify-center"
              ><v-col cols="9">
                <div class="headline font-weight-bold font--text">List Region</div>
              </v-col>
              <v-col md="1"></v-col>
              <v-col md="2">
                <v-btn
                  v-if="!read_only"
                  block
                  color="secondary"
                  dark
                  height="45"
                  width="150"
                  class="fz-14"
                  @click="
                    () => {
                      selectedRegion = null;
                      openDialogAdd = true;
                    }
                  "
                  >Create New Region</v-btn
                >
              </v-col></v-row
            >
            <v-row>
              <v-col md="12">
                <v-data-table
                  hide-default-footer
                  :headers="headers"
                  :items-per-page="regionPaginator.limit"
                  :search="search"
                  :items="regions"
                  :options.sync="options"
                >
                  <template v-slot:item.description="{ item }">
                    {{ item.description ? item.description : "-" }}
                  </template>
                  <template v-slot:item.cpu_limit="{ item }">
                    <span :class="{ 'error--text': item.cpu_usage >= item.cpu_limit }">
                      {{ item.cpu_limit ? `${item.cpu_usage}/${item.cpu_limit}` : "-" }}
                    </span>
                  </template>

                  <template v-slot:item.ram_limit="{ item }">
                    <span :class="{ 'error--text': item.ram_usage >= item.ram_limit }">
                      {{ item.ram_limit ? `${item.ram_usage}/${item.ram_limit}` : "-" }}
                    </span>
                  </template>

                  <template #[`item.status`]="{ item }">
                    <div class="min-width-130">
                      <v-switch
                        true-value="active"
                        false-value="deactive"
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
                    <popupquote v-model="item.open" :offsetTop="20" :documentid="'popup' + item.id" offset-y allow-overflow>
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
                        <v-list-item
                          :disabled="read_only"
                          @click="
                            () => {
                              $router.push(`manage-zone/${item.ID}`);
                            }
                          "
                        >
                          <v-list-item-title>Manage Zone</v-list-item-title>
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
                </v-data-table> </v-col
            ></v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <dialogAdd v-model="openDialogAdd" :selectedRegion="selectedRegion" @create="(payload) => doCreate(payload)" @update="(payload) => doUpdate(payload)" />
    <dialogDetail v-model="openDialogDetail" :selectedRegion="selectedRegion" v-if="selectedRegion" />
    <dialogDelete v-model="openDialogDelete" :selectedRegion="selectedRegion" @delete="(payload) => doDelete(payload)" />
    <dialogActivateRegion
      region="region"
      :onoff="regionselectedvalue.status == 'active' ? 'off' : 'on'"
      v-model="opendialogactivateregion"
      @confirm="
        () => {
          changestatus(regionselectedvalue).then(() => {
            opendialogactivateregion = false;
            regionselectedvalue.status = regionselectedvalue.status == 'active' ? 'deactive' : 'active';
          });
        }
      "
    />
  </div>
</template>
<script>
import { defineComponent, ref, watch, onMounted } from "@vue/composition-api";
import dialogAdd from "./dialog/dialogAdd.vue";
import dialogDetail from "./dialog/dialogDetail.vue";
import dialogDelete from "./dialog/dialogDelete.vue";
import dialogActivateRegion from "./dialog/dialogActivateRegion.vue";
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
import { MANAGEFLAVOR } from "@/modules/superadmin-manageflavors/namespace";
import { DEKAFLEXIREGION } from "../namespace";

import { AccessControl } from "@/lib/middleware";

export default defineComponent({
  components: {
    dialogAdd,
    dialogDetail,
    dialogDelete,
    dialogActivateRegion,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Manage Region"));
    const regionselectedvalue = ref("");
    const headers = ref([
      { text: "Name", value: "name", sortable: false },
      { text: "Description", value: "description", sortable: false },
      { text: "CPU Limit", value: "cpu_limit", sortable: false },
      { text: "Memory Limit", value: "ram_limit", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ]);
    const { changestatus } = useNamespacedActions(MANAGEFLAVOR, ["changestatus"]);
    const opendialogactivateregion = ref(false);
    const { regions, regionPaginator } = useNamespacedState(DEKAFLEXIREGION, ["regions", "regionPaginator"]);

    const { fetchRegions, createRegion, updateRegion, deleteRegionByName } = useNamespacedActions(DEKAFLEXIREGION, [
      "fetchRegions",
      "createRegion",
      "updateRegion",
      "deleteRegionByName",
    ]);

    const openDialogAdd = ref(false);
    const openDialogDetail = ref(false);
    const openDialogDelete = ref(false);
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

    const doDelete = async (regionName) => {
      const response = await deleteRegionByName(regionName);
      openDialogDelete.value = false;
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
      show: ($event, item) => {
        selectedRegion.value = item;
      },
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
