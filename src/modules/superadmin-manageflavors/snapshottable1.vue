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
        <p>{{ toIDRWithDotFormat(item.price_per_month) }}/Month</p>
        <p>{{ toIDRWithDotFormat(item.price_per_hours) }}/Hour</p>
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
                selectedSnapshot = item;
                openDialogEditSnapshot = true;
              }
            "
          >
            <span class="primary--text" :style="[read_only ? {'color': '#a9a9a9 !important'} : {}]">Edit</span>
          </label>
        </div>
      </template>
    </v-data-table>

    <v-divider />

    <!-- edit popup -->
    <dialogEditSnapshot
      v-if="selectedSnapshot && openDialogEditSnapshot"
      :item="selectedSnapshot"
      v-model="openDialogEditSnapshot"
      @close="openDialogEditSnapshot = false"
      @updateDefaultSnapshot="updateDefaultSnapshot($event)"
    />
  </v-card-text>
</template>

<script>
import api from "@/lib/api";
import dialogEditSnapshot from "./dialogEditSnapshot.vue";
import { toIDRWithDotFormat } from "@/lib/formatter";
import { AccessControl } from "@/lib/middleware";
import { ref } from "@vue/composition-api";

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
    dialogEditSnapshot,
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
      selectedSnapshot: null,
      openDialogEditSnapshot: false,
    };
  },
  methods: {
    async getTableItems() {
      try {
        const res = await api.GET("/flavor/snapshot/price");
        this.tableItems = [
          {
            default: res.data.total + " GB",
            price_per_month: res.data.price_per_month,
            price_per_hours: res.data.price_per_hours,
            ...res.data,
          },
        ];
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Default Snapshot datas"
        );
      }
    },
    updateDefaultSnapshot(params) {
      const item = {
        ...this.tableItems[0],
        price_per_month: params.pricePerMonth,
        price_per_hours: params.pricePerHours,
      };

      this.tableItems = [item];

      this.selectedSnapshot = item;
    },
  },
  mounted() {
    this.getTableItems();
  },
};
</script>
