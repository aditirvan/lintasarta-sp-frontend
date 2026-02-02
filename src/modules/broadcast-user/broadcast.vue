<template>
  <v-card class="rounded-lg elevation-0">
    <v-container class="px-7 py-4" fluid>
      <Selects />

      <p v-if="loading" class="text-center mt-4">
        <beat-loader color="gray" size="10px" class="mr-2" />
      </p>

      <template v-else>
        <template v-if="broadcasts.length">
          <BroadcastItem
            v-for="broadcast in broadcasts"
            :key="'broadcast-item-' + broadcast.id"
            :item="broadcast"
          />

          <div class="d-flex justify-center align-center">
            <v-pagination
              class="mt-4 broadcast-pagination"
              :style="{ borderRadius: '10px' }"
              v-model="pagination.page"
              :length="pagination.totalpage"
              circle
              @input="changeNumber"
              @previous="previous"
              @next="next"
              prev-icon="Prev"
              next-icon="Next"
            />
          </div>
        </template>

        <p v-else class="text-center mt-4">Data not found</p>
      </template>
    </v-container>
  </v-card>
</template>

<script>
import api from "@/lib/api";
import Selects from "./broadcast/Selects.vue";
import BroadcastItem from "./broadcast/BroadcastItem.vue";

export default {
  components: {
    Selects,
    BroadcastItem,
  },
  data() {
    return {
      loading: false,
      pagination: {
        count: 0,
        page: 1,
        totalpage: 1,
      },
      broadcasts: [],
    };
  },
  computed: {
    query() {
      return this.$route.query;
    },
    page() {
      return this.query.page;
    },
  },
  methods: {
    async getBroadcasts(page, month, year) {
      this.loading = true;

      try {
        const res = await api.GET("/user/broadcast/all", {
          page: this.page || page,
          month,
          year,
        });

        const { broadcast, pagination } = res.data;

        this.broadcasts = broadcast;
        this.pagination = pagination;
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
    changeNumber(num) {
      this.$router.push({ query: { ...this.query, page: num } });
    },
    next() {
      this.$router.push({ query: { ...this.query, page: this.page } });
    },
    previous() {
      this.$router.push({ query: { ...this.query, page: this.page } });
    },
  },
  mounted() {
    this.getBroadcasts("", 1, 10, [], []);
  },
  watch: {
    "$route.query"(newVal) {
      const { page, month, year } = this.query;
      this.getBroadcasts(page, month, year);
    },
  },
};
</script>
