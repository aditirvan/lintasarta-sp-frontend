<template>
  <div class="pa-4">
    <div v-for="notif in notifs" :key="'notif-' + notif.id">
      <ActivationDate
        v-if="notif.type === 'ACTIVATION_DATE'"
        :item="notif"
        @refreshData="getNotifs()"
      />

      <InternalBilling
        v-else-if="notif.type === 'INTERVAL_BILLING'"
        :item="notif"
        @refreshData="getNotifs()"
      />

      <InvoiceDuePeriod v-else :item="notif" @refreshData="getNotifs()" />
    </div>
  </div>
</template>

<script>
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";
import ActivationDate from "./approval-notification/ActivationDate.vue";
import InternalBilling from "./approval-notification/InternalBilling.vue";
import InvoiceDuePeriod from "./approval-notification/InvoiceDuePeriod.vue";

export default {
  components: {
    ActivationDate,
    InternalBilling,
    InvoiceDuePeriod,
  },
  data() {
    return {
      loading: false,
      notifs: [],
    };
  },
  methods: {
    async getNotifs() {
      try {
        const json = localstorage.getItem("currentOrg");
        const org = JSON.parse(json)
        const res = await api.GET(`/superadmin/project/approval/${org.id}/list`);
        this.notifs = res.data;
      } catch (err) {
        let errmsg =
          "Sorry, an error occurred while displaying approval notifs";
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
    },
  },
  mounted() {
    this.getNotifs();
  },
};
</script>
