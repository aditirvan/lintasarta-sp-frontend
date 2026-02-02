<template>
  <v-tab-item>
    <v-card-text class="d-flex pa-8 flex-row align-center">
      <div class="headline font-weight-bold font--text">Default Restore</div>
    </v-card-text>

    <!-- table 1 -->
    <restoretable1 />

    <!-- table 2 header -->
    <v-card-text class="d-flex pa-8 align-center">
      <div class="headline font-weight-bold font--text">
        Manage Restore (Customized)
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
        @click="openDialogCreateRestore = true"
      >
        <span style="font-size: 14px"> Create Restore </span>
      </v-btn>
    </v-card-text>

    <v-card-text class="px-8">
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
      <v-data-table
        v-if="tabs > 0"
        hide-default-header
        hide-default-footer
        :items-per-page="5"
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

        <template v-slot:item.total="{ item }"> {{ item.total }}x </template>

        <template v-slot:item.additionalPrice="{ item }">
          <b> IDR {{ item.additionalPrice.toLocaleString("id-ID") }} </b>
        </template>

        <template v-slot:item.price="{ item }">
          <b> IDR {{ item.price.toLocaleString("id-ID") }} </b>/Month
        </template>

        <!-- status -->
        <template v-slot:item.status="{ item }">
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
        </template>

        <!-- btns -->
        <template v-slot:item.action="{ item }">
          <div>
            <!-- <label
              style="cursor: pointer"
              @click="
                () => {
                  selectedCustomized = item;
                  openDialogCustomizedEdit = true;
                }
              "
            >
              <span class="primary--text mr-6">Edit</span>
            </label> -->

            <label
              style="cursor: pointer"
              @click="
                () => {
                  selectedCustomized = item;
                  openDialogCustomizedDelete = true;
                }
              "
            >
              <span class="error--text">Delete</span>
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

      <!-- public table -->
      <v-data-table
        hide-default-footer
        :headers="publicHeaders"
        :items-per-page="5"
        :server-items-length="publicPagination.count"
        :items="publicItems"
        class="elevation-0"
      >
        <!-- loading / no data -->
        <template v-slot:no-data>
          {{ loading ? "Loading..." : "No data available" }}
        </template>

        <template v-slot:item.total="{ item }"> {{ item.total }}x </template>

        <template v-slot:item.price="{ item }">
          IDR {{ item.price.toLocaleString("id-ID") }}/Month
        </template>

        <!-- status -->
        <template v-slot:item.status="{ item }">
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
        </template>

        <!-- btns -->
        <template v-slot:item.action="{ item }">
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
              <span class="error--text">Delete</span>
            </label>
          </div>
        </template>

        <!-- pagination -->
        <template v-slot:footer="{ props }">
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
    </v-card-text>

    <!-- create popup -->
    <dialogCreateRestore
      v-if="openDialogCreateRestore"
      v-model="openDialogCreateRestore"
      @close="openDialogCreateRestore = false"
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
    />

    <!-- customized edit popup -->
    <dialogEditCustomized
      v-if="selectedCustomized && openDialogCustomizedEdit"
      :item="selectedCustomized"
      v-model="openDialogCustomizedEdit"
      @close="openDialogCustomizedEdit = false"
      @updateCustomizedItem="updateCustomizedItem($event)"
    />

    <!-- public delete popup -->
    <dialogDeleteRestore
      v-if="selectedPublic && openDialogPublicDelete"
      v-model="openDialogPublicDelete"
      @close="openDialogPublicDelete = false"
      @confirm="deleteRestore(selectedPublic.id, 'public')"
      :loading="loading"
    />

    <!-- customized delete popup -->
    <dialogDeleteRestore
      v-if="selectedCustomized && openDialogCustomizedDelete"
      v-model="openDialogCustomizedDelete"
      @close="openDialogCustomizedDelete = false"
      @confirm="deleteRestore(selectedCustomized.id, 'customized')"
      :loading="loading"
    />
  </v-tab-item>
</template>

<script>
import dialogCreateRestore from "./dialogCreateRestore.vue";
import dialogActivateFlavor from "./dialogActivateFlavor";
import dialogDeleteRestore from "./dialogDeleteRestore";
import dialogEditPublic from "./dialogEditPublic";
import dialogEditCustomized from "./dialogEditCustomized";
import restoretable1 from "./restoretable1";
import api from "@/lib/api";

const isDevMode = process.env.VUE_APP_DEV_MODE === "fase-1.3";

export default {
  components: {
    dialogCreateRestore,
    dialogActivateFlavor,
    dialogDeleteRestore,
    dialogEditPublic,
    dialogEditCustomized,
    restoretable1,
  },
  data() {
    return {
      isDevMode,
      loading: false,
      restoreSizeSearchText: "",
      openDialogCreateRestore: false,
      tabs: 1,

      // public table
      publicHeaders: [
        { text: "Total", value: "total" },
        { text: "Price", value: "price" },
        { text: "Status", value: "status" },
        { text: "Action", value: "action" },
      ],
      publicItems: [],
      selectedPublic: null,
      openDialogPublicDelete: false,
      openDialogPublicSwitch: false,
      openDialogPublicEdit: false,
      publicPagination: {
        count: 0,
        page: 1,
        totalpage: 1,
      },

      // customized table
      customizedHeaders: [
        { text: "Organization", value: "organization", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Price", value: "price", sortable: false },
        { text: "Start Date", value: "startDate", sortable: false },
        { text: "Additional Price", value: "additionalPrice", sortable: false },
        { text: "Status", value: "status" },
        { text: "Action", value: "action", sortable: false },
      ],
      customizedItems: [],
      selectedCustomized: null,
      openDialogCustomizedDelete: false,
      openDialogCustomizedSwitch: false,
      openDialogCustomizedEdit: false,
      customizedPagination: {
        count: 0,
        page: 1,
        totalpage: 1,
      },
    };
  },
  methods: {
    async deleteRestore(id, type) {
      this.loading = true;

      try {
        await api.DELETE("/flavor/restore/delete/" + id);

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Restore status has been successfully deleted"
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
        let errmsg = "Sorry, an error occurred while deleting Restore status";

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.data
        ) {
          errmsg = err.response.data.data;
        }

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
    },
    async changeStatus(item, type) {
      this.loading = true;
      const status = item.status === "active" ? "deactive" : "active";

      try {
        await api.PUT(`/flavor/restore/${status}/${item.id}`);

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Restore status has been successfully updated"
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
        let errmsg = "Sorry, an error occurred while submitting Restore status";

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.data
        ) {
          errmsg = err.response.data.data;
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
        const res = await api.GET("/flavor/restore", {
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
              price: price_per_month,
              status,
              ...s,
            };
          });
        }

        this.publicItems = newArr;
        this.publicPagination = res.data.pagination;
      } catch (err) {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying customized restore data"
        );
      }

      this.loading = false;
    },
    async getCustomizedItems(search, page, limit, sortBy, sortDesc) {
      if (this.isDevMode) {
        this.loading = true;

        try {
          // const res = await api.GET("/flavor/restore?type=customized", {
          const res = await api.GET("/flavor/restore", {
            search,
            page,
            limit,
            sortBy,
            sortDesc,
          });

          let newArr = [];

          if (res.data.restore.length) {
            newArr = res.data.restore.map((s) => {
              const {
                total,
                price_per_month,
                start_date,
                additional_price,
                status,
                organization,
              } = s;
              return {
                ...s,
                organization: organization.name,
                total,
                price: price_per_month,
                startDate: this.$moment(start_date).format("DD/MM/YYYY"),
                additionalPrice: additional_price,
                status,
              };
            });
          }

          this.customizedItems = newArr;
          this.customizedPagination = res.data.pagination;
        } catch (err) {
          this.$store.dispatch(
            "HOMEPAGE/showErrorToast",
            "Sorry, an error occurred while displaying customized restore data"
          );
        }

        this.loading = false;
      }
    },
    getRestore(type) {
      if (type === "public") {
        this.getPublicItems();
      } else {
        this.getCustomizedItems();
      }
    },
  },
  mounted() {
    // this.getPublicItems();
    this.getCustomizedItems();
  },
  watch: {
    restoreSizeSearchText() {
      if (this.tabs > 0) {
        this.getCustomizedItems(this.restoreSizeSearchText);
      } else {
        this.getPublicItems(this.restoreSizeSearchText);
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
    customizedPagination(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        this.getCustomizedItems(
          this.restoreSizeSearchText,
          this.customizedPagination.page,
          // itemsPerPage
          oldVal.itemsPerPage
            ? oldVal.itemsPerPage
            : this.customizedPagination.itemsPerPage,
          // sortBy
          oldVal.sortBy ? oldVal.sortBy : this.customizedPagination.sortBy,
          // sortDesc
          oldVal.sortDesc ? oldVal.sortDesc : this.customizedPagination.sortDesc
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
