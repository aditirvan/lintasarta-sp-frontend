<template>
  <v-card flat class="rounded-lg pa-4 mt-3">
    <v-card-text>
      <p class="fz-21 font-weight-bold mb-8">Outstanding</p>

      <v-data-table
        hide-default-footer
        :headers="tblHeaders"
        :items="tblItems"
        :items-per-page="10"
        :server-items-length="pagination.count"
        :options.sync="pagination"
      >
        <!-- loading / no data -->
        <template v-slot:no-data>
          {{ loading ? "Loading..." : "No data available" }}
        </template>

        <template v-slot:item.amount="{ item }">
          {{ toIDRWithDotFormat(item.amount) }}
        </template>

        <template v-slot:item.payment_method="{ item }">
          {{ uppercaseFirstLetter(item.payment_method) }}
        </template>

        <template v-slot:body.append>
          <tr style="border: none">
            <td class="border-bottom-none"></td>
            <td class="border-bottom-none"></td>
            <td class="border-bottom-none">
              <!-- <div>
                        <p class="font-weight-bold">Total</p>
                      </div>
                      <div class="d-flex flex-row justify-start">
                        {{
                          totalBilledInstances
                            ? IDRformat.format(totalBilledInstances)
                            : "-"
                        }}
                      </div> -->

              <v-row class="primary">
                <v-col>
                  <b class="white--text">Total</b>
                </v-col>

                <v-col>
                  <b class="white--text">{{ toIDRWithDotFormat(total) }}</b>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>

        <!-- <template v-slot:footer="{ props }" v-if="tblItems.length">
          <custom-footer-datatable :props="props" />
        </template> -->

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
    </v-card-text>
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
      loading: false,
      tblHeaders: [
        { text: "Project Name", value: "project_name", sortable: false },
        { text: "Payment Method", value: "payment_method", sortable: false },
        {
          text: "Outstanding Amount",
          value: "amount",
          sortable: false,
        },
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
      total: 0,
    };
  },
  computed: {
    currentOrg() {
      const org = localstorage.getItem("currentOrg");

      if (!org) return null;

      return JSON.parse(org);
    },
    isSuperAdmin() {
      const role = localstorage.getItem("role");
      const isSuperAdmin = role && role === "Superadmin";

      return isSuperAdmin;
    },
  },
  methods: {
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    async getOutstanding(search, page, limit, sortBy, sortDesc) {
      this.loading = true;

      try {
        const orgid = this.currentOrg.id;
        const userEndpoint = "/balance/outstanding";
        const superadminEndpoint = "/superadmin/balance/outstanding/" + orgid;
        const res = await api.GET(
          this.isSuperAdmin ? superadminEndpoint : userEndpoint,
          {
            search,
            page,
            limit,
            sortBy,
            sortDesc,
          }
        );

        const { total, data, pagination } = res.data;

        this.total = total;
        this.tblItems = data;

        if (pagination) {
          this.pagination = {
            ...pagination,
            itemsPerPage: limit || this.pagination.itemsPerPage,
            sortBy: sortBy || this.pagination.sortBy,
            sortDesc: sortDesc || this.pagination.sortDesc,
          };
        }
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
  },
  mounted() {
    this.getOutstanding("", 1, 10, [], []);
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
        this.getOutstanding(
          "",
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
