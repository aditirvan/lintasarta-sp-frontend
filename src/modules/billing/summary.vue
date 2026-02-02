<template>
  <div>
    <!-- if user corporate -->
    <v-card v-if="userType === 'C'" flat class="rounded-lg pa-2 mt-3">
      <v-card-text class="d-flex justify-space-between">
        <v-row class="align-center">
          <v-col>
            <p class="fz-21 font-weight-bold">
              List Billing All Project
              {{ currentPeriod ? `- ${currentPeriod}` : "" }}
            </p>
          </v-col>

          <v-col v-if="isDevMode" class="d-flex justify-end">
            <div>
              <v-btn
                depressed
                class="secondary"
                style="margin-bottom: 20px"
                height="45"
                max-width="197"
                @click="downloadInvoice"
              >
                Download Invoice
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">List Project</th>
                <th class="text-left">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in billings.projects" :key="item.name">
                <td style="width: 65%; padding: 2rem 1.25rem !important">
                  <router-link
                    @click.native="
                      () => {
                        setbillingdetails(item);
                      }
                    "
                    :to="`/billing/${item.id}`"
                    >{{ item.name }}</router-link
                  >
                  <!-- <span class="ml-4"></span> -->
                  <!-- <v-icon :color="item.commitment ? '#FF8C5A' : '#A5B3BF'">
                    $vuetify.icons.antdesigntagsIcon
                  </v-icon>
                  <span
                    :style="{ color: item.commitment ? '#FF8C5A' : '#A5B3BF' }"
                    >{{
                      item.commitment
                        ? "Commitment Project"
                        : "Non-Commitment Project"
                    }}</span
                  > -->
                </td>
                <td>{{ toIDRWithDotFormat(item.price) }}</td>
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
                    {{ toIDRWithDotFormat(billings.total_price) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <!-- if user personal -->
    <!-- <template v-else>
      <Header />

      <v-card class="rounded-lg pa-7 mt-7" flat>
        <Tablepersonal />
      </v-card>
    </template> -->

    <!-- if user personal -->
    <Summarypersonal v-else />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedMutations,
  useNamespacedState,
} from "vuex-composition-helpers";
import { BILLING } from "./namespace";
import { toIDRWithDotFormat } from "@/lib/formatter";
import localstorage from "@/lib/localstorage";
import Summarypersonal from "./summarypersonal";

const isDevMode = process.env.VUE_APP_DEV_MODE === "fase-1.3";

export default defineComponent({
  components: {
    Summarypersonal,
  },
  computed: {
    userType() {
      return localstorage.getItem("type");
    },
  },
  setup(props, { root }) {
    const { setbillingdetails } = useNamespacedMutations(BILLING, [
      "setbillingdetails",
    ]);

    const { fetchbillings } = useNamespacedActions(BILLING, ["fetchbillings"]);

    onMounted(() => {
      fetchbillings();
    });

    const { billings } = useNamespacedState(BILLING, ["billings"]);
    const currentPeriod = ref(null);
    currentPeriod.value = moment().format("MMMM YYYY");
    return {
      currentPeriod,
      toIDRWithDotFormat,
      billings,
      setbillingdetails,
    };
  },
  data() {
    return {
      isDevMode,
    };
  },
  methods: {
    downloadInvoice() {},
  },
});
</script>
