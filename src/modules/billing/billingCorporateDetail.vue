<template>
  <div>
    <v-row v-if="billingDetail && billing" class="mb-3">
      <WhiteboxAbove
        :detail="billingDetail"
        :billing="billing"
      />
    </v-row>

    <template v-if="$route.params.id !== 'all-project'">
      <v-row>
        <v-col cols="12">
          <v-card class="rounded-lg pa-4" flat>
            <v-card-text class="d-flex flex-row align-center">
              <div class="headline font-weight-bold font--text">
                History Billing
              </div>
              <v-spacer />

              <!-- <div style="height: auto; width: 20px" />

              <v-menu
                v-if="isDevModePrepaid"
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="dates"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :style="{ width: '10px' }"
                    v-model="datesFormatted"
                    label="Picker in menu"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dates" no-title scrollable range>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="
                      () => {
                        $refs.menu.save(dates);
                        filterByDates();
                      }
                    "
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>

              <div style="height: auto; width: 20px" />

              <v-btn
                class="secondary"
                dark
                depressed
                height="45"
                width="111"
                style="font-size: 14px"
              >
                Download
              </v-btn> -->
            </v-card-text>

            <v-card-text>
              <v-data-table
                hide-default-footer
                :headers="historyHeaders"
                :items="projectBilling && projectBilling.length ? projectBilling : []"
                :items-per-page="10"
              >
                <template v-slot:item.billed="{ item }">
                  {{ toIDRWithDotFormat(Math.round(item.billed)) }}
                </template>
                <template v-slot:item.date="{ item }">
                  {{ moment(item.date).format("DD/MM/YYYY") }}
                </template>
                <template v-slot:item.action="{ item }">
                  <router-link
                    :to="`/billing/monthly-cost/${projectID}/history/${$moment(
                      item.date
                    ).format('YYYY-MM-DD')}`"
                  >
                    Detail
                  </router-link>
                </template>
                <template v-slot:no-data>
                  <div class="mt-8">
                    <p class="font-weight-bold fz-16">
                      Looks like you don’t have any History Billing
                    </p>
                    <p class="accent-text font-weight-light fz-12">
                      Build and release faster with scalable instance products
                      in the cloud. Provides flexible server configurations
                      sized for any application, industry leading price to
                      performance, and predictable pricing that is the same
                      across regions and usage volumes.
                    </p>
                  </div>
                </template>
                <template
                  v-slot:footer="{ props }"
                  v-if="projectBilling.length"
                >
                  <custom-footer-datatable :props="props" />
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- history debit -->
      <HistoryDebit
        v-if="
          isDevModePrepaid &&
          billing &&
          // billing.project will not exist in summary
          (!billing.project ||
            // billing.project will exist in project
            (billing.project &&
              billing.project.payment_method !== 'postpaid' &&
              billing.project.postpaid_type !== 'usage'))
        "
        :billing="billing"
      />
    </template>
  </div>
</template>

<script>
import billingdetail from "./billingdetail";
import {
  ref,
  watch,
  onMounted,
  computed,
  reactive,
} from "@vue/composition-api";
import {
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { toIDRWithDotFormat } from "@/lib/formatter";
import moment from "moment";
import HistoryDebit from "./billing-corporate-detail/HistoryDebit.vue";
import WhiteboxAbove from "./billing-corporate-detail/WhiteboxAbove.vue";
import localstorage from "@/lib/localstorage";

// const isDevModePrepaid = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevModePrepaid = true;

export default {
  components: {
    HistoryDebit,
    WhiteboxAbove,
  },
  data: () => ({
    isDevModePrepaid,
    menu: false,
  }),
  computed: {
    datesFormatted() {
      return this.dates.join(" - ");
    },
  },
  setup(props, context) {
    // const { id: projectID } = context.root.$route.params;
    const project = JSON.parse(localstorage.getItem("currentProj"));
    const projectID = project.id
    
    const {
      fetchBillingOrganization,
      postBillingOrganization,
      getBilling,
      fetchBillingHistory,
      getBillingDetail,
    } = useNamespacedActions("BILLING", [
      "fetchBillingOrganization",
      "postBillingOrganization",
      "getBilling",
      "fetchBillingHistory",
      "getBillingDetail",
    ]);

    const { projectBilling, billing, billingDetail } = useNamespacedState(
      "BILLING",
      ["projectBilling", "billing", "billingDetail"]
    );

    const historyHeaders = ref([
      { text: "Date", value: "date" },
      { text: "Billed", value: "billed" },
      { text: "Action", value: "action", width: 100 },
    ]);

    const getBillingTypeLabel = (type) => {
      if (type == "PPU") return "Pay Per Use";
      else if (type == "PPM") return "Pay Per Metrics";
      else if (type == "Other") return "One Time";
    };

    const sortedBillingHistory = ref([]);

    const currentPeriod = ref("");
    let dates = ref([]);
    let from = ref(null);
    let to = ref(null);

    onMounted(async () => {
      if (isDevModePrepaid) {
        const err = await getBilling(projectID);

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
          context.root.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }
      } else {
        await fetchBillingOrganization();
      }

      const isPostpaidFixedFullCycle =
        billing.value &&
        billing.value.project &&
        billing.value.project.postpaid_type &&
        billing.value.project.postpaid_type === "fixed" &&
        billing.value.project.postpaid_fixed_type &&
        billing.value.project.postpaid_fixed_type === "full_cycle";

      if (isPostpaidFixedFullCycle) {
        historyHeaders.value = [
          { text: "Date", value: "date" },
          { text: "Action", value: "action" },
        ];
      }

      await fetchBillingHistory({
        project_id: projectID,
        start: billing.value.date_start,
        end: billing.value.date_end,
      });

      await getBillingDetail({
        project_id: projectID,
        start: billing.value.date_start,
        end: billing.value.date_end,
      });

      from.value = moment(billing.value.date_start);
      to.value = moment(billing.value.date_end);
      currentPeriod.value = `${from.value.format(
        "DD MMMM YYYY"
      )} - ${to.value.format("DD MMMM YYYY")}`;
    });

    return {
      billingDetail,
      dates,
      projectID,
      fetchBillingHistory,
      projectBilling,
      sortedBillingHistory,
      billing,
      historyHeaders,
      currentPeriod,
      toIDRWithDotFormat,
      moment,
      vcalendar: ref(false),
      getBillingTypeLabel,
    };
  },
};
</script>

<style>
.border-bottom-none {
  border: none !important;
}
</style>
<style lang="scss" scoped>
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

.project-name {
  font-weight: bold;
  font-size: 21px;
  display: block;
  color: #1f60a8;
}

.history {
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 140%;
  color: #556272;
}
.total {
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  line-height: 140%;
  color: #556272;
}
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

.page-content {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #556272;
}

.detail-btn {
  cursor: pointer;
}

.date {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #a5b3bf;
}

.amount {
  font-style: normal;
  font-weight: bold;
  line-height: 140%;
  color: #556272;
  font-size: 14px;
}

.detail {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 140%;
  color: #1f60a8;
}

.bill-title {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 160%;
  color: #556272;
}

.history-billing {
  table-layout: auto;
}

.history-billing tr {
  border-bottom: thin solid;
}

td {
  height: 60px !important;
}

.v-data-table {
  ::v-deep table {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > td,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
  font-size: 14px;
}
</style>
