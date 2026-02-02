<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg elevation-0">
        <v-container class="px-7 py-4" fluid>
          <!-- header -->
          <v-row class="align-center mb-4">
            <v-col cols="12">
              <v-tabs>
                <v-tab to="/instance">Instance</v-tab>
                <v-tab to="/instance/auto-scaling">Auto Scaling</v-tab>
              </v-tabs>
            </v-col>

            <v-col cols="12" md="8">
              <div class="headline font-weight-bold font--text">
                Auto Scaling
              </div>
            </v-col>

            <v-col cols="12" md="4" class="d-flex justify-sm-end">
              <v-btn
                depressed
                height="45"
                width="150"
                append
                to="/instance/auto-scaling/create"
                class="secondary"
              >
                Create Auto Scaling
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <!-- table -->
            <v-data-table
              v-if="autoScalings.length > 0"
              :headers="headers"
              :items="autoScalings"
              :items-per-page="10"
              class="elevation-0"
              hide-default-footer
              style="width: 100%"
            >
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
                    <!-- <v-list-item link>
                      <v-list-item-title>
                        {{ item.id }}
                      </v-list-item-title>
                    </v-list-item> -->

                    <v-list-item link :to="'/instance/auto-scaling/' + item.id">
                      <v-list-item-title>
                        Detail
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item link>
                      <v-list-item-title
                        class="error--text"
                        @click="
                          () => {
                            selectedAutoScaling = item;
                            openDialogDeleteAutoScaling = true;
                          }
                        "
                      >
                        Delete
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>

            <!-- if auto scaling data is empty -->
            <v-col v-else md="12">
              <v-card
                flat
                outlined
                class="d-flex rounded-lg flex-grow-1 flex-column text-center ma-auto"
              >
                <v-card-text style="padding-top: 72px; padding-bottom: 78px">
                  <p
                    style="
                      font-size: 16px;
                      margin-bottom: 10px;
                      text-transform: capitalize;
                    "
                    class="font-weight-bold"
                  >
                    Looks like you don’t have any Auto Scaling
                  </p>

                  <v-row class="d-flex justify-center">
                    <v-col cols="12" lg="8" md="12">
                      <p
                        style="
                          font-size: 12px;
                          color: #a5b3bf;
                          margin-bottom: 20px;
                        "
                      >
                        Build and release faster with scalable instance products
                        in the cloud. Provides flexible server configurations
                        sized for any application, industry leading price to
                        performance, and predictable pricing that is the same
                        across regions and usage volumes.
                      </p>
                    </v-col>
                  </v-row>

                  <v-btn
                    append
                    width="300"
                    height="50"
                    depressed
                    class="secondary"
                    to="/auto-scaling/create"
                  >
                    Create Auto Scaling
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>

    <dialogDeleteAutoScaling
      v-if="openDialogDeleteAutoScaling && selectedAutoScaling"
      v-model="openDialogDeleteAutoScaling"
      :item="selectedAutoScaling"
      :loading="loading"
      @cancel="openDialogDeleteAutoScaling = false"
      @submit="deleteAutoScaling"
    />
  </v-row>
</template>

<script>
import api from "@/lib/api";
import dialogDeleteAutoScaling from "./dialogDeleteAutoScaling.vue";

export default {
  components: {
    dialogDeleteAutoScaling,
  },
  data() {
    return {
      loading: false,
      rotateArrowId: null,
      autoScalings: [],
      headers: [
        {
          text: "Scaling Group Name",
          value: "scalingGroupName",
          sortable: false,
        },
        { text: "Status", value: "status", sortable: false },
        { text: "Total Instance", value: "totalInstance", sortable: false },
        { text: "Min Instance", value: "minInstance", sortable: false },
        { text: "Max Instance", value: "maxInstance", sortable: false },
        {
          text: "Countdown Time (Second)",
          value: "countdownTime",
          sortable: false,
        },
        { text: "Action", value: "action", sortable: false },
      ],
      selectedAutoScaling: null,
      openDialogDeleteAutoScaling: true,
    };
  },
  methods: {
    rotateArrow(id) {
      this.rotateArrowId = id;
    },
    async getAutoScalings() {
      this.loading = true;

      try {
        const res = await api.GET("/user/autoscaling-dummy");

        if (res.data.length) {
          this.autoScalings = res.data.map((autoscaling) => {
            const {
              id,
              name,
              state,
              minimum_instance,
              maximum_instance,
              cooldown_time,
              total_instance,
            } = autoscaling;

            return {
              id,
              scalingGroupName: name,
              status: state,
              totalInstance: total_instance,
              minInstance: minimum_instance,
              maxInstance: maximum_instance,
              countdownTime: cooldown_time,
            };
          });
        }
      } catch (err) {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Auto Scalings"
        );
      }

      this.loading = false;
    },
    async deleteAutoScaling() {
      this.loading = true;

      try {
        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Auto Scaling has been successfully deleted",
          { root: true }
        );
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Auto Scalings"
        );
      }

      this.loading = false;
    },
  },
  mounted() {
    this.getAutoScalings();
  },
};
</script>

<style scoped>
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
</style>
