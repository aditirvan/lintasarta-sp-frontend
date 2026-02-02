<template>
  <v-card-text class="px-8">
    <!-- table 1 -->
    <v-data-table
      :hide-default-footer="true"
      :headers="tableHeaders"
      :items-per-page="5"
      :items="tableItems"
      class="elevation-0"
    >
      <template v-slot:item.price="{ item }">
        IDR {{ item.price.toLocaleString("id-ID") }}
      </template>

      <!-- edit btn -->
      <template v-slot:item.action="{ item }">
        <div>
          <label style="cursor: pointer" @click="editDefaultRestore(item)">
            <span class="primary--text">Edit</span>
          </label>
        </div>
      </template>
    </v-data-table>

    <v-divider />

    <!-- restore edit popup -->
    <dialogEditRestore
      v-if="selectedRestore && openDialogEditRestore"
      :item="selectedRestore"
      v-model="openDialogEditRestore"
      @close="
        () => {
          openDialogEditRestore = false;
          selectedRestore = null;
        }
      "
      @updateDefaultRestore="updateDefaultRestore($event)"
    />
  </v-card-text>
</template>

<script>
import api from "@/lib/api";
import dialogEditRestore from "./dialogEditRestore.vue";

export default {
  components: {
    dialogEditRestore,
  },
  data() {
    return {
      // table 1
      tableHeaders: [
        { text: "Default", value: "default" },
        { text: "Price", value: "price", sortable: true },
        { text: "Action", value: "action", align: "center" },
      ],
      tableItems: [],
      selectedRestore: null,
      openDialogEditRestore: false,
    };
  },
  methods: {
    async getTableItems() {
      try {
        const res = await api.GET("/flavor/restore/default");
        this.tableItems = [
          {
            default: res.data.total + "x",
            price: res.data.price_per_month,
            ...res.data,
          },
        ];
        console.log(res.data);
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Default Restore datas"
        );
      }
    },
    editDefaultRestore(item) {
      this.selectedRestore = item;
      this.openDialogEditRestore = true;
    },
    updateDefaultRestore(pricePerMonth) {
      const item = {
        ...this.tableItems[0],
        price: pricePerMonth,
        price_per_month: pricePerMonth,
      };

      this.tableItems = [item];
      this.selectedRestore = item;
    },
  },
  mounted() {
    this.getTableItems();
  },
};
</script>
