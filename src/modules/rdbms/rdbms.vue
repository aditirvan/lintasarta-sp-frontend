<template>
  <!-- <p>instance</p> -->
  <div>
    <!-- contoh template -->
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg elevation-0">
          <v-container fluid class="pa-0">
            <v-row>
              <v-col class="py-0">
                <div>
                  <iframe
                    v-if="urlRdbms"
                    :src="urlRdbms"
                    class="iframe-box"
                    frameborder="0"
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
import { ref, onMounted, defineComponent } from "@vue/composition-api";
import localstorage from "@/lib/localstorage";
import { useNamespacedActions } from "vuex-composition-helpers";
import { SUPERADMIN } from "../superadmin/namespace";

export default defineComponent({
  setup() {
    const { loginDns, loginDbaas, logoutDbaas, loginSsl } = useNamespacedActions(SUPERADMIN, ["loginDbaas", "logoutDbaas"]);
    // const { loginRDBMS } = useNamespacedActions("RDBMS", ["loginRDBMS"]);
    const urlRdbms = ref("");
    onMounted(() => {
      const userId = localStorage.getItem("userId");
      const currentProj = localStorage.getItem("currentProj");
      const username = localStorage.getItem("username");
      const curOrg = localStorage.getItem("currentOrg");
      if (username && curOrg && currentProj&& userId) {
        const currOrg = JSON.parse(curOrg);
        const currProj = JSON.parse(currentProj);
        const region = currProj.region.split("-")[0].toLowerCase();
        const data = {
          organizationID: currOrg.id,
          projectID: currProj.id,
          userID: JSON.parse(userId),
          username,
        };
        loginDbaas(data).then((res: any) => {
          const token = res.token;
          const id = res.uniqueID;

          switch (region) {
          case "tkp":
            urlRdbms.value = `${process.env.VUE_APP_API_BASE_URL_RDBMS_TKP}/api/auth/jwt-login?issuer=lintasarta&jwt=${token}&uniqueID=${id}`;
            break;
          case "tbs":
            urlRdbms.value = `${process.env.VUE_APP_API_BASE_URL_RDBMS_TBS}/api/auth/jwt-login?issuer=lintasarta&jwt=${token}&uniqueID=${id}`;
            break;
          case "jah":
            urlRdbms.value = `${process.env.VUE_APP_API_BASE_URL_RDBMS_JAH}/api/auth/jwt-login?issuer=lintasarta&jwt=${token}&uniqueID=${id}`;
            break;
          default:
            urlRdbms.value = `${process.env.VUE_APP_API_BASE_URL_RDBMS_TKP}/api/auth/jwt-login?issuer=lintasarta&jwt=${token}&uniqueID=${id}`;
            break;
        }

          return Promise.resolve();
        });
      }
    });
    const onLoad = () => {
      console.log(urlRdbms.value);
      console.log("onload");
    };
    return {
      urlRdbms,
      onLoad,
    };
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
