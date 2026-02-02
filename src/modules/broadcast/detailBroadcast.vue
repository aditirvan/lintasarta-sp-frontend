<template>
  <v-card class="rounded-lg elevation-0">
    <v-container class="px-7 py-4" fluid>
      <v-row>
        <v-col class="d-flex flex-row align-center">
          <p class="mb-0 font-weight-bold fz-21">Detail Broadcast</p>
        </v-col>
      </v-row>

      <p v-if="loading" class="text-center">
        <beat-loader color="gray" size="10px" class="mr-2" />
      </p>

      <template v-else>
        <template v-if="broadcast">
          <v-row>
            <v-col>
              <p>
                <b>Title</b>
              </p>

              <p>{{ broadcast.broadcast_name }}</p>
            </v-col>

            <v-col>
              <!-- empty div for spacing -->
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>
                <b>Description</b>
              </p>

              <p>
                {{ broadcast.description }}
              </p>
            </v-col>

            <v-col>
              <!-- empty div for spacing -->
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>
                <b>Broadcast To</b>
              </p>

              <p>
                {{ broadcastTo }}
              </p>
            </v-col>

            <v-col>
              <!-- empty div for spacing -->
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <p>
                <b>Content</b>
              </p>

              <!-- <div v-html="broadcast.content" /> -->
              <VueMarkdown :source="broadcast.content" show html />
            </v-col>
          </v-row>

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
    broadcastTo() {
      const broadcastReceiver = this.broadcast.broadcast_receiver;
      const notEmptyArr = broadcastReceiver.length;
      const oneEl = broadcastReceiver.length === 1;

      if (
        (notEmptyArr && broadcastReceiver.length > 1) ||
        (oneEl && !broadcastReceiver[0].send_to_all)
      ) {
        return broadcastReceiver.map((b) => b.organization.name).join(", ");
      } else if (notEmptyArr && oneEl) {
        if (broadcastReceiver[0].send_to_all) {
          return "All";
        }
      }

      return "-";
    },
  },
  methods: {
    async getBroadcast() {
      this.loading = true;

      try {
        const res = await api.GET("/superadmin/broadcast/" + this.id);
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
