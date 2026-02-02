<template>
  <div>
    <v-card flat>
      <v-card-text class="pa-7 pt-2 pb-4">
        <div class="headline font-weight-bold font--text">User Activity</div>
        <v-row>
          <v-col class="mt-4">
            <v-data-table
              :headers="headers"
              :items="listActivityUser['Activity Detail User Organization']"
              item-key="id"
              single-line
              class="elevation-0"
              :server-items-length="listActivityUser['total activity']"
              hide-default-footer
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

              <template v-slot:footer="{ props }" v-if="listActivityUser['total activity'] >= 5">
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
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { SUPERADMINMANAGEORG } from "./namespace";

export default {
  props: {
    organization: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
    const { getActivityUser } = useNamespacedActions(SUPERADMINMANAGEORG, ["getActivityUser"]);
    const { listActivityUser } = useNamespacedState(SUPERADMINMANAGEORG, ["listActivityUser"]);
    onMounted(() => {
      getActivityUser({ id: props.organization.id, params: { page_size: 10, page: 1, activity: "User Organization" } });
    });
    const headers = ref([
      { text: "Name", value: "user", sortable: false },
      { text: "Action", value: "action", sortable: false },
      { text: "Date ", value: "created_at", sortable: false },
      { text: "Description ", value: "description", sortable: false },
    ]);

    const changePage = (event) => {
      getActivityUser({ id: props.organization.id, params: { page_size: event.itemsPerPage, page: event.page, activity: "User Organization" } });
    };
    return {
      headers,
      changePage,
      listActivityUser,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item {
  min-height: 25px;
}
</style>
