<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg elevation-0">
        <v-container fluid>
          <!-- title -->
          <v-row justify="center">
            <v-col>
              <div class="headline font-weight-bold font--text">Alarm</div>
            </v-col>
          </v-row>

          <!-- if alarms > 0 -->
          <v-row>
            <v-col cols="12">
              <!-- table -->
              <v-data-table
                hide-default-header
                hide-default-footer
                :items-per-page="5"
                :headers="headers"
                :items="alarms"
                :options.sync="pagination"
                class="elevation-0"
              >
                <!-- <v-data-table
                hide-default-header
                hide-default-footer
                :items-per-page="5"
                :headers="headers"
                :items="alarms"
                :server-items-length="pagination.count"
                :options.sync="pagination"
                class="elevation-0"
              > -->

                <!-- loading / no data -->
                <template v-slot:no-data>
                  {{ loading ? "Loading..." : "No data available" }}
                </template>

                <!-- header -->
                <template v-slot:header="{ props, on }">
                  <v-data-table-header
                    v-on="on"
                    v-bind="props"
                    sort-icon="mdi-menu-down"
                  />
                </template>

                <!-- btns -->
                <template v-slot:item.action="{ item }">
                  <router-link :to="'/alerting/edit?id=' + item.id">
                    Edit
                  </router-link>

                  <button
                    class="error--text"
                    @click="
                      () => {
                        selectedAlarm = item;
                        openDialogDeleteAlarm = true;
                      }
                    "
                  >
                    Delete
                  </button>
                </template>

                <!-- pagination -->
                <template v-slot:footer="{ props }">
                  <custom-footer-datatable
                    v-if="
                      (pagination && pagination.count > 5) ||
                        (pagination && pagination.count === 5)
                    "
                    @input="
                      (val) => {
                        pagination = { ...pagination, ...val };
                      }
                    "
                    :props="props"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>

    <dialogDeleteAutoScaling
      v-if="openDialogDeleteAlarm && selectedAlarm"
      v-model="openDialogDeleteAlarm"
      :item="selectedAlarm"
      :loading="loading"
      @cancel="openDialogDeleteAlarm = false"
      @submit="deleteAlarm"
    />
  </v-row>
</template>

<script>
import dialogDeleteAutoScaling from "../dialogDeleteAutoScaling.vue";

export default {
  components: {
    dialogDeleteAutoScaling,
  },
  data() {
    return {
      selectedAlarm: null,
      openDialogDeleteAlarm: true,
      rotateArrowId: null,
      loading: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Metric", value: "metric" },
        { text: "Operator", value: "operator" },
        { text: "Threshold", value: "threshold" },
        { text: "Minutes", value: "minutes" },
        { text: "Severity", value: "severity" },
        { text: "Applied To", value: "applied_to" },
        { text: "Action", value: "action", sortable: false },
      ],
      alarms: [
        {
          id: "asd123qqq",
          name: "asd",
          metric: "asd",
          operator: "asd",
          threshold: "asd",
          minutes: "asd",
          severity: "asd",
          applied_to: "asd",
        },
      ],
      pagination: {
        count: 0,
        page: 1,
        totalpage: 1,
      },
    };
  },
  methods: {
    rotateArrow(id) {
      this.rotateArrowId = id;
    },
    deleteAlarm() {
      this.openDialogDeleteAlarm = false;

      this.$store.dispatch(
        "HOMEPAGE/showSuccessToast",
        "Alarm has been successfully deleted",
        { root: true }
      );

      this.$store.dispatch(
        "HOMEPAGE/showErrorToast",
        "Sorry, an error occurred while deleting alarm"
      );
    },
  },
};
</script>

<style scoped>
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
</style>
