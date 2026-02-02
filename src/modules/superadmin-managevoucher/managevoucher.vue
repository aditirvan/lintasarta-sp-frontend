<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text class="px-0 pb-0 pt-2 rounded-lg">
      <v-tabs v-model="tab" slider-size="4">
        <v-tab to="/manage-voucher/trial">
          <span style="font-size: 16px">Voucher Trial</span>
        </v-tab>
        <v-tab to="/manage-voucher/credit">
          <span style="font-size: 16px">Voucher Credit</span>
        </v-tab>
        <v-tab to="/manage-voucher/discount">
          <span style="font-size: 16px">Voucher Discount</span>
        </v-tab>
      </v-tabs>
    </v-card-text>
    
    <v-tabs-items style="border-top: 0.5px solid #e0e0e0" v-model="tab">

      <!-- voucher trial item -->
      <v-tab-item value="/manage-voucher/trial">
        <v-card-text class="d-flex flex-row align-center">
          <div class="headline font-weight-bold font--text">Manage Voucher Trial</div>
          <v-spacer />
          <v-text-field
            maxlength="50"
            v-model="search"
            class="search pt-3"
            style="max-width: 188px"
            placeholder="Search"
            outlined
          ></v-text-field>
          <div style="height: auto; width: 20px" />
          <v-btn
            v-if="!read_only"
            depressed
            height="50"
            width="200"
            class="secondary"
            to="/manage-voucher/trial/create"
            ><span class="fz-14">Create Voucher Trial</span></v-btn
          >
        </v-card-text>
        <v-card-text>
          <v-data-table
            hide-default-footer
            :headers="headers"
            hide-default-header
            :items-per-page="10"
            :server-items-length="pagination.count"
            :search="search"
            :items="vouchers"
            :options.sync="options"
          >
            <template v-slot:header="{ props, on }">
              <v-data-table-header
                v-on="on"
                v-bind="props"
                sort-icon="mdi-menu-down"
              >
              </v-data-table-header>
            </template>
            <template v-slot:item.name="{ item }">
              <router-link append :to="{path:`/manage-voucher/trial/${item.id}/detail`}">{{ item.name }}</router-link>
            </template>
            <template v-slot:item.service="{ item }">
              <div>
                {{item.quota}}
              </div>
            </template>
            <template v-slot:item.date="{ item }">
              <div>
                {{ $moment(item.claim_period_start).format("DD/MM/YYYY") }}
                to {{ $moment(item.claim_period_end).format("DD/MM/YYYY") }}
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <div
                :disabled="read_only"
                @click="
                  () => {
                    if(read_only){
                      return
                    }
                    selectedVoucher = item;
                    opendialogdelete = true;
                  }
                "
                style="cursor: pointer"
                class="error--text"
                :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
              >
                Delete
              </div>
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
                @input="
                  (val) => {
                    options = { ...options, ...val };
                  }
                "
                :hidden="true"
                :props="props"
              />
            </template>
          </v-data-table>
        </v-card-text>
      </v-tab-item>

      <!-- voucher credit item -->
      <v-tab-item value="/manage-voucher/credit">
        <v-card-text class="d-flex flex-row align-center">
          <div class="headline font-weight-bold font--text">Manage Voucher Credit</div>
          <v-spacer />
          <v-text-field
            maxlength="50"
            v-model="searchVoucherCredit"
            class="search pt-3"
            style="max-width: 188px"
            placeholder="Search"
            outlined
          ></v-text-field>
          <div style="height: auto; width: 20px" />
          <v-btn
            v-if="!read_only"
            depressed
            height="50"
            width="200"
            class="secondary"
            to="/manage-voucher/credit/create"
            ><span class="fz-14">Create Voucher Credit</span></v-btn
          >
        </v-card-text>
        <v-card-text>
          <v-data-table
            hide-default-footer
            :headers="headerCredits"
            hide-default-header
            :items-per-page="10"
            :server-items-length="voucherCreditPagination.count"
            :search="searchVoucherCredit"
            :items="voucherCredits"
            :options.sync="voucherCreditOptions"
          >
            <template v-slot:header="{ props, on }">
              <v-data-table-header
                v-on="on"
                v-bind="props"
                sort-icon="mdi-menu-down"
              >
              </v-data-table-header>
            </template>
            <template v-slot:item.name="{ item }">
              <router-link append :to="{path:`/manage-voucher/credit/${item.id}/detail`}">{{ item.name }}</router-link>
            </template>
            <template v-slot:item.service="{ item }">
              <div>
                {{item.quota}}
              </div>
            </template>
            <template v-slot:item.date="{ item }">
              <div>
                {{ $moment(item.claim_period_start).format("DD/MM/YYYY") }}
                to {{ $moment(item.claim_period_end).format("DD/MM/YYYY") }}
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <div class="d-flex justify-center">
                <!-- edit -->
                <router-link 
                  v-if="!read_only"
                  append 
                  class="primary--text"
                  :to="{path:`/manage-voucher/credit/${item.id}/edit`}"
                >
                  Edit
                </router-link>
                <!-- delete -->
                <div
                  @click="
                    () => {
                      if(read_only){
                        return
                      }
                      selectedVoucherCredit = item;
                      openDialogDeleteVoucherCredit = true;
                    }
                  "
                  style="cursor: pointer"
                  class="ml-4 error--text"
                  :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]"
                >
                  Delete
                </div>
              </div>
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
                @input="
                  (val) => {
                    voucherCreditOptions = { ...voucherCreditOptions, ...val };
                  }
                "
                :hidden="true"
                :props="props"
              />
            </template>
          </v-data-table>
        </v-card-text>
      </v-tab-item>

      <!-- voucher discount item -->
      <v-tab-item value="/manage-voucher/discount">
        <v-card-text class="d-flex flex-row align-center">
          <div class="headline font-weight-bold font--text">Manage Voucher Discount</div>
          <v-spacer />
          <v-text-field
            maxlength="50"
            v-model="searchVoucherDiscount"
            class="search pt-3"
            style="max-width: 188px"
            placeholder="Search"
            outlined
          ></v-text-field>
          <div style="height: auto; width: 20px" />
          <v-btn
            depressed
            height="50"
            width="200"
            class="secondary"
            to="/manage-voucher/discount/create"
            ><span class="fz-14">Create Voucher Discount</span></v-btn
          >
        </v-card-text>
        <v-card-text>
          <v-data-table
            hide-default-footer
            :headers="headerDiscounts"
            hide-default-header
            :items-per-page="10"
            :server-items-length="voucherDiscountPagination.count"
            :search="searchVoucherDiscount"
            :items="voucherDiscounts"
            :options.sync="voucherDiscountOptions"
          >
            <template v-slot:header="{ props, on }">
              <v-data-table-header
                v-on="on"
                v-bind="props"
                sort-icon="mdi-menu-down"
              >
              </v-data-table-header>
            </template>
            <template v-slot:item.name="{ item }">
              <router-link 
                append 
                :to="{path:`/manage-voucher/discount/${item.id}/detail`}">
                {{item.name}}
              </router-link>
            </template>
            <template v-slot:item.code="{ item }">
              <div>
                {{item.code}}
              </div>
            </template>
            <template v-slot:item.sales_name="{ item }">
              <div>
                {{item.sales_name}}
              </div>
            </template>
            <template v-slot:item.type="{ item }">
              <div style="text-transform: capitalize">
                {{item.type}}
              </div>
            </template>
            <template v-slot:item.date="{ item }">
              <div>
                {{ $moment(item.created_at).format("DD/MM/YYYY") }}
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <div class="d-flex justify-center">
                <!-- edit -->
                <div
                  v-if="item.project_count > 0"
                  class="ml-4 primary--text"
                  @click="() => { 
                    selectedVoucherDiscount = item
                    openDialogPreventEditVoucherDiscount = true 
                  }"
                  style="cursor: pointer">
                  Edit
                </div>
                <router-link 
                v-else
                append 
                class="ml-4 primary--text"
                :to="{path:`/manage-voucher/discount/${item.id}/edit`}">
                  Edit
                </router-link>
                <!-- delete -->
                <div
                  class="ml-4 error--text"
                  @click="
                    () => {
                      if(item.project_count > 0) {
                        openDialogPreventDeleteVoucherDiscount = true
                      } else {
                        selectedVoucherDiscount = item
                        openDialogDeleteVoucherDiscount = true
                      }
                    }
                  "
                  style="cursor: pointer"
                >
                  Delete
                </div>
              </div>
            </template>
            <template v-slot:footer="{ props }">
              <custom-footer-datatable
                @input="
                  (val) => {
                    voucherDiscountOptions = { ...voucherDiscountOptions, ...val };
                  }
                "
                :hidden="true"
                :props="props"
              />
            </template>
          </v-data-table>
        </v-card-text>
      </v-tab-item>

    </v-tabs-items>
    <dialogDeleteVoucher
      v-if="selectedVoucher && opendialogdelete"
      v-model="opendialogdelete"
      @confirm="doDelete"
      :selectedVoucher="selectedVoucher"
    />

    <dialogDeleteVoucherCredit
      v-if="selectedVoucherCredit && openDialogDeleteVoucherCredit"
      v-model="openDialogDeleteVoucherCredit"
      @confirm="doDeleteVoucherCredit"
      :selectedVoucherCredit="selectedVoucherCredit"
    />

    <dialogDeleteVoucherDiscount
      v-if="selectedVoucherDiscount && openDialogDeleteVoucherDiscount"
      v-model="openDialogDeleteVoucherDiscount"
      @confirm="doDeleteVoucherDiscount"
      :selectedVoucherDiscount="selectedVoucherDiscount"
    />

    <dialogPreventDeleteVoucherDiscount
      v-if="openDialogPreventDeleteVoucherDiscount"
      v-model="openDialogPreventDeleteVoucherDiscount"
    />

    <dialogPreventEditVoucherDiscount
      v-if="openDialogPreventEditVoucherDiscount"
      v-model="openDialogPreventEditVoucherDiscount"
      :name="selectedVoucherDiscount.name"
    />
  </v-card>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { MANAGEVOUCHER } from "./namespace";
import dialogDeleteVoucher from "./dialogDeleteVoucher";
import dialogDeleteVoucherCredit from "./dialogDeleteVoucherCredit";
import {AccessControl} from "@/lib/middleware";
import dialogDeleteVoucherDiscount from "./dialogDeleteVoucherDiscount";
import dialogPreventDeleteVoucherDiscount from "./dialogPreventDeleteVoucherDiscount";
import dialogPreventEditVoucherDiscount from "./dialogPreventEditVoucherDiscount";

export default {
  components: { 
    dialogDeleteVoucher, 
    dialogDeleteVoucherCredit, 
    dialogDeleteVoucherDiscount,
    dialogPreventDeleteVoucherDiscount, 
    dialogPreventEditVoucherDiscount 
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Voucher'));

    const headers = ref([
      { text: "Voucher Name", value: "name" },
      { text: "Quota", value: "quota" },
      { text: "Claim Period", value: "date" },
      { text: "Action", value: "action", sortable: false },
    ]);

    const headerCredits = ref([
      { text: "Voucher Name", value: "name" },
      { text: "Type", value: "type" },
      { text: "Quota", value: "quota" },
      { text: "Claim Period", value: "date" },
      { text: "Action", value: "action", align: "center", sortable: false },
    ]);

    const headerDiscounts = ref([
      { text: "Voucher Name", value: "name" },
      { text: "Sales Code", value: "code" },
      { text: "Sales Name", value: "sales_name" },
      { text: "Type", value: "type" },
      { text: "Create Date", value: "date" },
      { text: "Action", value: "action", sortable: false, align: 'center' },
    ]);

    const { 
      fetchvouchers, 
      fetchVoucherCredits,
      fetchVoucherDiscounts,
      deleteVoucher,
      deleteVoucherCredit,
      deleteVoucherDiscount
    } = useNamespacedActions(MANAGEVOUCHER, [
      "fetchvouchers",
      "fetchVoucherCredits",
      "fetchVoucherDiscounts",
      "deleteVoucher",
      "deleteVoucherCredit",
      "deleteVoucherDiscount"
    ]);
    onMounted(() => {
      fetchvouchers();
      fetchVoucherCredits()
      fetchVoucherDiscounts()
    });
    const {
      vouchers,
      voucherCredits, 
      voucherDiscounts,
      pagination,
      voucherCreditPagination, 
      voucherDiscountPagination,
    } = useNamespacedState(MANAGEVOUCHER, [
      "vouchers",
      "voucherCredits", 
      "voucherDiscounts",
      "pagination",
      "voucherCreditPagination",
      "voucherDiscountPagination"
    ]);
    const options = ref({ page: 1, itemsPerPage: 10, search: "", sortBy: [], sortDesc: [] });
    const loading = ref(false);

    // watch voucher trial
    watch(
      options,
      async (val) => {
        loading.value = true;
        try {
          await fetchvouchers(val);
        } finally {
          loading.value = false;
        }
      },
      { deep: true }
    );

    const voucherCreditOptions = ref({ page: 1, itemsPerPage: 10, search: "", sortBy: [], sortDesc: [] });
    // watch voucher credit
    watch(
      voucherCreditOptions,
      async (val) => {
        await fetchVoucherCredits(val);
      },
      { deep: true }
    );

    const voucherDiscountOptions = ref({ page: 1, itemsPerPage: 10, search: "", sortBy: [], sortDesc: [] });
    // watch voucher discount
    watch(
      voucherDiscountOptions,
      async (val) => {
        await fetchVoucherDiscounts(val);
      },
      { deep: true }
    );

    const search = ref("");
    const searchVoucherCredit = ref("")
    const searchVoucherDiscount = ref("")
    let searchtimeout = setTimeout(() => {}, 500);
    
    // watch search voucher trial
    watch(search, (val) => {
      clearTimeout(searchtimeout);
      searchtimeout = setTimeout(() => {
        options.value.page = 1;
        options.value.search = val;
      }, 500);
    });

    // watch search voucher credit
    watch(searchVoucherCredit, (val) => {
      clearTimeout(searchtimeout);
      searchtimeout = setTimeout(() => {
        voucherCreditOptions.value.page = 1;
        voucherCreditOptions.value.search = val;
      }, 500);
    });

    // watch search voucher discount
    watch(searchVoucherDiscount, (val) => {
      clearTimeout(searchtimeout);
      searchtimeout = setTimeout(() => {
        voucherDiscountOptions.value.page = 1;
        voucherDiscountOptions.value.search = val;
      }, 500);
    });

    const selectedVoucher = ref(null)
    const doDelete = async () => {
      const { id } = selectedVoucher.value
      await deleteVoucher(id)
    }

    const selectedVoucherCredit = ref(null)
    const doDeleteVoucherCredit = async () => {
      const { id } = selectedVoucherCredit.value
      await deleteVoucherCredit(id)
    }

    const selectedVoucherDiscount = ref(null)
    const doDeleteVoucherDiscount = async () => {
      const { id } = selectedVoucherDiscount.value
      await deleteVoucherDiscount(id)
    }

    return {
      read_only,
      doDelete,
      doDeleteVoucherCredit,
      doDeleteVoucherDiscount,
      opendialogdelete: ref(false),
      openDialogDeleteVoucherCredit: ref(false),
      openDialogDeleteVoucherDiscount: ref(false),
      openDialogPreventDeleteVoucherDiscount: ref(false),
      openDialogPreventEditVoucherDiscount: ref(false),
      selectedVoucher, 
      selectedVoucherCredit,
      selectedVoucherDiscount,
      vouchers,
      voucherCredits,
      voucherDiscounts,
      headers,
      headerCredits,
      headerDiscounts,
      tab: ref(""),
      search,
      searchVoucherCredit,
      searchVoucherDiscount,
      fetchvouchers,
      pagination,
      voucherCreditPagination,
      voucherDiscountPagination,
      options,
      voucherCreditOptions,
      voucherDiscountOptions
    };
  },
};
</script>