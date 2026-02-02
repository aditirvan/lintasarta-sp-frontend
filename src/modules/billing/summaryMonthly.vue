<template>
  <div>
    <v-card v-if="loading" color="white" flat>
      <v-card-text class="pa-8">
        <p class="text-center">
          <beat-loader color="gray" size="10px" class="mr-2" />
        </p>
      </v-card-text>
    </v-card>

    <template v-else>
      <v-card v-if="detail" color="white" flat>
        <v-card-text class="pa-8">
          <h6 class="text-h6 font-weight-bold">Summary Monthly</h6>

          <v-row class="mt-4">
            <v-col>
              <b>Report ID</b>
              <p class="mt-4">
                {{ detail.id }}
              </p>
            </v-col>

            <v-col>
              <b>Billing Account</b>
              <p class="mt-4">
                {{ detail.billing_account }}
              </p>
            </v-col>

            <v-col>
              <b>Status</b>
              <p
                class="mt-4"
                :class="{
                  'green--text': detail.status === 'PAID',
                }"
              >
                {{ detail.status }}
              </p>
            </v-col>

            <v-col>
              <b>Project Name</b>
              <p class="mt-4">
                {{ detail.project.name }}
              </p>
            </v-col>

            <v-col>
              <b>Business VAT ID</b>
              <p class="mt-4">
                {{ detail.project.vat_id }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card v-if="detail" color="white" flat class="mt-8">
        <v-card-text class="pa-8">
          <!-- tbl -->
          <v-data-table
            :hide-default-footer="true"
            :headers="tblHeaders"
            :items-per-page="-1"
            :items="list"
            class="mt-8"
          >
            <template v-slot:item.created_at="{ item }">
              {{ $moment(item.created_at).format("DD/MM/YYYY hh:mm:ss") }}
            </template>
            <template v-slot:item.DeletedAt="{ item }">
              <div v-if="item.DeleedAt">
                {{ $moment(item.DeletedAt).format("DD/MM/YYYY hh:mm:ss") }}
              </div>
              <div v-else>-</div>
            </template>
            <template v-slot:item.qty="{ item }"> {{ item.qty }} h </template>

            <template v-slot:item.service_type="{ item }">
              <div v-if="titleCase(item.service_type) == 'OS CHARGING'">
                OPERATING SYSTEM
              </div>
              <div v-else>{{ titleCase(item.service_type) }}</div>
            </template>
            <template v-slot:item.price="{ item }">
              <b>
                {{ toIDRWithDotFormat(item.price) }} / {{ item.price_unit }}
              </b>
            </template>

            <template v-slot:item.discount_value="{ item }">
              <b> {{ toIDRWithDotFormat(item.discount_value) }} </b>
            </template>

            <template v-slot:item.billed="{ item }">
              <b> {{ toIDRWithDotFormat(item.billed) }} </b>
            </template>
          </v-data-table>

          <!-- totals -->
          <v-row class="mr-2">
            <v-col cols="9"/>
            <v-col cols="3">
              <v-row class="grey lighten-4">
                <v-col>
                  <b>Subtotal</b>
                </v-col>
                <v-col :style="{textAlign:'right'}">
                  <b> {{ toIDRWithDotFormat(detail.price) }} </b>
                </v-col>
              </v-row>

              <v-row class="grey lighten-4 mt-1">
                <v-col>
                  <b> Total Discount </b>
                </v-col>
                <v-col :style="{textAlign:'right'}">
                  <b> {{ toIDRWithDotFormat(detail.total_discount) }} </b>
                </v-col>
              </v-row>

              <v-row class="grey lighten-4 mt-1">
                <v-col>
                  <b> Credit </b>
                </v-col>
                <v-col :style="{textAlign:'right'}">
                  <b class="red--text">
                    {{ toIDRWithDotFormat(detail.credit) }}
                  </b>
                </v-col>
              </v-row>

              <!-- <v-row v-if="isPostpaid" class="grey lighten-4 mt-4">
                <v-col>
                  <b> Total End VAT </b>
                </v-col>
                <v-col>
                  <b class="red--text">
                    {{ toIDRWithDotFormat(detail.total_end_vat) }}
                  </b>
                </v-col>
              </v-row>

              <v-row v-if="isPostpaid" class="grey lighten-4 mt-4">
                <v-col>
                  <b> VAT (10%) </b>
                </v-col>
                <v-col>
                  <b class="red--text">
                    {{ toIDRWithDotFormat(detail.vat) }}
                  </b>
                </v-col>
              </v-row> -->

              <v-row v-if="isPostpaid" class="grey lighten-4 mt-1">
                <v-col>
                  <b> PPN ({{ detail.ppn }}%) </b>
                </v-col>
                <v-col :style="{textAlign:'right'}">
                  <b>
                    {{
                      toIDRWithDotFormat(detail.ppn_value ? detail.ppn_value : 0)
                    }}
                  </b>
                </v-col>
              </v-row>

              <v-row class="mt-1 primary">
                <v-col>
                  <b class="white--text">Total</b>
                </v-col>
                <v-col :style="{textAlign:'right'}">
                  <b class="white--text">
                    {{ toIDRWithDotFormat(detail.billed - detail.credit) }}
                  </b>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </div>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup(props, context) {
    return {
      toIDRWithDotFormat,
    };
  },
  data() {
    return {
      // tblHeaders: [
      //   { text: "Service Name", value: "service_name" },
      //   { text: "Created At", value: "created_at" },
      //   { text: "Deleted At", value: "DeletedAt" },
      //   { text: "Service Type", value: "service_type" },
      //   { text: "Usage", value: "qty" },
      //   { text: "Price", value: "amount" },
      //   { text: "Total", value: "total" },
      // ],
      list: [],
      detail: null,
      loading: false,
    };
  },
  computed: {
    isPostpaid() {
      return (
        this.detail &&
        this.detail.project &&
        this.detail.project.payment_method === "postpaid"
      );
    },
    satuanQty() {
      if (this.detail && this.detail.project) {
        if (this.detail.project.postpaid_fixed_type === "full_cycle") {
          return "month";
        }

        if (this.detail.project.postpaid_fixed_type === "prorate") {
          return "days";
        }
      }

      return "h";
    },
    org() {
      return JSON.parse(localstorage.getItem("currentOrg"));
    },
    tblHeaders() {
      return this.isPostpaidFixed
        ? [
            { text: "Service Name", value: "service_name" },
            { text: "Service Type", value: "service_type" },
            // { text: "Usage", value: "usage" },
          ]
        : [
            { text: "Service Name", value: "service_name" },
            { text: "Service Type", value: "service_type" },
            { text: "Price", value: "price" },
            { text: "Usage", value: "usage" },
            { text: "Discount Value", value: "discount_value" },
            { text: "Total", value: "billed", align: "end" },
          ];
    },
    isPostpaidFixed() {
      const postpaidFixed =
        this.detail &&
        this.detail.project &&
        this.detail.project.postpaid_type === "fixed";

      return postpaidFixed;
    },
  },
  methods: {
    async getSummaryMonthlyDetail() {
      this.loading = true;

      if (this.org && this.org.id) {
        try {
          const id = this.$route.params.id;
          const res = await api.GET(
            `/billing/v2/summary/monthly/${id}`
          );
          this.detail = res.data.detail;
          this.list = res.data.services || [];
        } catch {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "Sorry, an error occurred while displaying summary monthly detail"
          );
        }
      } else {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, organization id not found"
        );
      }

      this.loading = false;
    },
    titleCase(s) {
      if (s == "OBJECT_STORAGE"){
        return "DEKA BOX";
      }


      return s
        .toLowerCase()
        .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
        .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase()) // First char after each -/_
        .toUpperCase();
    },
  },
  mounted() {
    this.getSummaryMonthlyDetail();
  },
};
</script>
