<template>
  <div>
    <v-card>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="firewall-title mb-4 mt-4 ml-2">
            Create Overview
          </v-list-item-title>
          <v-list-item-subtitle class="text-h5 mb-2"
            ><v-icon class="mr-4 ml-2">mdi-wrench</v-icon> Update your
            nameserver setup</v-list-item-subtitle
          >
          <v-list-item-title class="mb-2 mt-4 ml-14">
            <strong>{{ $route.params.name }}</strong> is no longer active on
            Cloudeka.
          </v-list-item-title>
          <v-list-item-title class="firewall-title mb-2 mt-2 ml-14">
            1. Log in to your register account
          </v-list-item-title>
          <v-list-item-title class="mb-6 mt-2 ml-14">
            Determine your register via WHOIS
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-14">
            Remove these nameserver
          </v-list-item-title>
          <v-list-item-title class="mb-2 mt-2 ml-14">
            <v-card style="background-color: #ebebeb" max-width="400">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    class="mb-2"
                    v-for="(row, index) in dnsOverviewExist"
                    :key="index"
                  >
                    {{ row.Host }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-list-item-title>
          <v-list-item-title class="firewall-title mb-2 mt-2 ml-14">
            2. Replace with Cloudeka's nameservers
          </v-list-item-title>
          <v-list-item-title
            class="mb-2 mt-2 ml-14"
            v-for="(row, index) in dnsOverview"
            :key="index"
          >
            <span
              ><v-icon class="mr-2" color="blue">mdi-soundcloud</v-icon
              >Nameserver {{ index + 1 }}</span
            >
            <v-text-field outlined filled readonly :value="row.name">
            </v-text-field>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions>
        <v-row class="ml-14 mb-4">
          <v-btn color="primary" to="/dns" class="sd ml-2" height="45" width="180"> Back </v-btn>
          <v-btn
            color="success"
            height="45"
            width="180"
            outlined
            class="ml-8 sd"
            :loading="isLoad"
            @click="checkNameserver()"
          >
            Check Nameservers
          </v-btn>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="grey darken-3"
                dark
                v-bind="attrs"
                v-on="on"
                class="ml-4"
              >
                mdi-information
              </v-icon>
            </template>
            <span>Check your site </span>
          </v-tooltip>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  defineComponent,
  onMounted,
} from "@vue/composition-api";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
export default {
  created() {
    this.getDnsOverview(this.$route.params.id);
  },
  setup() {
    onMounted(() => {});

    const {
      dnsOverview,
      isLoad,
      dnsOverviewExist,
    } = useNamespacedGetters("DNS", [
      "dnsOverview",
      "isLoad",
      "dnsOverviewExist",
    ]);

    const { getDnsOverview, getCheckNameservers } =
      useNamespacedActions("DNS", [
        "getDnsOverview",
        "getCheckNameservers",
      ]);

    function checkNameserver() {
      const local = JSON.parse(localStorage.getItem("loginDns") || "{}");
      const params = {
        id: this.$route.params.id,
        name: this.$route.params.name,
        organization_id: local.organization_id,
        project_id: local.project_id,
      };
      getCheckNameservers(params);
    }
    return {
      dnsOverview,
      isLoad,
      getDnsOverview,
      getCheckNameservers,
      dnsOverviewExist,
      checkNameserver,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field--outlined fieldset {
  background: #ebebeb;
  color: black;
}

.v-list-item__title {
  white-space: normal;
}

.v-input {
  max-width: 400px;
}

::v-deep .v-btn--round .v-btn__content .v-icon {
  color: #d92c2c !important;
}

.sd {
  box-shadow: none;
  font-size: 14px;
}
</style>