<template>
  <div
    class="amber lighten-4 notif-box d-flex justify-space-between align-center"
  >
    <div :style="{ color: 'orange' }">
      <span
        ><b>Interval Billing | {{ item.project.name }} | {{ item.description }}</b></span
      >
      <br /><br />
      <span>
        There is an addition or change of information for Internal Billing
      </span>
    </div>

    <div class="d-flex align-center">
      <v-btn
        elevation="0"
        class="notif-btn mr-4 green accent-4 white--text"
        @click="action('approve')"
        :disabled="loading"
      >
        Approve

        <!-- loading indicator -->
        <beat-loader
          v-if="loading"
          :loading="loading"
          :color="'white'"
          :size="'10px'"
          class="ml-2"
        />
      </v-btn>

      <v-btn
        elevation="0"
        class="notif-btn mr-4 error"
        @click="action('reject')"
        :disabled="loading"
      >
        Reject

        <!-- loading indicator -->
        <beat-loader
          v-if="loading"
          :loading="loading"
          :color="'white'"
          :size="'10px'"
          class="ml-2"
        />
      </v-btn>
    </div>
  </div>
</template>

<script>
import api from "@/lib/api";

export default {
  props: ["item"],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async action(action) {
      this.loading = true;

      try {
        const payload = {
          id: this.item.id,
          action,
          reason: null,
        };

        await api.POST("/superadmin/project/approval", payload);
        this.$emit("refreshData");

        const msg = action === "approve" ? "approved" : "rejected";

        this.$store.dispatch(
          "HOMEPAGE/showSuccessToast",
          "Interval Billing has been successfully " + msg,
          { root: true }
        );
      } catch (err) {
        let errmsg = "Sorry, an error occurred while submitting data";
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
};
</script>

<style scoped>
.notif-box {
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 16px;
}

.notif-btn {
  padding-right: 20px !important;
  padding-left: 20px !important;
}
</style>
