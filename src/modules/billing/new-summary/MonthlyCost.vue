<template>
  <v-card flat class="rounded-lg pa-2 mt-3">
    <v-card-text
      class="d-flex"
      style="justify-content: space-between; align-items: center"
    >
      <p
        v-if="billing && billing.date_start && billing.date_end"
        class="fz-21 font-weight-bold mt-4"
      >
        Monthly Cost -
        <span class="primary--text">
          {{ $moment(billing.date_start).format("DD MMMM YYYY") }} -
          {{ $moment(billing.date_end).format("DD MMMM YYYY") }}
        </span>
      </p>

      <div v-if="billing.detail.length">
        <v-btn
          to="/billing/all-project"
          color="secondary"
          outlined
          class="mr-4"
        >
          See Summary All Services
        </v-btn>
      </div>
    </v-card-text>

    <p v-if="loading" class="text-center">
      <beat-loader color="gray" size="10px" class="mr-2" />
    </p>

    <template v-else>
      <v-card-text v-if="billing && billing.detail.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">List Project</th>
                <th class="text-left">Project Type</th>
                <th class="text-left">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in billing.detail" :key="item.project.id">
                <template>
                  <td style="width: 45%; padding: 2rem 1.25rem !important">
                    <router-link :to="'/billing/' + item.project.id">
                      {{ item.project.name }}
                    </router-link>
                  </td>
                  <td>{{ item.project.payment_method }}</td>
                  <td>{{ toIDRWithDotFormat(item.billed) }}</td>
                </template>
              </tr>

              <tr>
                <td style="padding-left: 0px; padding-right: 0px">
                  <div class="d-flex align-center px-4 rounded-l-lg total-text">
                    Total
                  </div>
                </td>
                <td style="padding-right: 0px; padding-left: 0px">
                  <div
                    class="d-flex align-center px-4 rounded-l-lg total-text"
                  ></div>
                </td>
                <td style="padding-right: 0px; padding-left: 0px">
                  <div
                    class="d-flex align-center px-4 rounded-r-lg big-idr-text"
                  >
                    {{ toIDRWithDotFormat(billing.total) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>

      <v-card-text v-else>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">List Project</th>
                <th class="text-left">Project Type</th>
                <th class="text-left">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style="
                    width: 100%;
                    padding: 2rem 1.25rem !important;
                    text-align: center;
                  "
                  colspan="3"
                >
                  No data available
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { useNamespacedState } from "vuex-composition-helpers";

export default {
  data() {
    return {
      loading: false,
      billing: null,
    };
  },
  setup() {
    const { isDailyCostDataExist } = useNamespacedState("BILLING", [
      "isDailyCostDataExist",
    ]);

    return {
      toIDRWithDotFormat,
      isDailyCostDataExist,
    };
  },
  computed: {
    currentOrg() {
      const org = localstorage.getItem("currentOrg");
      return JSON.parse(org);
    },
    isSuperAdmin() {
      const role = localstorage.getItem("role");
      const isSuperAdmin = role && role === "Superadmin";
      return isSuperAdmin;
    },
  },
  methods: {
    async getProjects() {
      this.loading = true;

      try {
        const userEndpoint = "/billing/monthly-cost";
        const superadminEndpoint =
          "/superadmin/billing/monthly-cost/" + this.currentOrg.id;
        const endpoint = this.isSuperAdmin ? superadminEndpoint : userEndpoint;
        const res = await api.GET(endpoint);

        this.billing = res.data;
      } catch (err) {
        let errmsg =
          "Sorry, an error occurred while displaying organization billing";

        if (err && err.data && err.data.data) {
          errmsg = err.data.data;
        }

        if (
          err &&
          err.data &&
          err.data.data &&
          err.data.data !== "record not found"
        ) {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      }

      this.loading = false;
    },
  },
  mounted() {
    this.getProjects();
  },
};
</script>

<style scoped>
.total-text {
  height: 80px;
  background-color: #f1f2f2;
  margin-top: 20px;
  font-family: Fira Sans;
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: 29px;
  letter-spacing: 0em;
  text-align: left;
}

.big-idr-text {
  height: 80px;
  background-color: #f1f2f2;
  margin-top: 20px;
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 50px;
  letter-spacing: 0;
  text-align: left;
}
</style>
