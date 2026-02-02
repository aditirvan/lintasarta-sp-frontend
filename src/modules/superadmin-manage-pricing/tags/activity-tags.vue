<template>
  <div>
    <v-card flat>
      <v-card-text class="pt-2 pb-4">
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
                  @input="
                    (val) => {
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
import { useNamespacedActions, useNamespacedGetters, useNamespacedState } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";

export default {
  setup(props, context) {
    const { geListActivity } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["geListActivity"]);
    const { listActivity } = useNamespacedState(SUPERADMINMANAGEPRICING, ["listActivity"]);
    const { loadingActivity } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["loadingActivity"]);
    const headers = ref([
      { text: "Name", value: "user", sortable: false },
      { text: "Action", value: "action", width: "30%", sortable: false },
      { text: "Date ", value: "created_at", sortable: false },
      { text: "Description ", value: "description", sortable: false },
    ]);
    onMounted(() => {
      const params = new URLSearchParams();
      params.append("page_size", "10");
      params.append("page", "1");
      params.append("activity", "tags");
      geListActivity(params);
    });

    const changePage = (val) => {
      const params = new URLSearchParams();
      params.append("page_size", val.itemsPerPage);
      params.append("page", val.page);
      params.append("activity", "tags");
      geListActivity(params);
    };
    return {
      headers,
      changePage,
      listActivity,
      loadingActivity,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item {
  min-height: 25px;
}
</style>
