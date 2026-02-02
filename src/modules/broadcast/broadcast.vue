<template>
  <v-card class="rounded-lg elevation-0">
    <v-container class="px-7 py-4" fluid>
      <Header @onSearch="getBroadcasts($event, 1, 10, [], [])"/>

      <v-row>
        <v-col>
          <v-data-table
            hide-default-footer
            :items="tblItems"
            :items-per-page="10"
            :server-items-length="pagination.count"
            :headers="tblHeaders"
            :options.sync="pagination"
          >
            <!-- loading / no data -->
            <template v-slot:no-data>
              <beat-loader
                color="gray"
                size="10px"
                class="mr-2"
                v-if="loading"
              />
              <template v-else>No data available</template>
            </template>

            <!-- desc -->
            <template v-slot:item.description="{ item }">
              {{
                item.description && item.description.length > 100
                  ? item.description.substring(0, 100) + "..."
                  : item.description
              }}
            </template>

            <!-- send date -->
            <template v-slot:item.send_date="{ item }">
              {{ $moment(item.send_date).format("HH:mm:ss") }}
              <br/>
              {{ $moment(item.send_date).format("DD/MM/YYYY") }}
            </template>

            <!-- status -->
            <template v-slot:item.status="{ item }">
              {{
                new Date(item.send_date).getTime() > new Date().getTime()
                  ? "Draft"
                  : "Sent"
              }}
            </template>

            <!-- action -->
            <template v-slot:item.action="{ item }">
              <DropdownBtn
                :id="item.id"
                :is-draft="
                  new Date(item.send_date).getTime() > new Date().getTime()
                "
                @refreshData="getBroadcasts('', 1, 10, [], [])"
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
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import api from "@/lib/api";
import Header from "./broadcast/header.vue";
import DropdownBtn from "./broadcast/dropdownBtn.vue";

export default {
  components: {
    Header,
    DropdownBtn,
  },
  data() {
    return {
      loading: false,
      tblHeaders: [
        { text: "Title", value: "broadcast_name", sortable: false },
        { text: "Description", value: "description", sortable: false },
        { text: "Send Date", value: "send_date" },
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
      search: "",
    };
  },
  methods: {
    async getBroadcasts(search, page, limit, sortBy, sortDesc) {
      this.search = search;
      this.loading = true;

      try {
        const res = await api.GET("/superadmin/broadcast", {
          search,
          page,
          limit,
          sortBy,
          sortDesc,
        });

        const { broadcast, pagination } = res.data;

        this.tblItems = broadcast;

        this.pagination = {
          ...pagination,
          itemsPerPage: limit || this.pagination.itemsPerPage,
          sortBy: sortBy || this.pagination.sortBy,
          sortDesc: sortDesc || this.pagination.sortDesc,
        };
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying broadcasts";
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
    this.getBroadcasts("", 1, 10, [], []);
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
        this.getBroadcasts(
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
