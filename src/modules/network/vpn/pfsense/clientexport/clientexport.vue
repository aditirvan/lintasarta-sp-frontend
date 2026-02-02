<template>
  <div>
    <v-card class="rounded-lg" flat>
      <v-row>
        <v-col>
          <div class="d-flex">
            <span class="page-title pb-2">Client Export</span>
          </div>
            <v-row>
              <v-col cols="8" md="7">
                <div class="d-flex buttonsizing">
                  <v-btn
                  width="150"
                  class="secondary fz-14 mr-2"
                  depressed
                  :loading="isLoadingBtnWds"
                  :disabled="isLoadingBtnWds || (getListOpenVpn[0] && getListOpenVpn[0].status == 'ON-PROGRESS')"
                  @click="downloadWindows"
                  >
                    Installer Windows
                    <v-icon
                    right
                    dark
                    >mdi-download</v-icon>
                  </v-btn>
                  <v-btn
                  width="150"
                  class="secondary fz-14 mr-2"
                  depressed
                  :loading="isLoadingBtnMac"
                  :disabled="isLoadingBtnMac || (getListOpenVpn[0] && getListOpenVpn[0].status == 'ON-PROGRESS')"
                  @click="downloadMacos"
                  >
                    Installer Mac OS
                    <v-icon
                    right
                    dark>mdi-download</v-icon>
                  </v-btn>
                  <v-btn
                  v-if="getTotalRowsOpenvpn != 0"
                  width="170"
                  class="secondary fz-14 mr-2"
                  depressed
                  :loading="isLoadingConfig"
                  :disabled="isLoadingConfig || (getListOpenVpn[0].status == 'ON-PROGRESS')"
                  @click="() => {
                    validateprivilages(['Network', 'editor', true]).then(() => {
                      downloadViscosityconfig()
                    });
                  }"
                  >
                    Viscosity Inline Config
                    <v-icon
                    right
                    dark>mdi-download</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { onMounted } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { VPN } from '../../namespace'

export default {
  setup() {
    const { downloadWindows, downloadMacos, downloadViscosityconfig, fetchOpenVpn } = 
    useNamespacedActions(VPN, ["downloadWindows", "downloadMacos", "downloadViscosityconfig", "fetchOpenVpn"])

    const { isLoadingBtnWds, isLoadingBtnMac, isLoadingConfig, getTotalRowsOpenvpn, getListOpenVpn } = 
    useNamespacedGetters(VPN, [ "isLoadingBtnWds", "isLoadingBtnMac", "isLoadingConfig", "getTotalRowsOpenvpn", "getListOpenVpn"])
    const {
      validateprivilages,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
    ]);

    let currentProj = JSON.parse(localStorage.getItem('currentProj'))
    let currentVpn = JSON.parse(localStorage.getItem('vpn'))

    onMounted(() => {
      // tesWs()
      // fetchOpenVpn({
      //   page: 1,
      //   itemsPerPage: 10,
      //   sortBy: [],
      //   sortDesc: [],
      //   projek: currentProj.openstack_project_id,
      //   instance_name: currentVpn.instance_name
      // })
    })

    return{
      downloadWindows,
      downloadMacos,
      isLoadingBtnWds,
      isLoadingBtnMac,
      isLoadingConfig,
      downloadViscosityconfig,
      getTotalRowsOpenvpn,
      validateprivilages,
      getListOpenVpn
    }
  },
}
</script>


<style scoped>
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}

@media only screen and (max-width: 600px) {
  .buttonsizing {
    flex-direction: column;
  }
  .v-btn{
    margin-bottom: 4px;
  }
}
</style>