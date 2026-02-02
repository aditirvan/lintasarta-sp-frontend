<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">
            <v-row>
              <v-col class="d-flex flex-row align-center mb-2">
                <p class="font-weight-bold fz-21 mb-0 mr-4">
                  Cost for {{ currentPeriod }}
                </p>
                <!-- <v-icon
                  left
                  small
                  :color="
                    billingdetails.is_commitment_project ? '#FF8C5A' : '#A5B3BF'
                  "
                >
                  $vuetify.icons.antdesigntagsIcon
                </v-icon>
                <span
                  :style="{
                    color: billingdetails.is_commitment_project
                      ? '#FF8C5A'
                      : '#A5B3BF',
                  }"
                  >{{
                    billingdetails.is_commitment_project
                      ? "Commitment Project"
                      : "Non-Commitment Project"
                  }}</span
                > -->
                <v-spacer />
                <v-btn
                  width="197"
                  style="height: 45px; font-size: 14px"
                  depressed
                  class="secondary"
                  @click="downloadinvoice"
                  >Download Invoice</v-btn
                >
              </v-col>
            </v-row>

            <div class="page-content">
              This is the current cost for your usage this billing period. A
              breakdown of your cost is available below.
            </div>
            <v-row v-if="billingdetails.is_commitment_project" class="py-8">
              <v-col cols="4">
                <v-card
                  outlined
                  class="rounded-lg"
                  style="border: 1px solid #2c94d2; height: 100%"
                >
                  <v-card-text class="pa-4">
                    <div class="d-flex flex-row align-center">
                      <p class="mb-0 font-weight-bold">
                        Actual Cost
                        <span v-if="billingdetails.is_commitment_project">
                          (<span class="secondary--text"
                            >Discount
                            {{ billingdetails.commitment.discount }}%</span
                          >)</span
                        >
                      </p>
                      <v-spacer />
                      <popupquote
                        :offsetTop="25"
                        documentid="actualcost"
                        offset-y
                        :nudge-left="280"
                        allow-overflow
                      >
                        <template v-slot:activator="{ on }">
                          <v-icon
                            @click="
                              ($event) => {
                                on.click($event);
                              }
                            "
                            style="cursor: pointer"
                            left
                            id="actualcost"
                            >$vuetify.icons.infocircleIcon</v-icon
                          >
                        </template>
                        <v-card width="332">
                          <v-card-text class="fz-12"
                            >This actual cost with the total discount obtained
                            from the commitment project</v-card-text
                          >
                          <v-card-text class="pt-0 d-flex justify-end">
                            <v-btn
                              width="100"
                              height="25"
                              depressed
                              class="secondary fz-12"
                              >Okay</v-btn
                            >
                          </v-card-text>
                        </v-card>
                      </popupquote>
                    </div>
                    <div class="total">
                      {{ toIDRWithDotFormat(billingdetails.actual_cost) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card
                  outlined
                  class="rounded-lg"
                  style="border: 1px solid #2c94d2; height: 100%"
                >
                  <v-card-text class="pa-4">
                    <p class="mb-0 font-weight-bold">Commitment fee</p>
                    <div class="total">
                      {{ toIDRWithDotFormat(billingdetails.commitment_fee) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="4">
                <v-card
                  outlined
                  class="rounded-lg"
                  style="border: 1px solid #2c94d2; height: 100%"
                >
                  <v-card-text class="pa-4">
                    <p class="mb-0 font-weight-bold">Total billed</p>
                    <div class="total primary--text">
                      {{ toIDRWithDotFormat(billingdetails.billed) }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="3" class="text-right"> </v-col>
            </v-row>
            <v-row v-else>
              <v-col>
                <div class="total primary--text">
                  {{ toIDRWithDotFormat(billingdetails.billed) }}
                </div>
              </v-col>
            </v-row>
            <br />

            <v-data-table
              v-if="billinglist[0].amount + billinglist[1].amount == 0"
              :headers="headers"
              hide-default-footer
            >
              <template v-slot:no-data>
                <div class="mt-8">
                  <p class="font-weight-bold fz-16">
                    Looks like you don’t have any Service
                  </p>
                  <p class="accent-text font-weight-light fz-12">
                    Build and release faster with scalable instance products in
                    the cloud. Provides flexible server configurations sized for
                    any application, industry leading price to performance, and
                    predictable pricing that is the same across regions and
                    usage volumes.
                  </p>
                </div>
              </template>
            </v-data-table>

            <v-data-table
              v-else
              :headers="headers"
              :items="billinglist"
              hide-default-footer
            >
              <template v-slot:item.service="{ item }">
                <div
                  class="linkpointer"
                  @click="
                    () => {
                      if (item.service == 'Instance') {
                        openinstancedetail = true;
                      } else if (item.service == 'Storage') {
                        openstoragedetail = true;
                      }
                    }
                  "
                >
                  {{ item.service }}
                </div>
              </template>
              <template v-slot:item.spec="{ item }">
                <div style="white-space: pre-wrap">{{ item.spec }}</div>
              </template>

              <template v-slot:item.billed="{ item }">
                <div class="d-flex flex-row">
                  {{ toIDRWithDotFormat(item.billed) }}
                </div>
              </template>
              <template v-slot:body.append>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div>
                      <p class="font-weight-bold">Total</p>
                    </div>
                    <div class="d-flex flex-row justify-start">
                      {{ toIDRWithDotFormat(total) }}
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg pa-4 mt-3" flat>
          <v-card-text class="d-flex flex-row align-center">
            <div class="headline font-weight-bold font--text">
              History Billing
            </div>
            <v-spacer />
            <v-menu
              v-model="vcalendar"
              offset-y
              :close-on-click="true"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  height="45"
                  depressed
                  :ripple="false"
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  style="border: 1px solid #ece9f1"
                >
                  <p class="black--text mb-0" style="font-weight: 400">
                    {{ dates.start.toLocaleDateString("id-ID") }} -
                    {{ dates.end.toLocaleDateString("id-ID") }}
                  </p>
                  <v-icon class="ml-2" style="width: 13px; height: 13px"
                    >$vuetify.icons.calendarIcon</v-icon
                  >
                </v-btn>
              </template>
              <vc-date-picker
                @dayclick="dayclick($event)"
                v-model="dates"
                is-range
              />
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
            </v-btn>
          </v-card-text>

          <v-card-text>
            <v-data-table hide-default-footer :headers="historyheaders">
              <template v-slot:no-data>
                <div class="mt-8">
                  <p class="font-weight-bold fz-16">
                    Looks like you don’t have any History Billing
                  </p>
                  <p class="accent-text font-weight-light fz-12">
                    Build and release faster with scalable instance products in
                    the cloud. Provides flexible server configurations sized for
                    any application, industry leading price to performance, and
                    predictable pricing that is the same across regions and
                    usage volumes.
                  </p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <billingdetail />
    <dialogInstanceDetail
      title="Instance Detail"
      v-model="openinstancedetail"
      :list="billinginstance"
      @info="
        () => {
          opendialogSpecificationinfo = true;
        }
      "
    />
    <dialogInstanceDetail
      title="Storage Detail"
      v-model="openstoragedetail"
      :list="billingstorage"
      @info="
        () => {
          opendialogSpecificationinfo = true;
        }
      "
    />
    <dialogSpecificationinfo v-model="opendialogSpecificationinfo" />
  </div>
</template>

<script>
import billing from "./billing";
import billingdetail from "./billingdetail";
import { ref } from "@vue/composition-api";
import {
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
import { BILLING } from "./namespace";
import Vue from "vue";
import { toIDRWithDotFormat } from "@/lib/formatter";
import dialogInstanceDetail from "./dialogInstanceDetail";
import dialogSpecificationinfo from "./dialogSpecificationInfo";
const html2pdf = require("html2pdf.js");
import moment from "moment";
export default {
  components: {
    billingdetail,
    dialogInstanceDetail,
    dialogSpecificationinfo,
  },

  data: () => ({
    dates: {
      start: new Date(),
      end: new Date(),
    },
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(" - ");
    },
  },

  setup(props, context) {
    const { openModal } = billing();

    const history = ref([
      {
        date: "03/08/2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
      {
        date: "01/08/2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
      {
        date: "02/08/2020",
        cpu: 1000,
        ram: 1000,
        storage: 1000,
        ip: 1,
        ammount: 3060909,
      },
    ]);
    const { billingdetails } = useNamespacedState(BILLING, ["billingdetails"]);
    const {
      billingperservice,
      billinglist,
      total,
      billinginstance,
      billingstorage,
      firstdate,
      untildate,
    } = useNamespacedGetters(BILLING, [
      "billingperservice",
      "billinglist",
      "total",
      "billinginstance",
      "billingstorage",
      "firstdate",
      "untildate",
    ]);
    const headers = ref([
      { text: "Service Type", value: "service", sortable: false },
      { text: "Service Amount", value: "amount", sortable: false },
      { text: "Billed", value: "billed", align: "left", sortable: false },
    ]);
    const openinstancedetail = ref(false);
    const openstoragedetail = ref(false);
    const commitmentfee = ref(10000000);
    const downloadinvoice = () => {
      const headers = [
        { text: "Service Name", value: "name", sortable: false },
        { text: "Spesification", value: "spec", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Billing Type", value: "billingtype", sortable: false },
        { text: "Usage", value: "usage", sortable: false },
        { text: "Billed", value: "billed", align: "left", sortable: false },
      ];
      const instance = billinginstance.value;
      const storage = billingstorage.value;
      const first_date = firstdate.value;
      const until_date = untildate.value;
      const url = context.root.$router.resolve({
        path: "/download-invoice",
        query: {
          headers: JSON.stringify(headers),
          instance: JSON.stringify(instance),
          storage: JSON.stringify(storage),
          firstdate: `${moment(firstdate).format("DD")} ${moment(
            firstdate
          ).format("MMMM")} ${moment(firstdate).format("YYYY")}`,
          untildate: `${moment(untildate).format("DD")} ${moment(
            untildate
          ).format("MMMM")} ${moment(untildate).format("YYYY")}`,
        },
      });
      var winPrint = window.open(url.href, "_blank");
      // winPrint.document.close();
    };
    const opendialogSpecificationinfo = ref(false);

    const historyheaders = ref([
      { text: "Date", value: "date" },
      { text: "CPU hours", value: "cpu" },
      { text: "Ram hours", value: "ram" },
      { text: "Storage capacity", value: "storage" },
      { text: "Floating IP", value: "Bill" },
    ]);

    const currentPeriod = ref("");
    let currentDate = moment(firstdate).format("DD");
    let fromDate = 26;
    let fromMonth =
      currentDate < 26
        ? moment().subtract(1, "month").format("MMMM")
        : moment().format("MMMM");
    let fromYear =
      currentDate < 26
        ? moment().subtract(1, "month").format("YYYY")
        : moment().format("YYYY");
    let toDate = 25;
    let toMonth =
      currentDate < 26
        ? moment().format("MMMM")
        : moment().add(1, "month").format("MMMM");
    let toYear =
      currentDate < 26
        ? moment().format("YYYY")
        : moment().add(1, "month").format("YYYY");
    currentPeriod.value = `${fromDate} ${fromMonth} ${fromYear} - ${toDate} ${toMonth} ${toYear}`;

    return {
      currentPeriod,
      historyheaders,
      opendialogSpecificationinfo,
      downloadinvoice,
      firstdate,
      untildate,
      commitmentfee,
      billinginstance,
      billingstorage,
      openstoragedetail,
      openinstancedetail,
      headers,
      billinglist,
      billingperservice,
      billingdetails,
      vcalendar: ref(false),
      openModal,
      history,
      toIDRWithDotFormat,
      total,
      log: () => {},
    };
  },
  // comment fetch billing details
  // beforeRouteEnter(to, from, next) {
  //   const { id } = to.params;
  //   Vue.store
  //     .dispatch("BILLING/fetchbillingdetails", { id })
  //     .then(() => {
  //       next();
  //     })
  //     .catch(() => {
  //       next("/notfound");
  //     });
  // },
};
</script>

<style lang="scss" scoped>
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

/* .theme--light.v-data-table
	> .v-data-table__wrapper
	> table
	> tbody
	> tr:not(:last-child)
	> td:not(.v-data-table__mobile-row),
.theme--light.v-data-table
	> .v-data-table__wrapper
	> table
	> tbody
	> tr:not(:last-child)
	> th:not(.v-data-table__mobile-row) {
	border-bottom: none;
} */
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
