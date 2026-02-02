<template>
  <v-row>
    <v-col cols="12">
      <v-card class="rounded-lg" flat>
        <v-container fluid class="pa-7">
          <Header />

          <p v-if="loading" class="text-center">
            Loading tables ...
          </p>

          <template v-else>
            <InstanceTbl
              v-if="instance && instance.length"
              :tbl-items="instance"
              :is-postpaid-fixed="isPostpaidFixed"
            />

            <RootDiskTbl
              v-if="root_disk && root_disk.length"
              :tbl-items="root_disk"
              :is-postpaid-fixed="isPostpaidFixed"
            />

            <StorageTbl
              v-if="storage && storage.length"
              :tbl-items="storage"
              :is-postpaid-fixed="isPostpaidFixed"
            />

            <ObjectStorageTbl
              v-if="object_storage && object_storage.length"
              :tbl-items="object_storage"
              :is-postpaid-fixed="isPostpaidFixed"
            />

            <OperatingSystemTbl
              v-if="os && os.length"
              :tbl-items="os"
              :is-postpaid-fixed="isPostpaidFixed"
            />

            <SnapshotTbl
              v-if="snapshot && snapshot.length"
              :tbl-items="snapshot"
              :is-postpaid-fixed="isPostpaidFixed"
            />

            <FloatingIPTbl
              v-if="floating_ip && floating_ip.length"
              :tbl-items="floating_ip"
              :is-postpaid-fixed="isPostpaidFixed"
            />
          </template>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Header from "./Header.vue";
import InstanceTbl from "../billing-corporate-detail-billing-type/InstanceTbl.vue";
import RootDiskTbl from "../billing-corporate-detail-billing-type/RootDiskTbl.vue";
import StorageTbl from "../billing-corporate-detail-billing-type/StorageTbl.vue";
import ObjectStorageTbl from "../billing-corporate-detail-billing-type/ObjectStorageTbl.vue";
import OperatingSystemTbl from "../billing-corporate-detail-billing-type/OperatingSystemTbl.vue";
import SnapshotTbl from "../billing-corporate-detail-billing-type/SnapshotTbl.vue";
import FloatingIPTbl from "../billing-corporate-detail-billing-type/FloatingIPTbl.vue";
import api from "@/lib/api";
import localstorage from "@/lib/localstorage";

export default {
  components: {
    Header,
    InstanceTbl,
    RootDiskTbl,
    StorageTbl,
    ObjectStorageTbl,
    OperatingSystemTbl,
    SnapshotTbl,
    FloatingIPTbl,
  },
  data() {
    return {
      loading: false,
      instance: [],
      root_disk: [],
      storage: [],
      object_storage: [],
      os: [],
      snapshot: [],
      floating_ip: [],
      project: null,
    };
  },
  computed: {
    isPostpaidFixed() {
      const postpaidFixed =
        this.project && this.project.postpaid_type === "fixed";

      return postpaidFixed;
    },
  },
  methods: {
    async getHistoryDetail() {
      this.loading = true;

      try {
        const date = this.$route.params.date;

        const role = localstorage.getItem("role");
        const isSuperAdmin = role && role === "Superadmin";

        const currentOrg = localstorage.getItem("currentOrg");
        const org = JSON.parse(currentOrg);

        const admin = `/superadmin/billing/monthly-cost/summary/history/detail/${org.id}/${date}`;
        const user = "/billing/monthly-cost/summary/history/detail/" + date;

        const res = await api.GET(isSuperAdmin ? admin : user);

        const data = res.data;

        for (const prop in data) {
          if (Object.hasOwnProperty.call(data, prop)) {
            this[prop] = data[prop];
          }
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
    this.getHistoryDetail();
  },
};
</script>
