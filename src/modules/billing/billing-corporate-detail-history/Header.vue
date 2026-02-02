<template>
  <v-row>
    <v-col v-if="loading" cols="12" class="py-0">
      <p class="text-center">
        <beat-loader color="gray" size="10px" class="mr-2" />
      </p>
    </v-col>

    <template v-else>
      <v-col cols="12" class="py-0">
        <p class="project-name">
          <!-- {{ projectBilling[0].project.name || "" }} -->
          All Project
        </p>
      </v-col>

      <v-col class="d-flex mb-2 pt-0">
        <div>
          <p class="font-weight-bold fz-21 mb-4 mr-4">
            <!-- Cost for {{ moment(selectedDate).format("DD MMMM YYYY") }} -->
            Cost for {{ $moment(date).format("DD MMMM YYYY") }}
          </p>

          <p>
            This is the current cost for your usage this billing period. A
            breakdown of your cost is available below.
          </p>
        </div>

        <v-spacer />

        <div class="summary-billed">
          <b class="font--text">Billed</b>

          <p class="total-billed">
            <!-- {{ IDRformat.format(projectBilling[0].billed) }} -->
            {{ billed.toLocaleString("id-ID") }}
          </p>
        </div>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";

export default {
  data() {
    return {
      loading: false,
      billed: 0,
    };
  },
  computed: {
    date() {
      return this.$route.params.date;
    },
  },
  methods: {
    async getTotalBilled() {
      this.loading = true;

      try {
        const { date } = this;

        const role = localstorage.getItem("role");
        const isSuperAdmin = role && role === "Superadmin";

        const currentOrg = localstorage.getItem("currentOrg");
        const org = JSON.parse(currentOrg);

        const admin = `/superadmin/billing/monthly-cost/summary/total-billed/${org.id}/${date}`;
        const user = "/billing/monthly-cost/summary/total-billed/" + date;
        const endpoint = isSuperAdmin ? admin : user;

        const res = await api.GET(endpoint);

        const { billed } = res.data;

        this.billed = billed;
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying data";
        const thereIsErrorMessage = err && err.response && err.response.data;

        if (thereIsErrorMessage && err.response.data.message) {
          errmsg = err.response.data.message;
        }

        if (
          thereIsErrorMessage &&
          err.response.data.data !== "record not found"
        ) {
          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      }

      this.loading = false;
    },
  },
  mounted() {
    this.getTotalBilled();
  },
};
</script>

<style scoped>
.project-name {
  font-weight: bold;
  font-size: 21px;
  display: block;
  color: #1f60a8;
}

.summary-billed {
  padding: 1.5rem;
  background: rgba(44, 148, 210, 0.02);
  border: 1px solid #2c94d2;
  border-radius: 10px;
  min-width: 300px;
}

.summary-billed p {
  font-size: 36px;
  color: #1f60a8;
  font-weight: 600;
  margin-bottom: 0;
}
</style>
