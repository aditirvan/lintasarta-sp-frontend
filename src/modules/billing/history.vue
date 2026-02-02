<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text>
      <p class="fz-21 font-weight-bold">Balance History</p>
    </v-card-text>
    <v-data-table
      :headers="headers"
      :items="histories"
      :items-per-page="10"
      class="elevation-0"
      :server-items-length="pagination.count"
      :options.sync="options"
      hide-default-footer
    >
      <!-- amount -->
      <template v-slot:item.amount="{ item }">
        <span :style="item.type === 'plus' ? 'color: #27AE60' : 'color: red'">
          {{ item.type === "plus" ? "+" : "-" }}
          {{ toIDRWithDotFormat(item.amount) }}
        </span>
      </template>

      <!-- date -->
      <template v-slot:item.created_at="{ item }">
        <span>
          {{ $moment(item.created_at).format("DD/MM/YYYY") }}
        </span>
      </template>

      <!-- source -->
      <template v-slot:item.source="{ item }">
        <v-tooltip bottom :nudge-left="70">
          <template v-slot:activator="{ on, attrs }">
            <p
              class="primary--text"
              v-bind="attrs"
              v-on="on"
            >
              {{ item.source }}
            </p>
          </template>
          <span>{{ item.description }}</span>
        </v-tooltip>
      </template>

      <!-- pagination -->
      <template v-slot:footer="{ props }">
        <custom-footer-datatable
          @input="
            (val) => {
              options = { ...options, ...val };
            }
          "
         :props="props" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import { toIDRWithDotFormat } from "@/lib/formatter";

export default {
  setup() {
    return {
      toIDRWithDotFormat,
    };
  },
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Transaction ID", value: "transaction_id" },
        { text: "Source", value: "source" },
        { text: "Amount", value: "amount" },
        { text: "Date", value: "created_at" },
        { text: "By", value: "created_by" },
      ],
      histories: [],
      options: { page: 1, itemsPerPage: 10 },
      pagination: {}
    };
  },
  watch: {
    options(newOps, oldOps) {
      this.getBalanceHistory(newOps.page, newOps.itemsPerPage)
    }
  },
  methods: {
    async getBalanceHistory(page=1, limit=10) {
      try {
        const role = localstorage.getItem("role");
        const currentOrg = localstorage.getItem("currentOrg");
        const currentProj = localstorage.getItem("currentProj");
        const org = JSON.parse(currentOrg);
        const orgId = org ? org.id : "";
        const proj = JSON.parse(currentProj)
        const projID = proj ? proj.id : ""
        let endpoint = role === "Superadmin" ? `/superadmin/balance/history/${orgId}/${projID}?page=${page}&limit=${limit}` : `/balance/history/${projID}?page=${page}&limit=${limit}`

        const res = await api.GET(endpoint);

        if (res.data && res.data.balance_details.length) {
          this.histories = res.data.balance_details
            .map((topup) => {
              const {
                id,
                transaction_id,
                source,
                description,
                amount,
                created_at,
                type,
                created_by,
              } = topup;

              return {
                id,
                transaction_id,
                source,
                description,
                amount,
                created_at,
                type,
                created_by,
              };
            });

          this.pagination = res.data.pagination
        }
      } catch {
        this.$store.dispatch(
          "HOMEPAGE/showErrorToast",
          "Sorry, an error occurred while displaying Balance History"
        );
      }
    },
  },
  mounted() {
    this.getBalanceHistory();
  },
};
</script>