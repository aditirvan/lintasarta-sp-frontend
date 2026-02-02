<template>
  <v-container class="pa-0" fluid>
    <div v-if="detailCDN">
      <v-row>
        <v-col>
          <v-card flat class="rounded-lg elevation-0 pa-3">
            <v-card-title class="d-flex flex-row justify-space-between pb-0">
              <div class="d-flex flex-row align-center">
                <div>
                  <v-icon :color="getColorStatus(detailCDN.deployed)" style="font-size: 50px">mdi-circle</v-icon>
                </div>
                <v-col class="py-0">
                  <h4>{{ detailCDN.domain }}</h4>
                </v-col>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-tabs v-model="tab">
                <v-tab to="overview" replace>Overview</v-tab>
                <v-tab v-if="!read_only" to="editor" replace>Editor</v-tab>
                <v-tab to="dashboard" replace>Dashboard</v-tab>
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
                  <div class="d-flex flex-row justify-space-between" style="align-items: center">
                    <div class="headline font-weight-bold font--text">
                      Overview
                    </div>
                    <!-- <v-spacer /> -->
                    <div v-if="!read_only">
                      <!-- <v-btn v-if="detailCDN.port == '443'" depressed append :disabled="isLoadingRenewalSSL"
                        class="secondary mr-5" width="160" height="45" @click="() => {
                          validateprivilages(['CDN', 'editor']).then(async () => {
                            opendialogFormRenewalSSL()
                          });
                        }">Renewal SSL</v-btn> -->
                      <v-btn depressed append
                             class="secondary mr-5" width="160" height="45" @click="() => {
                          validateprivilages(['CDN', 'editor']).then(async () => {
                            opendialogPurge()
                          });
                        }">Purge</v-btn>
                      <v-btn depressed append :disabled="isLoadingDeploy" class="secondary mr-5" width="160" height="45"
                        @click="() => {
                          validateprivilages(['CDN', 'editor']).then(async () => {
                            openDialogDeploy = true
                          });
                        }">Deploy</v-btn>
                      <!-- <v-btn depressed append class="secondary" width="160" height="45" @click="() => {
                        validateprivilages(['CDN', 'editor']).then(async () => {
                          opendialogFormEditTag()
                        });
                      }">Location Configuration</v-btn> -->
                    </div>
                  </div>
                </v-card-text>
                <v-row>
                  <v-col>
                    <v-card outlined>
                      <v-card-text>
                        <v-row>
                          <v-col cols="4" class="py-1 font--text font-weight-bold">IP</v-col>
                          <v-col cols="8" class="py-1 font--text">
                            {{ ipStr }}
                          </v-col>
                        </v-row>
                        <!-- <v-row>
                          <v-col cols="4" class="py-1 font--text font-weight-bold">Location</v-col>
                          <v-col cols="8" class="py-1 font--text">{{ detailCDN &&
                            detailCDN.tag ? detailCDN.tag.toUpperCase() : '' }}</v-col>
                        </v-row> -->
                        <v-row>
                          <v-col cols="4" class="py-1 font--text font-weight-bold">Status</v-col>
                          <v-col cols="8" class="py-1 font--text"
                            v-if="detailCDN.deployed !== undefined || detailCDN.compileErrorMessage !== undefined">
                            <v-chip color="detailCDN.deployed ? green : red" text-color="white">{{
                              detailCDN.deployed ? "Deployed" : "Undeployed"
                            }}</v-chip>
                            <v-chip v-if="detailCDN && detailCDN.compileErrorMessage" color="red" class="ml-1"
                              text-color="white">Compilation Error</v-chip>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="4" class="py-1 font--text font-weight-bold">Billing Type</v-col>
                          <v-col cols="8" class="py-1 font--text">{{ detailCDN.billing_type }}
                          </v-col>
                        </v-row>
                        <v-row v-if="detailCDN.ssl ">
                          <v-col cols="4" class="py-1 font--text font-weight-bold">SSL</v-col>
                          <v-col cols="8" class="py-1 font--text">{{ detailCDN.ssl }}
                            <v-chip v-if="(detailCDN && detailCDN.ssl_expiredAt) && detailCDN.ssl_expired_status" color="red" text-color="white">{{
                              "Expired"
                            }}</v-chip>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6" v-if="content">
                    <v-card outlined>
                      <v-card-text>
                        <v-row>
                          <v-col v-html="content">
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-tab-item>
            <v-tab-item value="editor">
              <v-card flat class="rounded-lg pa-3">
                <Editor :id="detailCDN.id" :name="detailCDN.domain"
                  :compileErrorMessage="detailCDN.compileErrorMessage" />
              </v-card>
            </v-tab-item>
            <v-tab-item value="dashboard">
              <Dashboard
              />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <formEditTag v-model="openFormEditTag" :tags.sync="propTag" :id="detailCDN.id" :name="detailCDN.domain"
        @close="editTags" />
      <formRenewalSSL v-model="openFormRenewalSSL" :existingSSL.sync="propSSL" :id="detailCDN.id" :name="detailCDN.domain"
        @close="renewalSSL" />
      <Confirmation
        v-if="openPurge"
        v-model="openPurge"
        :loading="purgeLoading"
        @confirm="purge"
        @close="closedialogPurge"
        title="Purge Cache"
        desc="Clear cache content from server to force updated versions to be pulled from the web server. This may temporarily degrade performance on your website."
      />
    </div>
    <dialogConfirmDeploy v-model="openDialogDeploy" @close="deploy" />
  </v-container>
</template>
<script>
import { ref, computed, onMounted } from "@vue/composition-api";
import dialogConfirmUpdate from "./dialogConfirmUpdateVCL.vue"
import dialogConfirmDeploy from "./dialogConfirmDeploy.vue"
import formEditTag from "./formEditTag.vue"
import formRenewalSSL from "./formRenewalSSL.vue"
import Confirmation from "@/modules/cdn/confirmation.vue";
import Editor from "./editor.vue"
import Dashboard from "./dashboard.vue"
import {
  useNamespacedActions,
  useNamespacedGetters,
  useState
} from "vuex-composition-helpers";

import { AccessControl } from "@/lib/middleware";

export default {
  components: { dialogConfirmUpdate, Editor, formEditTag, dialogConfirmDeploy, formRenewalSSL, Dashboard, Confirmation },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('CDN'));
    const router = context.root.$router;
    const {
      detailCDN,
      isLoading,
      isLoadingDeploy,
      isLoadingRenewalSSL,
      content
    } = useNamespacedGetters("CDN", [
      "detailCDN",
      "isLoading",
      "isLoadingDeploy",
      "isLoadingRenewalSSL",
      "content"
    ]);
    const { getDetailCDN, deployCDN, getContent, purgeCDN } =
      useNamespacedActions("CDN", [
        "getDetailCDN",
        "deployCDN",
        "purgeCDN",
        "getContent"
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
    const { topbarloading } = useState(["topbarloading"]);

    const tab = ref(null);
    const openFormEditTag = ref(false);
    const openPurge = ref(false);
    const purgeLoading = ref(false);
    const openFormRenewalSSL = ref(false);
    const openDialogDeploy = ref(false);


    const tablastpath = computed(() => {
      return tab.value ? tab.value.split("/").pop() : "";
    });
    const ipStr = computed(() => detailCDN.value.ip ? detailCDN.value.ip.join(", ") : "")
    const propTag = ref(null)
    const propSSL = ref(null)

    onMounted(async () => {
      await getDetailCDN(router.currentRoute.params.id);
      await getContent()
    });

    const editTags = async () => {
      openFormEditTag.value = false
    }

    const renewalSSL = async () => {
      openFormRenewalSSL.value = false
    }


    function getColorStatus(deployed) {
      if (deployed || deployed == undefined) return "primary";
      return "error"
    }

    const opendialogFormEditTag = async () => {
      propTag.value = detailCDN.value.tag
      openFormEditTag.value = true
    }

    const opendialogFormRenewalSSL = async () => {
      propSSL.value = detailCDN.value.ssl
      openFormRenewalSSL.value = true
    }

    const opendialogPurge = async () => {
      openPurge.value = true
    }

    const closedialogPurge = async () => {
      openPurge.value = false
    }

    const deploy = async (val) => {
      openDialogDeploy.value = false
      if (val) {
        topbarloading.value.start();
        await deployCDN({ id: detailCDN.value.id })
        topbarloading.value.done();
      }
    }

    const purge = async () => {
      openPurge.value = false
      purgeLoading.value = true
      await purgeCDN({ id: detailCDN.value.id })
      purgeLoading.value = false
    }

    return {
      read_only,
      isLoading,
      detailCDN,
      tab,
      ipStr,
      tablastpath,
      validateprivilages,
      validateprivilagesync,
      validateprivilagesyncnew,
      openFormEditTag,
      opendialogPurge,
      closedialogPurge,
      openPurge,
      purgeLoading,
      purge,
      openFormRenewalSSL,
      editTags,
      getColorStatus,
      opendialogFormEditTag,
      opendialogFormRenewalSSL,
      renewalSSL,
      propTag,
      propSSL,
      openDialogDeploy,
      isLoadingDeploy,
      isLoadingRenewalSSL,
      deploy,
      content,
    };
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

::v-deep .v-item-group.theme--light.v-slide-group.v-tabs-bar.v-tabs-bar--is-mobile.primary--text {
  display: grid;
}</style>