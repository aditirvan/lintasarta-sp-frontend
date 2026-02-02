<template>
  <v-card class="rounded-lg elevation-0">
    <v-container class="px-7 py-4" fluid>
      <!-- <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Detail Broadcast</p>
        </v-col>
      </v-row> -->

      <p v-if="loading" class="text-center">
        <beat-loader color="gray" size="10px" class="mr-2" />
      </p>

      <template v-else>
        <template v-if="broadcast">
          <p :style="{ color: 'gray' }">
            {{
              $moment(send_date).format("DD MMMM YYYY") ===
              $moment().format("DD MMMM YYYY")
                ? "Today"
                : $moment(send_date).format("DD MMMM YYYY")
            }}
          </p>

          <h1 :style="{ marginTop: '-10px', marginBottom: '10px' }">
            {{ broadcast.broadcast_name }}
          </h1>

          <VueMarkdown :source="broadcast.content" show html />

          <v-row>
            <v-col>
              <v-btn
                depressed
                block
                height="58"
                class="secondary"
                @click="$router.go(-1)"
              >
                <span class="fz-16px">Back</span>
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </template>
    </v-container>
  </v-card>
</template>

<script>
import api from "@/lib/api";
export default {
  data() {
    return {
      loading: false,
      broadcast: null,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    async getBroadcast() {
      this.loading = true;

      try {
        const res = await api.GET("/user/broadcast/" + this.id);
        this.broadcast = res.data;
      } catch (err) {
        let errmsg = "Sorry, an error occurred while displaying broadcast";
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
    this.getBroadcast();
  },
};
</script>

<style scoped>
.fz-16px {
  font-size: 16px;
}
</style>
