<template>
  <div>
    <!-- head -->
    <v-row>
      <v-col class="d-flex flex-column flex-md-row align-center py-0">
        <div class="headline font-weight-bold font--text ma-4">
          History Billing
        </div>

        <v-spacer />

        <v-menu offset-y :close-on-click="true" :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              height="45"
              depressed
              :ripple="false"
              outlined
              v-bind="attrs"
              v-on="on"
              style="border: 1px solid #ece9f1; margin-right: 20px"
            >
              <p class="black--text mb-0" style="font-weight: 400">
                {{ range.start.toLocaleDateString("id-ID") }} -
                {{ range.end.toLocaleDateString("id-ID") }}
              </p>

              <v-icon class="ml-2" style="width: 13px; height: 13px">
                $vuetify.icons.calendarIcon
              </v-icon>
            </v-btn>
          </template>

          <vc-date-picker v-model="range" is-range />
        </v-menu>

        <v-btn width="150" height="45" class="secondary fz-14 ma-4" depressed>
          Download
        </v-btn>
      </v-col>
    </v-row>

    <div style="height: 30px; width: auto" />

    <!-- body -->
    <v-data-table
      :headers="headers"
      :items="billings"
      :items-per-page="5"
      class="elevation-0"
      hide-default-footer
    >
      <!-- date -->
      <template v-slot:item.date="{ item }">
        <div>
          {{ $moment(item.date).format("DD/MM/YYYY") }}
        </div>
      </template>

      <!-- billed -->
      <template v-slot:item.billed="{ item }">
        <div>{{ toIDRWithDotFormat(item.billed) }}</div>
      </template>

      <!-- action -->
      <template v-slot:item.action="{ item }">
        <label
          class="primary--text linkpointer"
          @click="openDetailPopup(item.id, item.date, item.billed)"
        >
          Detail
        </label>
      </template>

      <!-- pagination -->
      <template v-slot:footer="{ props }">
        <custom-footer-datatable :props="props" />
      </template>
    </v-data-table>

    <Detailpopup
      v-model="displayDetailPopup"
      :projectid="projectid"
      :date="date"
      :billed="billed"
      :instance-details="instanceDetails"
      :storage-details="storageDetails"
    />
  </div>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import Detailpopup from "./detailpopup.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  components: {
    Detailpopup,
  },
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  data() {
    return {
      headers: [
        { text: "Date", value: "date", sortable: false },
        { text: "Billed", value: "billed", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
      billings: [],
      range: {
        start: this.$moment().subtract(6, "days").toDate(),
        end: new Date(),
      },
      // detail popup props
      displayDetailPopup: false,
      date: "",
      billed: 0,
      instanceDetails: [],
      storageDetails: [],
    };
  },
  computed: {
    projectid() {
      let projectid = "";

      const currentProj = JSON.parse(localstorage.getItem("currentProj"));

      if (currentProj && currentProj.id) {
        projectid = currentProj.id;
      }

      return projectid;
    },
  },
  methods: {
    async fetchBillings() {
      try {
        const res = await api.POST("/billing/history-personal", {
          project_id: this.projectid,
          start: this.$moment(this.range.start).format("YYYY-MM-DD"),
          end: this.$moment(this.range.end).format("YYYY-MM-DD"),
        });

        this.billings = res.data;
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying billing list"
        );
      }
    },
    async fetchDetail(id) {
      try {
        const res = await api.GET("/billing/detail/" + id);
        // const res = await api.GET(
        //   "/billing/detail/c29447a2-a450-4ad4-b772-3cb9d5bac642"
        // );

        const detailPopup = res.data;

        if (detailPopup.instances && detailPopup.instances.length) {
          this.instanceDetails = detailPopup.instances.map((instance) => {
            const { service_name, ram, v_cpu, price_per_hours, usage, billed } =
              instance;

            return {
              service_name,
              spesification: `${ram} GB / ${v_cpu} CPUs`,
              price: toIDRWithDotFormat(price_per_hours) + "/hours",
              usage: usage ? usage : "-",
              billed: toIDRWithDotFormat(billed),
            };
          });
        }

        if (detailPopup.storages && detailPopup.storages.length) {
          this.storageDetails = detailPopup.storages.map((storage) => {
            const { service_name, price_per_month, billed } = storage;

            return {
              service_name,
              spesification: "-",
              type: "-",
              price: toIDRWithDotFormat(price_per_month) + "/mo",
              billed: toIDRWithDotFormat(billed),
            };
          });
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying history billing detail"
        );
      }
    },
    openDetailPopup(id, date, billed) {
      this.fetchDetail(id);
      this.displayDetailPopup = true;
      this.date = date;
      this.billed = this.formatRupiah(billed);
    },
    formatRupiah(num) {
      return toIDRWithDotFormat(num);
    },
  },
  mounted() {
    this.fetchBillings();
  },
  watch: {
    range() {
      console.log({ ...this.range });
      this.vcalendar = false;
      this.fetchBillings();
    },
  },
};
</script>
