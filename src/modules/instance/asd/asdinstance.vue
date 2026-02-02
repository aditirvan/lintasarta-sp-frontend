<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg elevation-0">
        <v-container fluid>
          <!-- title -->
          <v-row justify="center">
            <v-col>
              <div class="headline font-weight-bold font--text">Instance</div>
            </v-col>
          </v-row>

          <!-- if instances > 0 -->
          <v-row>
            <v-col cols="12">
              <!-- table -->
              <v-data-table
                hide-default-header
                hide-default-footer
                :items-per-page="5"
                :headers="headers"
                :items="instances"
                :options.sync="pagination"
                class="elevation-0"
              >
                <!-- <v-data-table
                hide-default-header
                hide-default-footer
                :items-per-page="5"
                :headers="headers"
                :items="instances"
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
                  <v-menu offset-y>
                    <!-- more btn -->
                    <template v-slot:activator="{ on, attrs }">
                      <label
                        class="primary--text linkpointer d-flex"
                        v-bind="attrs"
                        @click="
                          ($event) => {
                            on.click($event);
                            rotateArrow(item.id);
                          }
                        "
                      >
                        More

                        <v-icon
                          :class="{
                            rotate:
                              item.id === rotateArrowId &&
                              attrs['aria-expanded'] === 'true',
                          }"
                          color="primary"
                        >
                          mdi-chevron-down
                        </v-icon>
                      </label>
                    </template>

                    <!-- more btn list -->
                    <v-list>
                      <v-list-item link :to="'/instance/' + item.id">
                        <v-list-item-title>
                          Detail
                        </v-list-item-title>
                      </v-list-item>

                      <v-list-item link>
                        <v-list-item-title
                          class="error--text"
                          @click="
                            () => {
                              selectedInstance = item;
                              openDialogDeleteInstance = true;
                            }
                          "
                        >
                          Delete
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
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
      v-if="openDialogDeleteInstance && selectedInstance"
      v-model="openDialogDeleteInstance"
      :item="selectedInstance"
      :loading="loading"
      @cancel="openDialogDeleteInstance = false"
      @submit="deleteInstance"
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
      selectedInstance: null,
      openDialogDeleteInstance: true,
      rotateArrowId: null,
      loading: false,
      headers: [
        { text: "Name", value: "name" },
        { text: "Billing Type", value: "billing_type" },
        { text: "IP Address", value: "ip_address" },
        { text: "Region", value: "region" },
        { text: "Created Date", value: "created_date" },
        { text: "Action", value: "action", sortable: false },
      ],
      instances: [
        {
          id: "asd123qqq",
          name: "asd",
          billing_type: "asd",
          ip_address: "asd",
          region: "asd",
          created_date: "asd",
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
    deleteInstance() {
      this.openDialogDeleteInstance = false;

      this.$store.dispatch(
        "HOMEPAGE/showSuccessToast",
        "Instance has been successfully deleted",
        { root: true }
      );

      this.$store.dispatch(
        "HOMEPAGE/showErrorToast",
        "Sorry, an error occurred while deleting instance"
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
