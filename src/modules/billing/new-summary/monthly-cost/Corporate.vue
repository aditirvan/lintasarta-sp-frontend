<template>
  <v-card flat class="rounded-lg pa-2 mt-3">
    <v-card-text
      class="d-flex"
      style="justify-content: space-between; align-items: center"
    >
      <p class="fz-21 font-weight-bold mt-4">
        Monthly Cost - <span class="primary--text">{{ currentPeriod }}</span>
      </p>

      <!-- <v-btn v-if="userType === 'P'" outlined depressed color="secondary" class="mr-4" style="margin-bottom: 20px" height="45" max-width="197" to="/billing/payment">
        Top Up Balance
      </v-btn> -->

      <div>
        <v-btn color="secondary" outlined class="mr-4">
          See Summary All Services (no functional yet)
        </v-btn>

        <!-- <v-btn class="secondary" dark depressed height="45" style="font-size: 14px" @click="downloadInvoice" v-if="billing">
          Download Invoice
        </v-btn> -->
      </div>
    </v-card-text>

    <p v-if="loading" class="text-center">
      <beat-loader color="gray" size="10px" class="mr-2" />
    </p>

    <template v-else>
      <v-card-text v-if="billing">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">List Project</th>
                <th class="text-left">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in billing.details" :key="item.project.id">
                <template v-if="item.billed">
                  <td style="width: 65%; padding: 2rem 1.25rem !important">
                    <router-link
                      @click.native="
                        () => {
                          setbillingdetails(item);
                        }
                      "
                      :to="`/billing/${item.project.id}?month=${month}`"
                    >
                      {{ item.project.name }}
                    </router-link>
                  </td>

                  <td>{{ toIDRWithDotFormat(item.billed) }}</td>
                </template>
              </tr>

              <tr>
                <td style="padding-left: 0px; padding-right: 0px">
                  <div
                    class="d-flex align-center px-4 rounded-l-lg"
                    style="
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
                    "
                  >
                    Total
                  </div>
                </td>
                <td style="padding-right: 0px; padding-left: 0px">
                  <div
                    class="d-flex align-center px-4 rounded-r-lg"
                    style="
                      height: 80px;
                      background-color: #f1f2f2;
                      margin-top: 20px;
                      font-size: 30px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: 50px;
                      letter-spacing: 0;
                      text-align: left;
                    "
                  >
                    {{ toIDRWithDotFormat(billing.price) }}
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
                  colspan="2"
                >
                  No data available
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </template>

    <!-- <invoice-corporate v-if="billing" :organization="organization" :billing="billing"/> -->

    <!-- <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="true" :filename="`Invoice ${currentPeriod}`" :pdf-quality="2" :manual-pagination="true" pdf-format="a4" pdf-orientation="portrait" ref="invoiceCorporate">
      <section slot="pdf-content">
        <invoice-corporate v-if="billing" :organization="organization" :billing="billing" />
      </section>
    </vue-html2pdf> -->
  </v-card>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  watch,
} from "@vue/composition-api";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { BILLING } from "../../namespace";
import { toIDRWithDotFormat } from "@/lib/formatter";
// import invoiceCorporate from "@/app/downloadinvoice/invoiceCorporate";
// import VueHtml2pdf from "vue-html2pdf";
import localstorage from "@/lib/localstorage";

export default defineComponent({
  props: ["month"],
  // components: {
  //   invoiceCorporate,
  //   VueHtml2pdf,
  // },
  setup(props, context) {
    const { setbillingdetails } = useNamespacedMutations(BILLING, [
      "setbillingdetails",
    ]);

    // const { fetchorganizationByUser } = useNamespacedActions("ORGANIZATION", ["fetchorganizationByUser"]);

    // const organization = ref(null);

    const {
      // fetchBillingOrganization,
      postBillingOrganization,
    } = useNamespacedActions(BILLING, [
      // "fetchBillingOrganization",
      "postBillingOrganization",
    ]);

    const loading = ref(true);

    const getBillings = async () => {
      loading.value = true;

      const year = new Date().getFullYear();
      const role = localstorage.getItem("role");
      const currentOrg = localstorage.getItem("currentOrg");
      const org = JSON.parse(currentOrg);

      const additionalProps =
        role && role === "Superadmin"
          ? {
              organization_id: org ? org.id : null,
            }
          : {};

      const payload = {
        month: props.month,
        year,
        ...additionalProps,
        // month: 12,
        // year: 2021,
      };

      const err = await postBillingOrganization(payload);

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

      loading.value = false;
    };

    watch(
      () => props.month,
      () => {
        getBillings();
      }
    );

    onMounted(async () => {
      await getBillings();

      // await fetchBillingOrganization();
      // loading.value = true;

      // const response = await fetchorganizationByUser();
      // organization.value = response;

      // loading.value = false;
    });

    const { billing } = useNamespacedState(BILLING, ["billing"]);

    const userType = computed(() => {
      const type = localstorage.getItem("type");
      return type;
    });

    const currentPeriod = computed(() => {
      if (!billing.value) return;
      return `${moment(billing.value.date_start).format("MMMM YYYY")}`;
    });

    const invoiceCorporate = ref(null);
    // const downloadInvoice = () => {
    //   invoiceCorporate.value.generatePdf();
    // };

    return {
      loading,
      userType,
      // downloadInvoice,
      invoiceCorporate,
      setbillingdetails,
      currentPeriod,
      toIDRWithDotFormat,
      billing,
      moment,
      // organization,
    };
  },
});
</script>
