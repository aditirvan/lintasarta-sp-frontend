<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <!-- title & buttons -->
    <Header @add="addOn = true" @onSearch="getSales($event, 1, 10, [], [])" />

    <v-data-table
      hide-default-footer
      :items="tblItems"
      :items-per-page="10"
      :server-items-length="pagination.count"
      :headers="tblHeaders"
      :options.sync="pagination"
      class="mt-8"
    >
      <!-- loading / no data -->
      <template v-slot:no-data>
        {{ loading ? "Loading..." : "No data available" }}
      </template>

      <!-- organization partner -->
      <template v-slot:item.organization="{ item }">
        {{ item.organization.name || "-" }}
      </template>

      <!-- status user -->
      <template v-slot:item.is_verified="{ item }">
        {{
          item.is_verified === null
            ? "Waiting Verification"
            : item.is_verified
            ? "Verified"
            : "Not Verified"
        }}
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
              if (read_only){
                return
              }
              selectedSale = item;
              dialogSwitchOn = true;
            }
          "
          v-model="item.status"
          true-value="active"
          false-value="deactive"
        />
      </template>

      <!-- action -->
      <template v-slot:item.action="{ item }">
        <DropdownBtn
          :id="item.id"
          @detail="
            () => {
              selectedSale = item;
              detailOn = true;
            }
          "
          @editPopupOn="
            () => {
              if (read_only){
                return
              }
              selectedSale = item;
              editOn = true;
            }
          "
          @delete="
            () => {
              if (read_only){
                return
              }
              selectedSale = item;
              deleteOn = true;
            }
          "
        />
      </template>

      <!-- pagination -->
      <template v-slot:footer="{ props }">
        <custom-footer-datatable
          v-if="
            (pagination && pagination.count > 10) ||
              (pagination && pagination.count === 10)
          "
          @input="
            (val) => {
              pagination = { ...pagination, ...val };
            }
          "
          :props="props"
        />
      </template>
    </v-data-table>

    <!-- status popup -->
    <dialogActivateFlavor
      v-if="dialogSwitchOn && selectedSale"
      :onoff="selectedSale.status === 'active' ? 'off' : 'on'"
      v-model="selectedSale"
      @confirm="changeStatus"
      :loading="loading"
    />

    <!-- popups -->
    <Add v-if="addOn" v-model="addOn" @update="updateData" />

    <Detail
      v-if="detailOn && selectedSale"
      v-model="detailOn"
      :item="selectedSale"
      @update="updateData"
      @changeStatus="
        if (read_only){
          dialogSwitchOn = false
          return
        }
        dialogSwitchOn = true
      "
    />

    <Edit
      v-if="editOn && selectedSale"
      v-model="editOn"
      :item="selectedSale"
      @update="updateData"
    />

    <Delete
      v-if="deleteOn && selectedSale"
      v-model="deleteOn"
      :item="selectedSale"
      @confirm="deleteItem"
    />
  </v-card>
</template>

<script>
import api from "@/lib/api";
import Header from "./manage-sales/Header.vue";
import DropdownBtn from "./manage-sales/DropdownBtn.vue";
import dialogActivateFlavor from "../superadmin-manageflavors/dialogActivateFlavor.vue";
import Add from "./manage-sales/popup/Add.vue";
import Detail from "./manage-sales/popup/Detail.vue";
import Edit from "./manage-sales/popup/Edit.vue";
import Delete from "./manage-sales/popup/Delete.vue";
import { AccessControl } from "@/lib/middleware";
import { ref } from "@vue/composition-api";

export default {
  components: {
    Header,
    DropdownBtn,
    dialogActivateFlavor,
    Add,
    Detail,
    Edit,
    Delete,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Manage Sales'));
    return {
      read_only,
    };
  },
  data() {
    return {
      loading: false,

      // tbl
      tblHeaders: [
        // { text: "User ID", value: "id", sortable: false },
        { text: "Name", value: "fullname", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Phone Number", value: "phone_number", sortable: false },
        {
          text: "Description",
          value: "description",
          sortable: false,
        },
        { text: "Status", value: "status", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
      tblItems: [],
      pagination: {
        count: 0,
        page: 1,
        totalpage: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
      },

      // status slider popup
      dialogSwitchOn: false,
      selectedSale: null,

      // popups
      addOn: false,
      detailOn: false,
      editOn: false,
      deleteOn: false,

      search: "",
    };
  },
  methods: {
    updateData() {
      const { page, itemsPerPage, sortBy, sortDesc } = this;
      this.getSales(this.search, page, itemsPerPage || 10, sortBy, sortDesc);
    },
    async getSales(search, page, limit, sortBy, sortDesc) {
      this.search = search;
      this.loading = true;

      try {
        const res = await api.GET("/superadmin/sales", {
          search,
          page,
          limit,
          sortBy,
          sortDesc,
        });
        // console.log("getSales res.data", res.data);
        const { sales, pagination } = res.data;

        this.tblItems = sales || [];

        this.pagination = {
          ...pagination,
          itemsPerPage: limit || this.pagination.itemsPerPage,
          sortBy: sortBy || this.pagination.sortBy,
          sortDesc: sortDesc || this.pagination.sortDesc,
        };
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
    async changeStatus() {
      this.loading = true;

      const item = this.selectedSale;
      const status = item.status === "active" ? "deactive" : "active";

      try {
        await api.PUT(`/superadmin/sales/${status}/${item.id}`);

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Sales status has been successfully updated"
        );

        const newArr = this.tblItems.map((sale) =>
          sale.id === item.id
            ? {
                ...sale,
                status,
              }
            : sale
        );

        this.tblItems = newArr;
        this.dialogSwitchOn = false;
        this.selectedSale = { ...this.selectedSale, status };
      } catch (err) {
        let errmsg = "Sorry, an error occurred while submitting sales status";

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.data
        ) {
          errmsg = err.response.data.data;
        }

        this.dialogSwitchOn = false;

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
    },
    async deleteItem() {
      this.loading = true;

      try {
        await api.DELETE("/superadmin/sales/" + this.selectedSale.id);

        this.deleteOn = false;
        this.updateData();

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Sales status has been successfully updated"
        );
      } catch (err) {
        let errmsg = "Sorry, an error occurred while deleting sales";

        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.data
        ) {
          errmsg = err.response.data.data;
        }

        this.dialogSwitchOn = false;

        this.$store.dispatch("HOMEPAGE/showErrorToast", errmsg);
      }

      this.loading = false;
      // /superadmin/sales/
    },
  },
  mounted() {
    this.getSales("", 1, 10, [], []);
  },
  watch: {
    pagination(newVal, oldVal) {
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
        this.getSales(
          this.search,
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
