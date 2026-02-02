<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg elevation-0">
        <v-container fluid>
          <!-- title -->
          <v-row justify="center">
            <v-col>
              <div class="headline font-weight-bold font--text">
                Load Balancer
              </div>
            </v-col>
          </v-row>

          <!-- if loadBalancers > 0 -->
          <v-row>
            <v-col cols="12">
              <!-- table -->
              <v-data-table
                hide-default-header
                hide-default-footer
                :items-per-page="10"
                :headers="headers"
                :items="loadBalancers"
                :options.sync="pagination"
                class="elevation-0"
              >
                <!-- <v-data-table
                hide-default-header
                hide-default-footer
                :items-per-page="5"
                :headers="headers"
                :items="loadBalancers"
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
                  <router-link
                    :to="'/network/loadbalancer/' + item.id + '/settings'"
                  >
                    Edit
                  </router-link>

                  <button
                    class="error--text"
                    @click="
                      () => {
                        selectedLoadBalancer = item;
                        openDialogDeleteLoadBalancer = true;
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
      v-if="openDialogDeleteLoadBalancer && selectedLoadBalancer"
      v-model="openDialogDeleteLoadBalancer"
      :item="selectedLoadBalancer"
      :loading="loading"
      @cancel="openDialogDeleteLoadBalancer = false"
      @submit="deleteLoadBalancer"
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
      selectedLoadBalancer: null,
      openDialogDeleteLoadBalancer: true,
      rotateArrowId: null,
      loading: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Status", value: "status" },
        { text: "Provisioning Status", value: "provisioning_status" },
        { text: "Operating Status", value: "operating_status" },
        { text: "IP Address", value: "ip_address" },
        { text: "Health Check", value: "health_check" },
        { text: "Rules", value: "rules" },
        { text: "Created", value: "created" },
        { text: "Action", value: "action", sortable: false },
      ],
      loadBalancers: [
        {
          id: "asd123qqq",
          name: "asd",
          status: "asd",
          provisioning_status: "asd",
          operating_status: "asd",
          ip_address: "asd",
          health_check: "asd",
          rules: "asd",
          created: "asd",
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
    deleteLoadBalancer() {
      this.openDialogDeleteLoadBalancer = false;

      this.$store.dispatch(
        "HOMEPAGE/showSuccessToast",
        "Load Balancer has been successfully deleted",
        { root: true }
      );

      this.$store.dispatch(
        "HOMEPAGE/showErrorToast",
        "Sorry, an error occurred while deleting load balancer"
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
