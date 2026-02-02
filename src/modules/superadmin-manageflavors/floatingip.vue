<template>
  <v-tab-item>
    <!-- default table header 1 -->
    <v-card-text class="d-flex pa-8 flex-row align-center">
      <div class="headline font-weight-bold font--text">
        Default Reserved Price
      </div>
    </v-card-text>

    <!-- default table 1 -->
    <v-card-text class="px-8">
      <v-data-table
        :hide-default-footer="true"
        :headers="defaultHeaders"
        :items-per-page="5"
        :items="[defaultItems[0], defaultItems2[0]]"
        class="elevation-0"
      >
        <!-- <template v-slot:item.default="{ item }"> {{ item.default }} GB </template> -->

        <!-- loading / no data -->
        <template v-slot:no-data>
          {{ loading ? "Loading..." : "No data available" }}
        </template>

        <template v-slot:item.type="{ item }">
          {{ item.type }}
        </template>

        <template v-slot:item.price="{ item }">
          <div v-if="item.type === 'non-reserved'">
            <b>{{ toIDRWithDotFormat(item.price.price_per_hour) }}</b
            >/Hour
          </div>
          <div v-if="item.price.price_per_month">
            <b>{{ toIDRWithDotFormat(item.price.price_per_month) }}</b>
            /Month
          </div>
        </template>

        <!-- edit btn -->
        <template v-slot:item.action="{ item }">
          <div>
            <label
              style="cursor: pointer"
              @click="
                () => {
                  if(read_only){
                    return
                  }
                  selectedFloatingIP = item;
                  openDialogEditFloatingIP = true;
                }
              "
            >
              <span class="primary--text" :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]">Edit</span>
            </label>
          </div>
        </template>
      </v-data-table>
    </v-card-text>

    <v-divider />

    <!-- edit default popup -->
    <dialogEditFloatingIP
      v-if="selectedFloatingIP && openDialogEditFloatingIP"
      :item="selectedFloatingIP"
      v-model="openDialogEditFloatingIP"
      @close="openDialogEditFloatingIP = false"
      @updateDefaultFloatingIP="updateDefaultFloatingIP($event)"
    />

    <!-- table 3 header -->
    <v-card-text class="d-flex pa-8 align-center">
      <div class="headline font-weight-bold font--text">
        Manage Floating IP (Customized) Flavor
      </div>

      <v-spacer />

      <v-text-field
        maxlength="50"
        style="max-width: 233px"
        outlined
        placeholder="Search Organization Name"
        hide-details=""
        v-model="searchText"
      />

      <v-btn
        height="50"
        width="200"
        depressed
        class="secondary ml-8"
        v-if="!read_only"
        @click="openDialogCreateFloatingIP = true"
      >
        <span style="font-size: 14px"> Create Floating IP Flavor </span>
      </v-btn>
    </v-card-text>

    <!-- table body -->
    <v-card-text class="px-8">
      <!-- customized table -->
      <v-data-table
        hide-default-header
        hide-default-footer
        :items-per-page="10"
        :headers="customizedHeaders"
        :items="customizedItems"
        :server-items-length="customizedPagination.count"
        :options.sync="customizedPagination"
        class="elevation-0"
      >
        <!-- loading / no data -->
        <template v-slot:no-data>
          {{ loading ? "Loading..." : "No data available" }}
        </template>

        <!-- header -->
        <template v-slot:header="{ props, on }">
          <v-data-table-header
            v-on="on"
            v-bind="props"
            sort-icon="mdi-menu-down"
          />
        </template>

        <!-- <template v-slot:item.total="{ item }"> {{ item.total }} GB </template> -->

        <template v-slot:item.start_date="{ item }">
          {{ $moment(item.start_date).format("DD/MM/YYYY") }}
        </template>

        <template v-slot:item.reserved_price_per_month="{ item }">
          <b>{{ toIDRWithDotFormat(item.reserved_price_per_month) }}</b
          >/Month
        </template>

        <template v-slot:item.non_reserved_price_per_month="{ item }">
          <b> {{ toIDRWithDotFormat(item.non_reserved_price_per_month) }}</b
          >/Month
        </template>

        <!-- status -->
        <template v-slot:item.status="{ item }">
          <v-switch
            class="mt-0 mb-2"
            hide-details
            flat
            :disabled="read_only"
            readonly
            @click="
              () => {
                if(read_only){
                  return
                }
                openDialogCustomizedSwitch = true;
                selectedCustomized = item;
              }
            "
            v-model="item.status"
            true-value="active"
            false-value="deactive"
          ></v-switch>
        </template>

        <!-- btns -->
        <template v-slot:item.action="{ item }">
          <div>
            <label
              style="cursor: pointer"
              @click="
                () => {
                  if(read_only){
                    return
                  }
                  selectedCustomized = item;
                  openDialogCustomizedDelete = true;
                }
              "
            >
              <span class="error--text" :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]">Delete</span>
            </label>
          </div>
        </template>

        <!-- pagination -->
        <template v-slot:footer="{ props }">
          <custom-footer-datatable
            v-if="
              (customizedPagination && customizedPagination.count > 5) ||
              (customizedPagination && customizedPagination.count === 5)
            "
            @input="
              (val) => {
                customizedPagination = { ...customizedPagination, ...val };
              }
            "
            :props="props"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <!-- create popup -->
    <dialogCreateFloatingIP
      v-if="openDialogCreateFloatingIP"
      v-model="openDialogCreateFloatingIP"
      @close="openDialogCreateFloatingIP = false"
      @refreshData="refreshData"
    />

    <!-- delete popup -->
    <dialogDeleteRestore
      v-if="selectedCustomized && openDialogCustomizedDelete"
      v-model="openDialogCustomizedDelete"
      @close="openDialogCustomizedDelete = false"
      @confirm="deleteFloatingIP(selectedCustomized.id)"
      :loading="loading"
      title="Floating IP"
    />

    <!-- status popup -->
    <dialogActivateFlavor
      v-if="openDialogCustomizedSwitch && selectedCustomized"
      :onoff="selectedCustomized.status === 'active' ? 'off' : 'on'"
      v-model="selectedCustomized"
      @confirm="changeStatus"
      :loading="loading"
    />
  </v-tab-item>
</template>

<script>
import api from "@/lib/api";
import dialogEditFloatingIP from "./dialogEditFloatingIP.vue";
import dialogCreateFloatingIP from "./dialogCreateFloatingIP.vue";
import dialogDeleteRestore from "./dialogDeleteRestore.vue";
import dialogActivateFlavor from "./dialogActivateFlavor.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { ref } from "@vue/composition-api";

import { AccessControl } from "@/lib/middleware";

// const isDevMode = process.env.VUE_APP_DEV_MODE === "fase-1.3";
const isDevMode = true;

export default {
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Pricing'));
    return {
      read_only,
      toIDRWithDotFormat,
    };
  },
  components: {
    dialogEditFloatingIP,
    dialogCreateFloatingIP,
    dialogDeleteRestore,
    dialogActivateFlavor,
  },
  data() {
    return {
      loading: false,
      // upper table (default)
      defaultHeaders: [
        { text: "Default", value: "default", sortable: false },
        { text: "Type", value: "type", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Action", value: "action", align: "center", sortable: false },
      ],
      defaultItems: [
        // {
        //   default: 1,
        //   total: 1,
        //   price: 10000,
        //   price_per_month: 10000,
        // },
      ],
      defaultItems2: [
        // {
        //   default: 1,
        //   total: 1,
        //   price: 10000,
        //   price_per_month: 10000,
        // },
      ],
      selectedFloatingIP: null,
      openDialogEditFloatingIP: false,
      // table below
      searchText: "",
      openDialogCreateFloatingIP: false,
      customizedHeaders: [
        { text: "Organization", value: "organization", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Reserved Price", value: "reserved_price_per_month" },
        { text: "Non-Reserved Price", value: "non_reserved_price_per_month" },
        { text: "Start Date", value: "start_date" },
        { text: "Status", value: "status" },
        { text: "Action", value: "action", sortable: false },
      ],
      customizedItems: [
        // {
        //   total: 123,
        //   reserved_price: 2000000,
        //   non_reserved_price: 3000000,
        //   status: true,
        // },
        // {
        //   total: 456,
        //   reserved_price: 2000000,
        //   non_reserved_price: 3000000,
        //   status: true,
        // },
      ],
      customizedPagination: {
        count: 0,
        page: 1,
        totalpage: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },
      openDialogCustomizedSwitch: false,
      openDialogCustomizedDelete: false,
      selectedCustomized: null,
    };
  },
  methods: {
    async deleteFloatingIP(id) {
      this.loading = true;

      try {
        await api.DELETE("/flavor/floating-ip/" + id);

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Floating IP has been successfully deleted"
        );

        const newArr = this.customizedItems.filter((item) => item.id !== id);

        this.customizedItems = newArr;
        this.openDialogCustomizedDelete = false;
      } catch (err) {
        let errmsg = "Sorry, an error occurred while deleting floating IP";

        if (err.response && err.response.data && err.response.data.message) {
          errmsg = err.response.data.message;
        }

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
    },
    async changeStatus() {
      this.loading = true;
      const status =
        this.selectedCustomized.status === "active" ? "deactive" : "active";

      try {
        await api.PUT(
          `/flavor/floating-ip/${status}/${this.selectedCustomized.id}`
        );

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Status has been successfully updated"
        );

        const newArr = this.customizedItems.map((item) =>
          item.id === this.selectedCustomized.id
            ? {
                ...item,
                status,
              }
            : item
        );

        this.customizedItems = newArr;
        this.openDialogCustomizedSwitch = false;
      } catch (err) {
        let errmsg = "Sorry, an error occurred while changing status";

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          errmsg = err.response.data.message;
        }

        this.openDialogCustomizedSwitch = false;
        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
    },
    updateCustomizedItem(obj) {
      const newArr = this.customizedItems.map((item) =>
        item.id === obj.id ? obj : item
      );

      this.customizedItems = newArr;
    },
    async getCustomizedItems(search, page, limit, sortBy, sortDesc) {
      if (isDevMode) {
        this.loading = true;

        try {
          const res = await api.GET("/flavor/floating-ip", {
            search,
            page,
            limit,
            sortBy,
            sortDesc,
          });

          let newArr = [];

          if (res.data.floating_ip.length) {
            newArr = res.data.floating_ip.map((s) => {
              const {
                id,
                organization,
                total,
                reserved_price_per_month,
                non_reserved_price_per_month,
                start_date,
                status,
              } = s;

              return {
                id,
                organization: organization.name,
                total,
                reserved_price_per_month,
                non_reserved_price_per_month,
                start_date,
                status,
              };
            });
          }

          this.customizedItems = newArr;
          this.customizedPagination = {
            ...res.data.pagination,
            itemsPerPage: limit || this.customizedPagination.itemsPerPage,
            sortBy: sortBy || this.customizedPagination.sortBy,
            sortDesc: sortDesc || this.customizedPagination.sortDesc,
          };
        } catch (err) {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "Sorry, an error occurred while displaying customized floating IP data"
          );
        }

        this.loading = false;
      }
    },
    refreshData() {
      this.getCustomizedItems("", 1, 10, [], []);
    },
    async getDefaultItems() {
      this.loading = true;
      try {
        const res = await api.GET("/flavor/floating-ip/default/reserved");
        this.defaultItems = [
          {
            id: res.data.id,
            default: res.data.total,
            type: "reserved",
            price: {
              price_per_hour: res.data.reserved_price_per_hour,
              price_per_month: res.data.reserved_price_per_month,
            },
            // ...res.data,
          },
        ];
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying default reserved price data"
        );
      }
      this.loading = false;
    },
    async getDefaultItems2() {
      this.loading = true;
      try {
        const res = await api.GET("/flavor/floating-ip/default/non-reserved");
        this.defaultItems2 = [
          {
            id: res.data.id,
            default: res.data.total,
            type: "non-reserved",
            price: {
              price_per_hour: res.data.non_reserved_price_per_hour,
              price_per_month: res.data.non_reserved_price_per_month,
            },
            // ...res.data,
          },
        ];
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying default non-reserved price data"
        );
      }
      this.loading = false;
    },
    updateDefaultFloatingIP(obj) {
      // let item = {
      //   ...this.defaultItems[0],
      //   price: obj.pricePerMonth,
      // };

      if (obj.type === "non-reserved") {
        this.defaultItems2 = [obj];
      } else {
        this.defaultItems = [obj];
      }

      // this.selectedFloatingIP = item;
    },
  },
  mounted() {
    this.getCustomizedItems("", 1, 10, [], []);
    this.getDefaultItems();
    this.getDefaultItems2();
  },
  watch: {
    searchText() {
      this.getCustomizedItems(this.searchText, 1, 10, [], []);
    },
    customizedPagination(newVal, oldVal) {
      const changedCount = newVal.count !== oldVal.count;
      const changedPage = newVal.page !== oldVal.page;
      const changedItemsPerPage = newVal.itemsPerPage !== oldVal.itemsPerPage;
      const changedSortBy = newVal.sortBy[0] !== oldVal.sortBy[0];
      const changedSortDesc = newVal.sortDesc[0] !== oldVal.sortDesc[0];

      if (
        changedCount ||
        changedPage ||
        changedItemsPerPage ||
        changedSortBy ||
        changedSortDesc
      ) {
        this.getCustomizedItems(
          this.searchText,
          newVal.page,
          newVal.itemsPerPage,
          newVal.sortBy,
          newVal.sortDesc
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }
  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}
.v-input--switch {
  ::v-deep .v-input--switch__track {
    height: 20px;
    width: 42px;
    border-radius: 10px;
  }
  ::v-deep .v-input--selection-controls__ripple {
    display: none;
  }
  ::v-deep .v-input--switch__thumb {
    left: 8px;
    top: 8.5px;
    height: 12px;
    width: 12px;
  }
}
</style>
