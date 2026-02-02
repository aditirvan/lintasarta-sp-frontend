<template>
  <v-card flat class="rounded-lg pa-2 mt-3">
    <v-card-text>
      <v-row>
        <v-col>
          <p class="fz-21 font-weight-bold">
            {{ title }}
          </p>

          <p class="mb-30px">
            *This is the current Cost for your usage this billing period. A
            breakdown of your cost is available below
          </p>
        </v-col>

        <v-col cols="12" md="4">
          <div class="balance-card">
            <p class="card-title">Total</p>

            <p class="card-idr">
              IDR {{ total.toLocaleString("id-ID") }}
              <!-- IDR 0 -->
            </p>
          </div>
        </v-col>
      </v-row>

      <h1 class="card-title2 mb-30px">Instance Detail</h1>

      <v-data-table
        :headers="instanceDetailHeaders"
        :items="instanceDetails"
        :items-per-page="99"
        class="elevation-0 mb-30px"
        hide-default-footer
      >
        <!-- spesification -->
        <template v-slot:item.spesification="{ item }">
          <p class="d-flex align-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-if="item.spesification"
                  src="@/assets/blue-circle-mark.svg"
                  alt="small-blue-circle-mark"
                  class="mr-2"
                  style="cursor: pointer"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>

              <span>This Service Has Been Changed Before</span>
            </v-tooltip>

            <!-- <img
              v-if="item.spesification"
              src="@/assets/blue-circle-mark.svg"
              alt="small-blue-circle-mark"
              class="mr-2"
              style="cursor: pointer"
              @click="openSpecPopup(item.id)"
            /> -->

            {{ item.spesification }}
          </p>
        </template>

        <!-- billed -->
        <template v-slot:item.billed="{ item }">
          <p
            v-if="
              !item.service_name &&
              !item.spesification &&
              !item.price &&
              !item.usage
            "
          >
            <b>Total</b>
          </p>

          <p>{{ item.billed }}</p>
        </template>

        <!-- usage -->
        <template v-slot:item.usage="{ item }">
          <p class="d-flex align-center">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-if="item.usage"
                  src="@/assets/blue-circle-mark.svg"
                  alt="small-blue-circle-mark"
                  class="mr-2"
                  style="cursor: pointer"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>

              <span
                >Service Usage Has Exceeded <b>95%</b> In <br />
                One Month, Payment Will Be Shifted <br />
                From Hourly To Monthly</span
              >
            </v-tooltip>

            {{ item.usage }}
          </p>
        </template>

        <!-- pagination -->
        <!-- <template v-slot:footer="{ props }">
          <custom-footer-datatable :props="props" />
        </template> -->
      </v-data-table>

      <h1 class="card-title2 mb-30px">Storage Detail</h1>

      <v-data-table
        :headers="storageDetailHeaders"
        :items="storageDetails"
        :items-per-page="99"
        class="elevation-0 mb-30px"
        hide-default-footer
      >
        <!-- billed -->
        <template v-slot:item.billed="{ item }">
          <p
            v-if="
              !item.service_name &&
              !item.spesification &&
              !item.type &&
              !item.price
            "
          >
            <b>Total</b>
          </p>

          <p>{{ item.billed }}</p>
        </template>

        <!-- pagination -->
        <!-- <template v-slot:footer="{ props }">
          <custom-footer-datatable :props="props" />
        </template> -->
      </v-data-table>
    </v-card-text>

    <dialogspecification
      v-model="displaySpecPopup"
      @close="displaySpecPopup = false"
    />
  </v-card>
</template>

<script>
import api from "@/lib/api";
import dialogspecification from "./dialogspecification.vue";

export default {
  components: {
    dialogspecification,
  },
  data() {
    return {
      loading: false,
      date: "",
      total: 0,
      instanceDetailHeaders: [
        { text: "Service Name", value: "service_name", sortable: false },
        { text: "Spesification", value: "spesification", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Usage", value: "usage", sortable: false },
        { text: "Billed", value: "billed", sortable: false },
      ],
      instanceDetails: [],
      storageDetailHeaders: [
        { text: "Service Name", value: "service_name", sortable: false },
        { text: "Spesification", value: "spesification", sortable: false },
        { text: "Type", value: "type", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Billed", value: "billed", sortable: false },
      ],
      storageDetails: [],
      displaySpecPopup: false,
    };
  },
  computed: {
    title() {
      let title = "Other services";

      if (this.$route.query.type === "PPU") {
        title = "Pay per Use (PPU)";
      }

      if (this.$route.query.type === "PPM") {
        title = "Pay per Metrics (PPM)";
      }

      if (this.date) {
        title = title + " - " + this.$moment(this.date).format("DD/MM/YYYY");
      }

      return title;
    },
  },
  methods: {
    async getTypeDetails() {
      this.loading = true;

      try {
        const res = await api.GET(
          "/billing/monthly-cost/by-type/detail/" +
            this.$route.params.id +
            "/" +
            this.$route.query.type
        );

        const { list, date, total } = res.data;

        if (list.instances && list.instances.length) {
          let newArr = list.instances.map((instance) => {
            const { service_name, ram, v_cpu, price_per_hours, usage, billed } =
              instance;

            return {
              service_name,
              spesification: `${ram} GB / ${v_cpu} CPUs`,
              price:
                "IDR " + price_per_hours.toLocaleString("id-ID") + "/hours",
              usage: usage ? usage : "-",
              billed: "IDR " + billed.toLocaleString("id-ID"),
            };
          });

          newArr[newArr.length] = {
            billed:
              "IDR " +
              list.instances
                .map((instance) => instance.billed)
                .reduce((a, b) => a + b, 0)
                .toLocaleString("id-ID"),
          };

          this.instanceDetails = newArr;
        }

        if (list.storages && list.storages.length) {
          let newArr = list.storages.map((storage) => {
            const { service_name, price_per_month, billed } = storage;

            return {
              service_name,
              spesification: "-",
              type: "-",
              price: "IDR " + price_per_month.toLocaleString("id-ID") + "/mo",
              billed: "IDR " + billed.toLocaleString("id-ID"),
            };
          });

          newArr[newArr.length] = {
            billed:
              "IDR " +
              list.storages
                .map((storage) => storage.billed)
                .reduce((a, b) => a + b, 0)
                .toLocaleString("id-ID"),
          };

          this.storageDetails = newArr;
        }

        this.date = date;
        this.total = total;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Billing Type Details"
        );
      }

      this.loading = false;
    },
    openSpecPopup(id) {
      this.displaySpecPopup = true;
    },
  },
  mounted() {
    this.getTypeDetails();
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

.card-title2 {
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: 29px;
  letter-spacing: 0em;
  text-align: left;
}

.mb-30px {
  margin-bottom: 30px;
}
</style>
