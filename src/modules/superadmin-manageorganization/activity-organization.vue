<template>
  <div>
    <v-card flat>
      <v-card-text class="pa-7 pt-2 pb-4">
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="listActivityOrganisasi['Activity Detail Data Organization']"
              item-key="id"
              single-line
              class="elevation-0"
              :server-items-length="listActivityOrganisasi['total activity']"
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

              <template v-slot:footer="{ props }" v-if="listActivityOrganisasi['total activity'] >= 5">
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
    const { getActivityOrganisasi } = useNamespacedActions(SUPERADMINMANAGEORG, ["getActivityOrganisasi"]);
    const { listActivityOrganisasi } = useNamespacedState(SUPERADMINMANAGEORG, ["listActivityOrganisasi"]);
    const headers = ref([
      { text: "Name", value: "user", sortable: false },
      { text: "Action", value: "action", width: "30%", sortable: false },
      { text: "Date ", value: "created_at", sortable: false },
      { text: "Description ", value: "description", sortable: false },
    ]);
    onMounted(() => {
      getActivityOrganisasi({ id: props.organization.id, params: { page_size: 10, page: 1, activity: "Data Organization" } });
    });

    const changePage = (event) => {
      getActivityOrganisasi({ id: props.organization.id, params: { page_size: event.itemsPerPage, page: event.page, activity: "Data Organization" } });
    };
    return {
      headers,
      changePage,
      listActivityOrganisasi,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item {
  min-height: 25px;
}
</style>
