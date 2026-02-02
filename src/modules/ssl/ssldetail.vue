<template>
  <v-container class="pa-0" fluid>
    <v-row v-if="detailSsl">
      <v-col>
        <v-card flat class="rounded-lg elevation-0 pa-3">
          <v-card-title class="d-flex flex-row justify-space-between pb-0">
            <div class="d-flex flex-row align-center">
              <div>
                <v-icon style="font-size: 50px" color="primary"
                  >mdi-circle</v-icon
                >
              </div>
              <v-col class="py-0">
                <h4>{{ detailSsl.fqdn }}</h4>
              </v-col>
            </div>
            <v-row class="justify-end">
              <template>
                <popupquote
                  :offsetTop="15"
                  :documentid="'popup'"
                  offset-y
                  allow-overflow
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      width="150"
                      class="secondary mr-10"
                      height="50"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      Download
                    </v-btn>
                  </template>
                  <v-list width="150" class="linkpointer">
                    <v-list-item v-if="listKey.length === 0"
                      >No data available</v-list-item
                    >
                    <v-list-item
                      v-else
                      class="tile"
                      v-for="(item, index) in listKey"
                      :key="index"
                    >
                      <v-list-item-title @click="download(item.fileName)"
                        ><v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">{{
                              item.fileName
                            }}</span>
                          </template>
                          <span>{{ item.fileName }}</span>
                        </v-tooltip></v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </popupquote>
              </template>
              <template v-if="!detailSsl.isExternalSSL">
                <v-btn
                  v-if="!read_only"
                  :disabled="
                    isLoadingRenewal && isItemRenewal(detailSsl.domainName)
                  "
                  depressed
                  height="50"
                  width="150"
                  class="secondary"
                  @click="
                    () => {
                      validateprivilages(['SSL', 'editor']).then(async () => {
                        if (validateRenewal(detailSsl)) {
                          opendialogvalidaterenewal = true;
                        } else {
                          opendialogrenewal = true;
                        }
                      });
                    }
                  "
                >
                  <beat-loader
                    v-if="isLoadingRenewal && isItemRenewal(detailSsl.fqdn)"
                    :loading="isLoadingRenewal && isItemRenewal(detailSsl.fqdn)"
                    :color="'white'"
                    :size="'10px'"
                    class="mr-2"
                  ></beat-loader>
                  <span v-else style="font-size: 14px">Renewal</span>
                </v-btn>
              </template>
            </v-row>
          </v-card-title>
          <v-card-actions>
            <v-tabs v-model="tab">
              <v-tab to="overview" replace>Overview</v-tab>
              <v-tab to="keys" @click="getKeys" replace>Keys</v-tab>
            </v-tabs>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs-items v-model="tablastpath">
          <v-tab-item value="overview">
            <v-card flat class="rounded-lg pa-3">
              <v-card-text>
                <div class="d-flex flex-row" style="align-items: center">
                  <div class="headline font-weight-bold font--text">
                    Overview
                  </div>
                  <v-spacer />
                </div>
              </v-card-text>
              <v-card outlined>
                <v-card-text>
                  <v-row>
                    <v-col cols="4" class="py-1 font--text font-weight-bold"
                      >Description</v-col
                    >
                    <v-col cols="8" class="py-1 font--text">{{
                      detailSsl.description
                    }}</v-col>
                  </v-row>
                  <v-row v-if="detailSsl.notBefore">
                    <v-col cols="4" class="py-1 font--text font-weight-bold"
                      >Not Before</v-col
                    >
                    <v-col cols="8" class="py-1 font--text">{{
                      $moment(detailSsl.notBefore).format("DD/MM/YYYY HH:mm:ss")
                    }}</v-col>
                  </v-row>
                  <v-row v-if="detailSsl.signatureAlgorithm">
                    <v-col cols="4" class="py-1 font--text font-weight-bold"
                      >Signature</v-col
                    >
                    <v-col cols="8" class="py-1 font--text">{{
                      detailSsl.signatureAlgorithm
                    }}</v-col>
                  </v-row>
                  <v-row v-if="!detailSsl.isExternalSSL">
                    <v-col cols="4" class="py-1 font--text font-weight-bold"
                      >Last Renewal</v-col
                    >
                    <v-col
                      cols="8"
                      class="py-1 font--text"
                      v-if="
                        $moment(detailSsl.createdAt).isSame(
                          $moment(detailSsl.lastRenewal)
                        )
                      "
                    >
                    </v-col>
                    <v-col cols="8" class="py-1 font--text" v-else>
                      {{
                        $moment(detailSsl.lastRenewal).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )
                      }}</v-col
                    >
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card>
          </v-tab-item>
          <v-tab-item value="keys">
            <v-card flat class="rounded-lg pa-3">
              <v-card-text>
                <div class="d-flex flex-row" style="align-items: center">
                  <div class="headline font-weight-bold font--text">Keys</div>
                  <v-spacer />
                </div>
              </v-card-text>
              <v-card-text :class="{ animate: false }">
                <v-data-table
                  :class="{ hidden: false }"
                  :hide-default-footer="true"
                  :headers="headers"
                  :items="listKey"
                  :items-per-page="10"
                >
                  <template #[`item.lastmodified`]="{ item }">
                    {{
                      $moment(item.lastmodified).format("DD/MM/YYYY HH:mm:ss")
                    }}
                  </template>
                  <template #[`item.secretKey`]="{ item }">
                    <span>********</span>
                    <v-icon
                      small
                      class="mb-2 ml-2 secondary white--text py-1 px-2 rounded"
                      style="cursor: pointer"
                      @click="
                        () => {
                          showDialogReveal(item);
                        }
                      "
                      >mdi-eye</v-icon
                    >
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <dialogRenewal v-model="opendialogrenewal" @close="Renewal" />
    <dialogValidateRenewal
      :value="opendialogvalidaterenewal"
      :message="dialogvalidaterenewalMessage"
      @close="DialogValidateRenewal"
    />
    <dialogSecretKey
      :show.sync="closeDialog"
      :data-key="dataKey"
      :id="detailSsl.id"
    ></dialogSecretKey>
  </v-container>
</template>
<script>
import { ref, computed, onMounted, watch } from "@vue/composition-api";
import dialogRenewal from "./dialogRenewal";
import dialogValidateRenewal from "./dialogValidateRenewal";
import dialogSecretKey from "./dialogSecretKey.vue";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { AccessControl } from "@/lib/middleware";
export default {
  components: {
    dialogRenewal,
    dialogValidateRenewal,
    dialogSecretKey,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Deka SSL"));
    console.log("Deka SSl ", read_only);

    const router = context.root.$router;
    const sslName = ref("");
    const closeDialog = ref(false);
    const dataKey = ref({});
    const {
      detailSsl,
      isLoading,
      listKey,
      totalKey,
      isLoadingRenewal,
      renewalData,
    } = useNamespacedGetters("SSL", [
      "detailSsl",
      "listKey",
      "isLoading",
      "totalKey",
      "isLoadingRenewal",
      "renewalData",
    ]);
    const { getDetailSSL, downloadFile, getListSSLKey, forceGenerateSSL } =
      useNamespacedActions("SSL", [
        "getDetailSSL",
        "getListSSLKey",
        "downloadFile",
        "forceGenerateSSL",
      ]);
    const {
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
      "validateprivilagesync",
      "validateprivilagesyncnew",
    ]);
    const headers = [
      { text: "Filename", value: "fileName" },
      { text: "Secret Key", sortable: false, value: "secretKey" },
      { text: "Last Modified", value: "lastmodified" },
    ];
    const tab = ref(null);
    const tablastpath = computed(() => {
      return tab.value ? tab.value.split("/").pop() : "";
    });
    const sslStorage = JSON.parse(localStorage.getItem("loginSsl"));
    let params = {
      projectId: sslStorage.user.project_id,
      organizationId: sslStorage.user.organization_id,
      id: detailSsl.value.id,
    };
    console.log("detailSsl.isExternalSSL ", detailSsl.value.isExternalSSL);
    console.log("detail ssl ", detailSsl);
    onMounted(async () => {
      await getDetailSSL(router.currentRoute.params.id);
      await getListSSLKey(params);
    });
    watch(detailSsl, async (val) => {
      params.id = val.id;
    });

    function isItemRenewal(item) {
      return renewalData.value.includes(item);
    }

    async function download(filename) {
      await downloadFile({
        filename: filename,
        projectId: sslStorage.user.project_id,
        organizationId: sslStorage.user.organization_id,
        id: detailSsl.value.id,
      });
    }

    async function renewal(item) {
      const payload = {
        DomainName: item.fqdn,
        ProjectId: item.projectId,
        OrganizationId: item.organizationId,
      };
      await forceGenerateSSL(payload);
    }

    function getKeys() {
      getListSSLKey(params);
    }

    const showDialogReveal = (item) => {
      closeDialog.value = true;
      dataKey.value = item;
    };

    return {
      read_only,
      isLoading,
      detailSsl,
      sslName,
      tab,
      tablastpath,
      headers,
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      listKey,
      totalKey,
      download,
      isLoadingRenewal,
      renewal,
      getKeys,
      isItemRenewal,
      showDialogReveal,
      closeDialog,
      dataKey,
    };
  },
  data() {
    return {
      opendialogrenewal: false,
      opendialogvalidaterenewal: false,
      dialogvalidaterenewalMessage: "",
    };
  },
  methods: {
    Renewal(val) {
      this.opendialogrenewal = false;
      if (val) {
        this.renewal(this.detailSsl);
      }
    },
    DialogValidateRenewal(val) {
      this.opendialogvalidaterenewal = false;
    },
    validateRenewal(item) {
      const today = moment(Date.now());
      const createdAt = moment(item.createdAt);
      const lastRenewal = moment(item.lastRenewal);
      if (createdAt.isSame(lastRenewal)) {
        const expiredAt = moment(createdAt).add(3, "days");
        this.dialogvalidaterenewalMessage =
          "You cannot renew the SSL. Please wait for 3 days after the SSL created!";
        return today.isBefore(expiredAt);
      }
      if (
        moment(item.lastRenewal, "YYYY-MM-DD").isSame(
          today.format("YYYY-MM-DD"),
          "day"
        )
      ) {
        this.dialogvalidaterenewalMessage =
          "You are only allowed to renew the SSL once in a day!";
        return true;
      }
      // lastRenewal must after createdAt
      const expiredAt = moment(lastRenewal).add(3, "days");
      this.dialogvalidaterenewalMessage =
        "You cannot renew the SSL. Please wait for 3 days after the SSL last renewal";
      return today.isBefore(expiredAt);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .v-pagination.v-pagination {
  margin-bottom: 10px;
}

.page {
  border: 2px solid #d1d9e5;
  border-radius: 10px;
  height: 45px;
}

::v-deep .v-pagination {
  align-items: center;
  display: inline-flex;
  list-style-type: none;
  justify-content: space-between;
  margin: 0;
  max-width: 100%;
  width: 100%;
}

::v-deep .v-pagination__navigation {
  box-shadow: none;
  height: 30px;
}

::v-deep .v-pagination__item {
  box-shadow: none;
  height: 30px;
  font-size: 10px;
  margin: 0;
}

.fz ::v-deep .v-icon.v-icon {
  font-size: 12px;
}

.fz16 {
  font-size: 16px;
}

.lis {
  font-size: 12px;
  margin-left: 15px;
  font-weight: 500;
}

::v-deep .v-select__selections {
  margin-top: 5px !important;
}

::v-deep .v-pagination__more {
  display: none;
}

.tile:hover {
  background: #f6f6f6;
}

::v-deep
  .v-item-group.theme--light.v-slide-group.v-tabs-bar.v-tabs-bar--is-mobile.primary--text {
  display: grid;
}
</style>
