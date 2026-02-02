<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg elevation-0">
          <v-container fluid class="pa-2">
            <v-card
              v-if="quotalimitsI3gis == 0"
              flat
              outlined
              class="rounded-lg ma-3"
            >
              <v-row>
                <v-col>
                  <v-card
                    flat
                    class="d-flex rounded-lg flex-grow-1 flex-column text-center pa-6"
                  >
                    <v-card-text>
                      <p
                        style="font-size: 16px; text-transform: capitalize"
                        class="font-weight-bold"
                      >
                        Accelerate and protect your site with Cloudeka
                      </p>
                      <v-row>
                        <v-card-text>
                          Deka AST quota is empty. Custom your quota, then you
                          can create Deka AST for your project</v-card-text
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
            <v-row v-else>
              <v-col class="pa-2">
                <div>
                  <iframe
                    v-if="urlPath"
                    :src="urlPath"
                    class="iframe-box"
                    frameborder="0"
                    title="Deka AST iframe"
                    @load="frameLoaded"
                    id="sast-iframe"
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ref,
  onMounted,
  defineComponent,
  watch,
} from "@vue/composition-api";
import localstorage from "@/lib/localstorage";
import {
  useNamespacedGetters,
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { I3GIS } from "./namespace";

export default defineComponent({
  setup(props, context) {
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const { loginSAST, getquotalimitI3gis } = useNamespacedActions(I3GIS, [
      "loginSAST",
      "getquotalimitI3gis",
    ]);
    const { quotalimitsI3gis } = useNamespacedState("I3GIS", [
      "quotalimitsI3gis",
    ]);
    const urlPath = ref(null);
    const { getIsLogout } = useNamespacedGetters("I3GIS", ["getIsLogout"]);
    const isLogoutGetter = computed(() => getIsLogout);
    const urlDynamic = ref(null);

    const dinamicUrl = ref({
      // '/i3gis/home' : 'dashboard/home',
      "/deka-ast/summaryproject":
        "dashboard/application-security/summary-project/detail",
      "/deka-ast/sast": "dashboard/application-security/sast/overview",
      "/deka-ast/issuecode": "dashboard/application-security/sast/issues",
      "/deka-ast/measurescode":
        "dashboard/application-security/sast/measures-code",
      "/deka-ast/customrules":
        "dashboard/application-security/sast/custom-rules",
      "/deka-ast/securitydetector":
        "dashboard/application-security/sast/security-detector",
      "/deka-ast/sca":
        "dashboard/application-security/sca/result-vulnerability",
      "/deka-ast/scafilter":
        "dashboard/application-security/sca/filter-scan-vuln",
      "/deka-ast/secretcheck":
        "dashboard/application-security/secret-check/result-secret",
      "/deka-ast/misconf":
        "dashboard/application-security/misconfiguration-repository",
      "/deka-ast/scanvalidation":
        "dashboard/application-security/scan-validation",
      "/deka-ast/dast": "dashboard/dynamic-security/sites",
      "/deka-ast/scanhistory": "dashboard/dynamic-security/scan-history",
      "/deka-ast/reportappsec": "dashboard/report-security/tools/appsec-report",
      "/deka-ast/dynamicsecreport":
        "dashboard/report-security/tools/dynamicsec-report",
      "/deka-ast/auditlog": "dashboard/report-security/tools/audit-log",
      "/deka-ast/integration": "dashboard/configure/integration",
    });

    const frameLoaded = () => {
      const user = JSON.parse(localStorage.getItem("loginSast"));
      let iframe = document.querySelector("iframe");
      iframe.contentWindow.postMessage(
        {
          user: JSON.stringify(user),
          redirectUrl: `/${dinamicUrl.value[window.location.pathname]}`,
          action: "newSession",
        },
        "*"
      );
    };

    const clearFrame = () => {
      let iframe = document.querySelector("iframe");
      iframe.contentWindow.postMessage(
        { action: "clearSession" },
        urlPath.value
      );
    };

    watch(
      () => context.root.$route.path,
      (newVal) => {
        let key = Object.keys(dinamicUrl.value);
        key.forEach((x) => {
          if (newVal == x) {
            urlPath.value =
              process.env.VUE_APP_API_BASE_URL_I3GIS + dinamicUrl.value[x];
            // urlDynamic.value=dinamicUrl.value[window.location.pathname]
          }
        });
      }
    );

    watch(isLogoutGetter.value, (newVal, oldVal) => {
      if (newVal) {
        clearFrame();
      }
    });

    onMounted(async () => {
      // console.log(window.location.pathname)
      const projectId = localStorage.getItem("projectid");
      const userId = JSON.parse(localStorage.getItem("userId"));
      const curOrg = localStorage.getItem("currentOrg");
      const params = {
        organization_id: currentProj.organization_id,
        project_id: currentProj.id,
        user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
      };
      await getquotalimitI3gis(params);
      if (quotalimitsI3gis.value != 0) {
        if (userId && curOrg && projectId) {
          const currOrg = JSON.parse(curOrg);
          const data = {
            organization_id: currOrg.id,
            project_id: projectId,
            user_id: userId,
          };
          await loginSAST(data).then((res: any) => {
            localStorage.setItem("loginSast", JSON.stringify(res.data.data));
            urlPath.value =
              process.env.VUE_APP_API_BASE_URL_I3GIS +
              dinamicUrl.value[window.location.pathname];
            return Promise.resolve();
          });
        }
      }

      const handleMessage = async (event) => {
        if (event.data.action === "invalidSession") {
          const currOrg = JSON.parse(curOrg);
          const data = {
            organization_id: currOrg.id,
            project_id: projectId,
            user_id: userId,
          };
          await loginSAST(data).then((res: any) => {
            localStorage.setItem("loginSast", JSON.stringify(res.data.data));
            urlPath.value =
              process.env.VUE_APP_API_BASE_URL_I3GIS +
              dinamicUrl.value[window.location.pathname];
            frameLoaded();
            return Promise.resolve();
          });
        }
      };

      window.addEventListener("message", handleMessage);
    });

    return {
      urlPath,
      frameLoaded,
      isLogoutGetter,
      urlDynamic,
      quotalimitsI3gis,
    };
  },
  async beforeRouteLeave(to, from, next) {
    // console.log('beforeleave')
    let pathFrom = to.path.split("/");
    if (this.quotalimitsI3gis != 0) {
      if (pathFrom[1] != "deka-ast") {
        let iframe = document.querySelector("iframe");
        await iframe.contentWindow.postMessage(
          { action: "clearSession" },
          this.urlPath
        );
        localStorage.removeItem("loginSast");
        next();
      } else {
        next();
      }
    } else {
      next();
    }
  },
});
</script>

<style lang="scss" scoped>
[role="menu"] {
  margin-top: 12px;
}

.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}

.mdi-chevron-down::before {
  transition: 100ms linear all;
}

p {
  margin-bottom: 0px;

  .ipaddress {
    display: inline-block;
    width: 50px;
    position: relative;

    .tik {
      position: absolute;
      right: 10px;
      display: inline-block;
    }
  }
}

.select-view {
  border: 6px solid #f2f2f2;
  border-radius: 4px;
  background-color: #f2f2f2;
  opacity: 0.5;

  &.selected {
    opacity: 1;
  }
}

.instanceinfo {
  .col:first-child {
    p {
      font-weight: 700;
    }
  }

  .col {
    padding: 0px 0px 0px 12px;
    font-size: 10px;
  }
}

.v-list-item {
  min-height: 38px;
}

.v-list-item__title {
  font-weight: 600;

  label:hover {
    cursor: pointer;
  }
}

.animate {
  ::v-deep .v-data-table {
    visibility: hidden;
  }
}

.iframe-box {
  width: 100%;
  height: 1250px;
  overflow-y: hidden !important;
  margin-bottom: -12px !important;
}
</style>