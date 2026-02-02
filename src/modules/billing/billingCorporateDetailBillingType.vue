<template>
  <v-card class="rounded-lg" flat>
    <v-container fluid class="pa-7">
      <Header v-if="!loading && detail" :detail="detail" />

      <p v-if="loading" class="text-center">
        <beat-loader color="gray" size="10px" class="mr-2" />
      </p>

      <template v-else>
        <v-data-table
        :headers="isPostpaidFixed ? serviceHeadersFixed : serviceHeaders"
        :items="services"
        hide-default-footer
        disable-pagination
        >
          <template v-slot:[`item.name`]="{ item }">
            <span class="linkpointer">{{ `${item.service_type_name}:${item.service_name}` }}</span>
          </template>

          <template v-slot:[`item.price`]="{ item }">
            {{ toIDRWithDotFormat(item.price) }} / {{ item.price_unit }}
          </template>

          <template v-slot:[`item.discount_value`]="{ item }">
            {{ item.discount_value ? toIDRWithDotFormat(item.discount_value) : '-' }}
          </template>

          <template v-slot:[`item.billed`]="{ item }">
            {{ toIDRWithDotFormat(item.billed) }}
          </template>

          <template v-if="!isPostpaidFixed" v-slot:body.append>
            <tr style="border: none">
              <td
                v-for="number in serviceHeaders.length - 2"
                :key="'total-' + number"
                class="border-bottom-none"
              />

              <td class="border-bottom-none">
                <div class="d-flex flex-row justify-end font-weight-bold">
                  Total
                </div>
              </td>

              <td class="border-bottom-none">
                <div class="d-flex flex-row justify-end font-weight-bold">
                  {{ toIDRWithDotFormat(services.reduce((total, item) => total + item.billed, 0)) }}
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </template>
    </v-container>
  </v-card>

  <!-- <div>
    <v-row>
      <v-col cols="12" v-if="projectBilling.length">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="pa-7">

              <template v-if="isDevModeSnapshotCharging && $route.params && $route.params.billing_type && $route.params.billing_type.toLowerCase() === 'other'">
                <p class="font-weight-bold fz-21 mt-4">
                  Snapshot
                </p>

                <v-data-table
                  class="datatable-services"
                  :headers="snapshotHeaders"
                  :items="snapshotItems"
                  :items-per-page="10"
                  hide-default-footer
                >
                  <template v-slot:item.size="{ item }">
                    {{ item.size }} GB
                  </template>

                  <template v-slot:item.billed="{ item }">
                    {{ IDRformat.format(item.billed) }}
                  </template>

                  <template v-slot:body.append>
                    <tr style="border:none" v-if="snapshotItems.length">
                      <td class="border-bottom-none"></td>
                      <td class="border-bottom-none"></td>
                      <td class="border-bottom-none">
                        <div>
                          <p class="font-weight-bold">Total</p>
                        </div>
                        <div class="d-flex flex-row justify-start">
                          {{ snapshotItems.length ? IDRformat.format(snapshotItems.reduce((total, item) => total + item.billed, 0)) : '0' }}
                        </div>
                      </td>
                    </tr>
                  </template>

                  <template
                    v-slot:footer="{ props }"
                    v-if="snapshotItems.length"
                  >
                    <custom-footer-datatable  :props="props" />
                  </template>
                </v-data-table>

                <p class="font-weight-bold fz-21 mt-4">
                  Floating IP
                </p>

                <v-data-table
                  class="datatable-services"
                  :headers="floating_ipHeaders"
                  :items="floating_ipItems"
                  :items-per-page="10"
                  hide-default-footer
                >
                  <template v-slot:item.ip_address="{ item }">
                    {{ item.ip_address }}
                  </template>

                  <template v-slot:item.total="{ item }">
                    {{ item.total }} x
                  </template>

                  <template v-slot:item.billed="{ item }">
                    {{ IDRformat.format(item.billed) }}
                  </template>

                  <template v-slot:body.append>
                    <tr style="border:none" v-if="floating_ipItems.length">
                      <td class="border-bottom-none"></td>
                      <td class="border-bottom-none"></td>
                      <td class="border-bottom-none">
                        <div>
                          <p class="font-weight-bold">Total</p>
                        </div>
                        <div class="d-flex flex-row justify-start">
                          {{ floating_ipItems.length ? IDRformat.format(floating_ipItems.reduce((total, item) => total + item.billed, 0)) : '0' }}
                        </div>
                      </td>
                    </tr>
                  </template>

                  <template
                    v-slot:footer="{ props }"
                    v-if="floating_ipItems.length"
                  >
                    <custom-footer-datatable  :props="props" />
                  </template>
                </v-data-table>
              </template>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <billingdetail />
  </div> -->
</template>

<script>
import Header from "./billing-corporate-detail-billing-type/Header.vue";

// import billingdetail from "./billingdetail";
import {
  ref,
  watch,
  onMounted,
  computed,
  reactive,
} from "@vue/composition-api";
import {
  useNamespacedGetters,
  useNamespacedState,
  useNamespacedActions,
} from "vuex-composition-helpers";
import { BILLING } from "./namespace";
import Vue from "vue";
import { IDRformat } from "@/lib/formatter";
import dialogInstanceDetail from "./dialogInstanceDetail";
import dialogSpecificationinfo from "./dialogSpecificationInfo";
const html2pdf = require("html2pdf.js");
import moment from "moment";
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import { toIDRWithDotFormat } from "@/lib/formatter";

// const isDevModeSnapshotCharging = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevModeSnapshotCharging = true;

export default {
  components: {
    Header,

    // billingdetail,
    // dialogInstanceDetail,
    // dialogSpecificationinfo,
  },
  data: () => ({
    dates: {
      start: new Date(),
      end: new Date(),
    },
    isDevModeSnapshotCharging,
    loading: false,
    services: [],
    project: null,
    detail: null,
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(" - ");
    },
    isPostpaidFixed() {
      const id = this.$route.params.id;

      if (id === "all-project") {
        return false;
      }

      const project = JSON.parse(localstorage.getItem("currentProj"));
      const postpaidFixed =
        project && project.postpaid_type === "fixed";

      return postpaidFixed;
    },
  },
  methods: {
    async getByTypeDetail() {
      this.loading = true;

      try {
        const { start, end } = this.$route.query
        const { id, billing_type } = this.$route.params;
        const project = JSON.parse(localstorage.getItem("currentProj"));

        let res = await api.POST(
          `/billing/v2/monthly-cost/by-type/${billing_type}`,
          {
            project_id: id,
            start: start,
            end: end,
            type: billing_type,
          }
        );
        this.detail = {
          project: project,
          date_start: start, 
          date_end: end,
          billed: res.data.total, 
        };

        res = await api.POST(
          '/billing/v2/monthly-cost/by-type/detail',
          {
            project_id: id,
            start: start,
            end: end,
            type: billing_type,
          }
        );
        if (res) this.services = res.data || [];
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
  setup(props, context) {
    const { id: projectID, billing_type: selectedType } =
      context.root.$route.params;
    const {
      fetchBillingOrganization,
      fetchBillingHistory,
      getBilling,
      postBillingOrganization,
    } = useNamespacedActions("BILLING", [
      "fetchBillingOrganization",
      "fetchBillingHistory",
      "getBilling",
      "postBillingOrganization",
    ]);

    const { projectBilling, billing } = useNamespacedState("BILLING", [
      "projectBilling",
      "billing",
    ]);

    const historyHeaders = ref([
      { text: "Date", value: "date" },
      { text: "Billed", value: "billed" },
      { text: "Action", value: "action", width: 100 },
    ]);

    const serviceHeaders = ref([
      { text: "Service Name", value: "name" },
      { text: "Specification", value: "specification" },
      { text: "Price", value: "price" },
      { text: "Usage", value: "usage" },
      { text: "Discount Value", value: "discount_value" },
      { text: "Billed", value: "billed", align: "end" },
    ]);

    const serviceHeadersFixed = ref([
      { text: "Service Name", value: "name" },
      { text: "Specification", value: "specification" },
    ]);

    const totalBilled = ref(0);
    // let otherTotalBilled = 0

    // if (isDevModeSnapshotCharging && context.root.$route.params && context.root.$route.params.billing_type && context.root.$route.params.billing_type.toLowerCase() === 'other' && billing && billing.value && billing.value.details && billing.value.details.length && billing.value.details[0].other) {
    //   const other = billing.value.details[0].other

    //   for (const key in other) {
    //     if (key.includes('_')) {
    //       const arrKey = key.split('_')
    //       const name = arrKey.map((k) => k === 'ip' ? 'IP' : k.charAt(0).toUpperCase() + k.slice(1)).join(' ')
    //       const isNameExists = otherServicesItems.find((item) => item.name === name)

    //       if (!isNameExists) {
    //         otherServicesItems.push({
    //           ...other[key],
    //           name,
    //         })
    //       }
    //     } else {
    //       const name = key.charAt(0).toUpperCase() + key.slice(1)
    //       const isNameExists = otherServicesItems.find((item) => item.name === name)

    //       if (!isNameExists) {
    //         otherServicesItems.push({
    //           ...other[key],
    //           name,
    //         })
    //       }
    //     }
    //   }

    //   otherTotalBilled = totalBilled.value + otherServicesItems.reduce((a, b) => a + b.billed, 0)
    // }

    let billServices = ref(null);
    let services = reactive({
      ppm: {
        billing_type: "PPM",
        billed: 0,
        instances: [],
        storages: [],
        object_storages: [],
        root_disks: [],
      },
      ppu: {
        billing_type: "PPU",
        billed: 0,
        instances: [],
        storages: [],
        object_storages: [],
        root_disks: [],
      },
      other: {
        billing_type: "Other",
        billed: 0,
        instances: [],
        storages: [],
        object_storages: [],
        root_disks: [],
        snapshots: [],
        floating_ips: [],
      },
    });

    const resetDataServices = () => {
      services = {
        ppm: {
          billing_type: "PPM",
          billed: 0,
          instances: [],
          storages: [],
          object_storages: [],
          root_disks: [],
        },
        ppu: {
          billing_type: "PPU",
          billed: 0,
          instances: [],
          storages: [],
          root_disks: [],
        },
        other: {
          billing_type: "Other",
          billed: 0,
          instances: [],
          storages: [],
          root_disks: [],
          snapshots: [],
          floating_ips: [],
        },
      };
    };

    const currentPeriod = ref("");
    let from = ref(null);
    let to = ref(null);

    const getBillings = async () => {
      // const year = new Date().getFullYear();
      // const month = context.root.$route.query.month

      // const payload = {
      //   month: parseInt(month),
      //   year,
      //   // month: 12,
      //   // year: 2021,
      // };

      // const err = await postBillingOrganization(payload);

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
    };

    onMounted(async () => {
      // if (isDevModeSnapshotCharging) {
      //   await getBillings()
      // } else {
      //   await fetchBillingOrganization()
      // }
      // await fetchBillingHistory({
      //   project_id: projectID,
      //   start: billing.value.date_start,
      //   end: billing.value.date_end,
      // })
      // from.value = moment(billing.value.date_start)
      // to.value = moment(billing.value.date_end)
      // currentPeriod.value = `${from.value.format('DD MMMM YYYY')} - ${to.value.format('DD MMMM YYYY')}`
      // projectBilling.value.map(dailyBill => {
      //   if (dailyBill.instances) {
      //     dailyBill.instances.filter(x => x.billing_type == selectedType).map(instance => {
      //       let billingType = selectedType.toLowerCase()
      //       let index = services[billingType].instances.findIndex(x => x.instance_id == instance.instance_id)
      //       if (index >= 0) {
      //         if (instance.shift_to_monthly) {
      //           services[billingType].instances[index] = instance.package_instance.price_per_month
      //         } else {
      //           let prevBill = services[billingType].instances[index].billed
      //           let prevUsage = services[billingType].instances[index].usage_hours
      //           instance.billed += prevBill
      //           instance.usage_hours += prevUsage
      //           services[billingType].instances[index] = instance
      //         }
      //       } else {
      //         if (instance.shift_to_monthly) instance.billed = instance.package_instance.price_per_month
      //         services[billingType].instances.push(instance)
      //       }
      //     })
      //   }
      //   if (selectedType.toLowerCase() == 'other'){
      //     if (dailyBill.storages) {
      //       dailyBill.storages.map(storage => {
      //         let billingType = 'other'
      //         let index = services[billingType].storages.findIndex(x => x.storage_id == storage.storage_id)
      //         if (index >= 0) {
      //           let prevBill = services[billingType].storages[index].billed
      //           storage.billed += prevBill
      //           services[billingType].storages[index] = storage
      //         } else services[billingType].storages.push(storage)
      //       })
      //     }
      //     if (dailyBill.root_disks) {
      //       dailyBill.root_disks.map(root_disk => {
      //         let billingType = 'other'
      //         let index = services[billingType].root_disks.findIndex(x => x.instance_id == root_disk.instance_id)
      //         if (index >= 0) {
      //           let prevBill = services[billingType].root_disks[index].billed
      //           root_disk.billed += prevBill
      //           services[billingType].root_disks[index] = root_disk
      //         } else services[billingType].root_disks.push(root_disk)
      //       })
      //     }
      //     if (dailyBill.object_storages) {
      //       dailyBill.object_storages.map(object_storage => {
      //         let billingType = 'other'
      //         let index = services[billingType].object_storages.findIndex(x => x.object_storage_id == object_storage.object_storage_id)
      //         if (index >= 0) {
      //           services[billingType].object_storages[index].billed += object_storage.billed
      //         } else services[billingType].object_storages.push(object_storage)
      //       })
      //     }
      //     if (isDevModeSnapshotCharging && dailyBill.other.snapshot && dailyBill.other.snapshot.history && dailyBill.other.snapshot.history.length) {
      //       dailyBill.other.snapshot.history.map(snapshot => {
      //         let billingType = 'other'
      //         services[billingType].snapshots.push(snapshot)
      //       })
      //     }
      //     snapshotItems.value = services.other.snapshots
      //     if (isDevModeSnapshotCharging && dailyBill.other.floating_ip && dailyBill.other.floating_ip.history && dailyBill.other.floating_ip.history.length) {
      //       dailyBill.other.floating_ip.history.map(snapshot => {
      //         let billingType = 'other'
      //         services[billingType].floating_ips.push(snapshot)
      //       })
      //     }
      //     floating_ipItems.value = services.other.floating_ips
      //   }
      // })
      // services.ppu.billed = (services.ppu.instances.reduce((total, item) => total + item.billed, 0)) + (services.ppu.storages.reduce((total, item) => total + item.billed, 0)) + (services.ppu.object_storages.reduce((total, item) => total + item.billed, 0))
      // services.ppm.billed = (services.ppm.instances.reduce((total, item) => total + item.billed, 0)) + (services.ppm.storages.reduce((total, item) => total + item.billed, 0)) + (services.ppm.object_storages.reduce((total, item) => total + item.billed, 0))
      // const snapshotTotal = services.other.snapshots.reduce((total, item) => total + item.billed, 0)
      // const floatingIPTotal = services.other.floating_ips.reduce((total, item) => total + item.billed, 0)
      // services.other.billed = snapshotTotal + floatingIPTotal + (services.other.instances.reduce((total, item) => total + item.billed, 0)) + (services.other.root_disks.reduce((total, item) => total + item.billed, 0)) + (services.other.storages.reduce((total, item) => total + item.billed, 0)) + (services.other.object_storages.reduce((total, item) => total + item.billed, 0))
      // totalBilled.value = totalBilled.value + Math.round(services.ppu.billed + services.ppm.billed + services.other.billed)
      // billServices.value = services[selectedType.toLowerCase()]
    });

    const getBillingTypeLabel = (type) => {
      if (type == "PPU") return "Pay Per Use";
      else if (type == "PPM") return "Pay Per Metrics";
      else if (type == "Other") return "One Time";
    };

    return {
      getBillingTypeLabel,
      selectedType,
      fetchBillingHistory,
      totalBilled,
      // otherTotalBilled,
      projectBilling,
      billing,
      billServices,
      historyHeaders,
      currentPeriod,
      IDRformat,
      moment,
      vcalendar: ref(false),
      serviceHeaders,
      serviceHeadersFixed,
      toIDRWithDotFormat,
    };
  },
  mounted() {
    this.getByTypeDetail();
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
