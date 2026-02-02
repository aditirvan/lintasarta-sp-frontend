<template>
  <div>
    <v-card flat class="ma-5">
      <v-card-text class="pt-2 pb-4">
        <v-row>
          <v-col md="4"
            ><v-select
              :items="items"
              v-model="filterActivity"
              label="Filter Activity"
              item-text="text"
              item-value="value"
              outlined
              @change="changeActivity($event)"
              clearable
            ></v-select
          ></v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="listActivity.dataActivity"
              item-key="id"
              single-line
              class="elevation-0"
              :loading="loadingActivity"
              hide-default-footer
              :server-items-length="listActivity['total activity']"
              :options.sync="filter"
            >
              <template #[`item.user`]="{ item }">
                <span>{{ item.user.fullname }}</span>
              </template>
              <template #[`item.created_at`]="{ item }">
                <span>{{ $FormatDate(item.created_at) }}</span>
              </template>
              <template #[`item.description`]="{ item }">
                <span>{{ item.description }}</span>
              </template>

              <template v-slot:footer="{ props }">
                <custom-footer-datatable
                  v-if="listActivity.dataActivity"
                  @input="
                    (val) => {
                      filter = val;
                      changePage(val);
                    }
                  "
                  :props="props"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters, useNamespacedMutations, useNamespacedState } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "./namespace";

export default {
  setup(props, context) {
    const { geListActivity } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["geListActivity"]);
    const { listActivity } = useNamespacedState(SUPERADMINMANAGEPRICING, ["listActivity"]);
    const { loadingActivity } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["loadingActivity"]);
    const { setListActivity } = useNamespacedMutations(SUPERADMINMANAGEPRICING, ["setListActivity"]);
    const headers = ref([
      { text: "Name", value: "user", sortable: false, width: "15%" },
      { text: "Action", value: "action", width: "25%", sortable: false },
      { text: "Date ", value: "created_at", sortable: false, width: "5%" },
      { text: "Description ", value: "description", sortable: false },
    ]);

    onMounted(() => {
      const params = new URLSearchParams();
      params.append("page_size", "10");
      params.append("page", "1");
      // params.append("activity", "items");
      geListActivity(params);
    });

    const items = ref([
      { text: "Items", value: "items" },
      { text: "Tags", value: "tags" },
      { text: "Product", value: "product" },
      { text: "Service", value: "service" },
    ]);

    const filterActivity = ref("");
    const filter = ref({});

    const changeActivity = (val) => {
      setListActivity({});
      const params = new URLSearchParams();
      params.append("page_size", "10");
      params.append("page", "1");
      if (val) params.append("activity", val);
      filter.value = { page: 1, itemsPerPage: 10 };
      geListActivity(params);
    };

    const changePage = (val) => {
      const params = new URLSearchParams();
      params.append("page_size", val.itemsPerPage);
      params.append("page", val.page);
      params.append("activity", filterActivity.value);
      geListActivity(params);
    };
    return {
      headers,
      changePage,
      listActivity,
      loadingActivity,
      filterActivity,
      items,
      changeActivity,
      filter,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item {
  min-height: 25px;
}
</style>
