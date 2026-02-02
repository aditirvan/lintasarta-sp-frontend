<template>
  <v-tab-item>
    <v-card-text class="d-flex pa-8 flex-row align-center">
      <div class="headline font-weight-bold font--text">Default Snapshot</div>
    </v-card-text>

    <snapshottable1 />

    <!-- table 2 header -->
    <!-- <v-card-text class="d-flex pa-8 align-center">
      <div class="headline font-weight-bold font--text">
        Manage Snapshot (Customized)
      </div>

      <v-spacer />

      <v-text-field
        maxlength="50"
        style="max-width: 233px"
        outlined
        placeholder="Search Organization Name"
        hide-details=""
        v-model="restoreSizeSearchText"
      />

      <v-btn
        height="50"
        width="200"
        depressed
        class="secondary ml-8"
        @click="openDialogCreateSnapshot = true"
      >
        <span style="font-size: 14px"> Create Snapshot </span>
      </v-btn>
    </v-card-text>

    <v-card-text class="px-8"> -->
    <!-- tabs -->
    <!-- <v-tabs v-model="tabs" background-color="transparent" grow class="mb-6">
        <v-tab>
          Public
        </v-tab>
        <v-tab>
          Customized
        </v-tab>
      </v-tabs> -->

    <!-- customized table -->
    <!-- <v-data-table
        v-if="tabs > 0"
        hide-default-header
        hide-default-footer
        :items-per-page="10"
        :headers="customizedHeaders"
        :items="customizedItems"
        :server-items-length="customizedPagination.count"
        :options.sync="customizedPagination"
        class="elevation-0"
      > -->
    <!-- loading / no data -->
    <!-- <template v-slot:no-data>
          {{ loading ? "Loading..." : "No data available" }}
        </template> -->

    <!-- header -->
    <!-- <template v-slot:header="{ props, on }">
          <v-data-table-header
            v-on="on"
            v-bind="props"
            sort-icon="mdi-menu-down"
          />
        </template>

        <template v-slot:item.total="{ item }"> {{ item.total }} GB </template>

        <template v-slot:item.price_per_month="{ item }">
          <div v-if="item.price_per_month">
            IDR {{ item.price_per_month.toLocaleString("id-ID") }}
          </div>
          <div v-else>-</div>
        </template> -->

    <!-- status -->
    <!-- <template v-slot:item.status="{ item }">
          <v-switch
            class="mt-0 mb-2"
            hide-details
            flat
            readonly
            @click="
              () => {
                openDialogCustomizedSwitch = true;
                selectedCustomized = item;
              }
            "
            v-model="item.status"
            true-value="active"
            false-value="deactive"
          ></v-switch>
        </template> -->

    <!-- btns -->
    <!-- <template v-slot:item.action="{ item }">
          <div>
            <label
              style="cursor: pointer"
              @click="
                () => {
                  selectedCustomized = item;
                  openDialogCustomizedDelete = true;
                }
              "
            >
              <span class="error--text">Hapus</span>
            </label>
          </div>
        </template> -->

    <!-- pagination -->
    <!-- <template v-slot:footer="{ props }">
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
      </v-data-table> -->

    <!-- public table -->
    <!-- <v-data-table
        v-else
        :hide-default-footer="true"
        :headers="publicHeaders"
        :items-per-page="10"
        :server-items-length="publicPagination.count"
        :items="publicItems"
        class="elevation-0"
      > -->
    <!-- loading / no data -->
    <!-- <template v-slot:no-data>
          {{ loading ? "Loading..." : "No data available" }}
        </template>

        <template v-slot:item.total="{ item }"> {{ item.total }} GB </template>

        <template v-slot:item.price_per_month="{ item }">
          IDR{{ item.price_per_month.toLocaleString("id-ID") }}/Month
        </template> -->

    <!-- status -->
    <!-- <template v-slot:item.status="{ item }">
          <v-switch
            class="mt-0 mb-2"
            hide-details
            flat
            readonly
            @click="
              () => {
                openDialogPublicSwitch = true;
                selectedPublic = item;
              }
            "
            v-model="item.status"
            true-value="active"
            false-value="deactive"
          ></v-switch>
        </template> -->

    <!-- btns -->
    <!-- <template v-slot:item.action="{ item }">
          <div>
            <label
              style="cursor: pointer"
              @click="
                () => {
                  selectedPublic = item;
                  openDialogPublicEdit = true;
                }
              "
            >
              <span class="primary--text mr-6">Edit</span>
            </label>

            <label
              style="cursor: pointer"
              @click="
                () => {
                  selectedPublic = item;
                  openDialogPublicDelete = true;
                }
              "
            >
              <span class="error--text">Hapus</span>
            </label>
          </div>
        </template> -->

    <!-- pagination -->
    <!-- <template v-slot:footer="{ props }">
          <custom-footer-datatable
            v-if="
              (publicPagination && publicPagination.count > 5) ||
              (publicPagination && publicPagination.count === 5)
            "
            @input="
              (val) => {
                publicPagination = { ...publicPagination, ...val };
              }
            "
            :props="props"
          />
        </template>
      </v-data-table>
    </v-card-text> -->

    <!-- create popup -->
    <dialogCreateRestore
      v-if="openDialogCreateSnapshot"
      v-model="openDialogCreateSnapshot"
      api-endpoint="snapshot"
      @close="openDialogCreateSnapshot = false"
      @getRestore="getRestore($event)"
    />

    <!-- public status popup -->
    <dialogActivateFlavor
      v-if="openDialogPublicSwitch && selectedPublic"
      :onoff="selectedPublic.status == 'active' ? 'off' : 'on'"
      v-model="selectedPublic"
      @confirm="changeStatus(selectedPublic, 'public')"
      :loading="loading"
    />

    <!-- customized status popup -->
    <dialogActivateFlavor
      v-if="openDialogCustomizedSwitch && selectedCustomized"
      :onoff="selectedCustomized.status == 'active' ? 'off' : 'on'"
      v-model="selectedCustomized"
      @confirm="changeStatus(selectedCustomized, 'customized')"
      :loading="loading"
    />

    <!-- public edit popup -->
    <dialogEditPublic
      v-if="selectedPublic && openDialogPublicEdit"
      :item="selectedPublic"
      v-model="openDialogPublicEdit"
      @close="openDialogPublicEdit = false"
      @updatePublicItem="updatePublicItem($event)"
      api-endpoint="snapshot"
    />

    <!-- customized edit popup -->
    <dialogEditPublic
      v-if="selectedCustomized && openDialogPublicEdit"
      :item="selectedCustomized"
      v-model="openDialogPublicEdit"
      @close="openDialogPublicEdit = false"
      @updatePublicItem="updateCustomizedItem($event)"
      api-endpoint="snapshot"
    />

    <!-- public delete popup -->
    <dialogDeleteRestore
      v-if="selectedPublic && openDialogPublicDelete"
      v-model="openDialogPublicDelete"
      @close="openDialogPublicDelete = false"
      @confirm="deleteRestore(selectedPublic.id, 'public')"
      :loading="loading"
      title="Snapshot"
    />

    <!-- customized delete popup -->
    <dialogDeleteRestore
      v-if="selectedCustomized && openDialogCustomizedDelete"
      v-model="openDialogCustomizedDelete"
      @close="openDialogCustomizedDelete = false"
      @confirm="deleteRestore(selectedCustomized.id, 'customized')"
      :loading="loading"
      title="Snapshot"
    />
  </v-tab-item>
</template>

<script>
import dialogCreateRestore from "./dialogCreateRestore.vue";
import dialogActivateFlavor from "./dialogActivateFlavor";
import dialogDeleteRestore from "./dialogDeleteRestore";
import dialogEditPublic from "./dialogEditPublic";
import api from "@/lib/api";
import snapshottable1 from "./snapshottable1.vue";

// const isDevMode = process.env.VUE_APP_DEV_MODE === 'fase-1.3'
const isDevMode = true;

export default {
  components: {
    dialogCreateRestore,
    dialogActivateFlavor,
    dialogDeleteRestore,
    dialogEditPublic,
    snapshottable1,
  },
  data() {
    return {
      isDevMode,
      loading: false,
      restoreSizeSearchText: "",
      openDialogCreateSnapshot: false,
      tabs: 1,

      // public table
      publicHeaders: [
        { text: "Total", value: "total" },
        { text: "Price", value: "price_per_month", sortable: true },
        { text: "Status", value: "status" },
        { text: "Action", value: "action" },
      ],
      publicItems: [],
      selectedPublic: null,
      openDialogPublicSwitch: false,
      openDialogPublicEdit: false,
      openDialogPublicDelete: false,
      publicPagination: {
        count: 0,
        page: 1,
        totalpage: 1,
      },

      // customized table
      customizedHeaders: [
        { text: "Organization", value: "organization", sortable: false },
        { text: "Total", value: "total" },
        { text: "Price", value: "price_per_month", sortable: true },
        { text: "Start Date", value: "startDate", sortable: false },
        { text: "Status", value: "status" },
        { text: "Action", value: "action", sortable: false },
      ],
      customizedItems: [],
      selectedCustomized: null,
      openDialogCustomizedSwitch: false,
      // openDialogCustomizedEdit: false,
      openDialogCustomizedDelete: false,
      customizedPagination: {
        count: 0,
        page: 1,
        totalpage: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },
    };
  },
  methods: {
    // deletePublic(id) {},
    // deleteCustomized(id) {},
    // changePublicStatus() {},
    // changeCustomizedStatus() {},
    async deleteRestore(id, type) {
      this.loading = true;

      try {
        await api.DELETE("/flavor/snapshot/delete/" + id);

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Snapshot has been successfully deleted"
        );

        if (type === "public") {
          const newArr = this.publicItems.filter((p) => p.id !== id);

          this.publicItems = newArr;
          this.openDialogPublicDelete = false;
        } else {
          const newArr = this.customizedItems.filter((c) => c.id !== id);

          this.customizedItems = newArr;
          this.openDialogCustomizedDelete = false;
        }
      } catch (err) {
        let errmsg = "Sorry, an error occurred while deleting snapshot";

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          errmsg = err.response.data.message;
        }

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
    },
    async changeStatus(item, type) {
      this.loading = true;
      const status = item.status === "active" ? "deactive" : "active";

      try {
        await api.PUT(`/flavor/snapshot/${status}/${item.id}`);

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Status has been successfully updated"
        );

        if (type === "public") {
          const newArr = this.publicItems.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  status,
                }
              : p
          );

          this.publicItems = newArr;
          this.openDialogPublicSwitch = false;
        } else {
          const newArr = this.customizedItems.map((c) =>
            c.id === item.id
              ? {
                  ...c,
                  status,
                }
              : c
          );

          this.customizedItems = newArr;
          this.openDialogCustomizedSwitch = false;
        }
      } catch (err) {
        let errmsg = "Sorry, an error occurred while submitting snapshot";

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          errmsg = err.response.data.message;
        }

        if (type === "public") {
          this.openDialogPublicSwitch = false;
        } else {
          this.openDialogCustomizedSwitch = false;
        }

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
    },
    updatePublicItem(obj) {
      const newArr = this.publicItems.map((item) =>
        item.id === obj.id ? obj : item
      );

      this.publicItems = newArr;
    },
    updateCustomizedItem(obj) {
      const newArr = this.customizedItems.map((item) =>
        item.id === obj.id ? obj : item
      );

      this.customizedItems = newArr;
    },
    async getPublicItems(search, page, limit) {
      this.loading = true;

      try {
        const res = await api.GET("/flavor/snapshot", {
          search,
          page,
          limit,
        });

        let newArr = [];

        if (res.data.storage.length) {
          newArr = res.data.storage.map((s) => {
            const { total, price_per_month, status } = s;
            return {
              total,
              price_per_month,
              status,
              ...s,
            };
          });
        }

        this.publicItems = newArr;
        this.publicPagination = res.data.pagination;
      } catch (err) {
        let errmsg =
          "Sorry, an error occurred while displaying customized snapshot data";

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          errmsg = err.response.data.message;
        }

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
    },
    async getCustomizedItems(search, page, limit, sortBy, sortDesc) {
      if (this.isDevMode) {
        this.loading = true;

        try {
          // const res = await api.GET("/flavor/snapshot?type=customized", {
          const res = await api.GET("/flavor/snapshot", {
            search,
            page,
            limit,
            sortBy,
            sortDesc,
          });

          let newArr = [];

          if (res.data.snapshot.length) {
            newArr = res.data.snapshot.map((s) => {
              const {
                total,
                price_per_month,
                start_date,
                status,
                organization,
              } = s;
              return {
                ...s,
                organization: organization.name,
                total,
                price_per_month,
                startDate: start_date
                  ? this.$moment(start_date).format("DD/MM/YYYY")
                  : "-",
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
          let errmsg =
            "Sorry, an error occurred while displaying customized snapshot data";

          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            errmsg = err.response.data.message;
          }

          this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
        }

        this.loading = false;
      }
    },
    getRestore(type) {
      if (type === "public") {
        this.getPublicItems("", 1, 10);
      } else {
        this.getCustomizedItems("", 1, 10, [], []);
      }
    },
  },
  mounted() {
    // this.getPublicItems();
    this.getCustomizedItems("", 1, 10, [], []);
  },
  watch: {
    restoreSizeSearchText() {
      if (this.tabs > 0) {
        this.getCustomizedItems(this.restoreSizeSearchText, 1, 10, [], []);
      } else {
        this.getPublicItems(this.restoreSizeSearchText, 1, 10);
      }
    },
    tabs() {
      if (this.tabs > 0) {
        this.getCustomizedItems();
      } else {
        this.getPublicItems();
      }
    },
    publicPagination(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.getPublicItems(
          this.restoreSizeSearchText,
          this.publicPagination.page,
          oldVal.itemsPerPage
            ? oldVal.itemsPerPage
            : this.publicPagination.itemsPerPage
        );
      }
    },
    customizedPagination2(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.getCustomizedItems(
          this.restoreSizeSearchText,
          this.customizedPagination.page,
          oldVal.itemsPerPage
            ? oldVal.itemsPerPage
            : this.customizedPagination.itemsPerPage
        );
      }
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
          this.restoreSizeSearchText,
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
