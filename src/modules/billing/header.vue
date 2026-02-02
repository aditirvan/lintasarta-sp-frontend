<template>
  <v-card flat class="rounded-lg pa-2 mt-3">
    <v-card-text>
      <div
        class="d-flex flex-column flex-md-row justify-space-between align-center"
      >
        <p class="fz-21 font-weight-bold">
          {{ projectname }}
        </p>

        <v-btn
          depressed
          class="secondary"
          style="margin-bottom: 20px"
          height="45"
          max-width="197"
          @click="projectCheck"
        >
          Top Up Balance
        </v-btn>

        <!-- dialog to select a project -->
        <Dialogproject v-model="displayProjectDialog" />
      </div>

      <p style="margin-bottom: 18px">
        *This is the current Cost for your usage this billing period. A
        breakdown of your cost is available below
      </p>

      <v-row>
        <v-col cols="12" md="4">
          <div class="balance-card">
            <p class="card-title">
              <!-- The Remaining Balance -->
              Total Daily Billed
            </p>

            <p class="card-idr">
              IDR {{ totalDailyBilled.toLocaleString("id-ID") }}
            </p>
          </div>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="billingTypes"
        :items-per-page="5"
        class="elevation-0"
        hide-default-footer
      >
        <!-- billing_type -->
        <template v-slot:item.billing_type="{ item }">
          <router-link
            class="primary--text linkpointer"
            :to="'/billing/type/' + item.billing_id + '?type=' + item.type"
          >
            {{ item.billing_type }}
          </router-link>

          <!-- <label
            class="primary--text linkpointer"
            @click="openDetailPopup(item)"
          >
            {{ item.billing_type }}
          </label> -->
        </template>

        <!-- billed -->
        <template v-slot:item.billed="{ item }">
          <p v-if="item.service_amount === null" class="font-weight-bold">
            Total
          </p>

          <p>IDR {{ formatRupiah(item.billed) }}</p>
        </template>
      </v-data-table>
    </v-card-text>

    <Detailpopup2
      v-model="displayDetailPopup"
      :title="title"
      :date="date"
      :billed="billed"
      :instance-details="instanceDetails"
      :storage-details="storageDetails"
    />
  </v-card>
</template>

<script>
import Dialogproject from "./dialogproject.vue";
import findprojectbyname from "../project/findprojectbyname";
import { useNamespacedMutations } from "vuex-composition-helpers";
import { PROJECT } from "../project/namespace";
import { SUPERADMIN } from "../superadmin/namespace";
import Detailpopup2 from "./detailpopup2";
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";

export default {
  components: {
    Dialogproject,
    Detailpopup2,
  },
  data() {
    return {
      displayProjectDialog: false,
      totalDailyBilled: 0,
      projectname: "",
      headers: [
        { text: "Billing Type", value: "billing_type", sortable: false },
        { text: "Service Amount", value: "service_amount", sortable: false },
        { text: "Billed", value: "billed", sortable: false },
      ],
      billingTypes: [],
      displayDetailPopup: false,
      title: "",
      date: "",
      billed: "0",
      instanceDetails: [],
      storageDetails: [],
    };
  },
  computed: {
    projectid() {
      return JSON.parse(localstorage.getItem("currentProj")).id;
    },
  },
  setup() {
    const { setprojectname } = useNamespacedMutations(PROJECT, [
      "setprojectname",
    ]);
    const { setCurrentProj } = useNamespacedMutations(SUPERADMIN, [
      "setCurrentProj",
    ]);
    return {
      setprojectname,
      setCurrentProj,
    };
  },
  methods: {
    projectCheck() {
      if (this.projectname) {
        this.$router.push("/billing/payment");
      } else {
        this.displayProjectDialog = true;
      }
    },
    async fetchTotalDailyBilled() {
      try {
        const res = await api.GET("/billing/total-unpaid");
        this.totalDailyBilled = res.data;
      } catch (err) {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.data === "No bill yet"
        ) {
          this.totalDailyBilled = 0;
        } else {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "Sorry, an error occurred while displaying Total Daily Billed"
          );
        }
      }
    },
    async setProjectName() {
      if (this.$route.params && this.$route.params.projectname) {
        const projectname = this.$route.params.projectname;
        try {
          const project = await findprojectbyname(projectname);
          if (project) {
            this.setprojectname(projectname);
            this.setCurrentProj(project);
            this.projectname = project.name;
          }
        } catch {
          this.$router.push("/notfound");
        }
      } else {
        this.$router.push("/notfound");
      }
    },
    formatRupiah(num) {
      return num.toLocaleString("id-ID");
    },
    openDetailPopup(item) {
      this.displayDetailPopup = true;

      this.title = item.name;

      this.billed = item.billed.toLocaleString("id-ID");

      if (item.date) {
        this.date = "- Cost for" + this.$moment(item.date).format("DD/MM/YYYY");
      }

      if (item.instances && item.instances.length) {
        this.instanceDetails = item.instances.map((instance) => {
          const { service_name, ram, v_cpu, price_per_hours, usage, billed } =
            instance;

          return {
            service_name,
            spesification: `${ram} GB / ${v_cpu} CPUs`,
            price: "IDR " + price_per_hours.toLocaleString("id-ID") + "/hours",
            usage: usage ? usage : "-",
            billed: "IDR " + billed.toLocaleString("id-ID"),
          };
        });
      }

      if (item.storages && item.storages.length) {
        this.storageDetails = item.storages.map((storage) => {
          const { service_name, price_per_month, billed } = storage;

          return {
            service_name,
            spesification: "-",
            type: "-",
            price: "IDR " + price_per_month.toLocaleString("id-ID") + "/mo",
            billed: "IDR " + billed.toLocaleString("id-ID"),
          };
        });
      }
    },
    async fetchBillingTypes() {
      try {
        const res = await api.POST("/billing/monthly-cost/by-type", {
          project_id: this.projectid,
          year: parseInt(this.$moment().format("YYYY")),
          month: parseInt(this.$moment().format("M")),
        });

        if (res.data.list.length) {
          let respondFormatted = res.data.list.map((type) => {
            const {
              name,
              service_amount,
              billed,
              instances,
              storages,
              billing_id,
            } = type;

            return {
              ...type,
              billing_type: name,
              service_amount,
              billed,
              instances,
              storages,
              billing_id,
            };
          });

          respondFormatted[respondFormatted.length] = {
            billing_type: "",
            service_amount: null,
            billed: res.data.total,
          };

          this.billingTypes = respondFormatted;
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Billing Type list"
        );
      }
    },
  },
  mounted() {
    this.setProjectName();
    this.fetchTotalDailyBilled();
    this.fetchBillingTypes();
  },
};
</script>

<style scoped>
.balance-card {
  padding: 23px 20px;
  border: 1px solid #1f60a8;
  border-radius: 10px;
  background-color: rgba(31, 96, 168, 0.02);
  margin-bottom: 28px;
}

.card-title {
  margin-bottom: 10px;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0em;
  text-align: left;
}

.card-idr {
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: #1f60a8;
}
</style>
