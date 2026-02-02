<template>
<div>
  <!-- <v-card class="rounded-lg pa-7" flat> -->
    <!-- <v-row>
      <v-col cols="12"> -->
        <v-card class="rounded-lg pa-7" flat>
          <!-- <v-container class="pa-7"> -->
            <v-row>
              <v-col class="pt-0">
                <div class="headline font-weight-bold font--text">
                  Service List
                </div>
              </v-col>
              <!-- <v-col class="pt-0">
                <h2>Restart Service List</h2>
              </v-col> -->
            </v-row>
            <br />

            <v-simple-table>
              <thead>
                <tr>
                  <th width="400px">Service</th>
                  <th width="400px">Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody style="font-weight: 600">
                <tr v-if="getListIpsec.length">
                  <td>
                    IPSec
                  </td>
                  <td>✅</td>
                  <td>
                    <v-btn fab
                      icon
                      color="green"
                    @click="() => {
                      validateprivilages(['Network', 'editor', true]).then(() => {
                        restartIPsec()
                      });
                    }">
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                    <!-- <span style="cursor: pointer" class="primary--text" @click="() => {
                      validateprivilages(['Network', 'editor', true]).then(() => {
                        restartIPsec()
                      });
                    }">Restart Service</span> -->
                    <!-- <span class="pl-3 error--text pr-3">Stop Service</span> -->
                    <v-btn fab
                      icon
                      color="red"
                      @click="() => {
                      validateprivilages(['Network', 'editor', true]).then(() => {
                        stopServiceIpsec()
                      });
                    }">
                      <v-icon>mdi-stop-circle-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="getListOpenVpn.length">
                  <td>
                    OpenVPN
                  </td>
                  <td>✅</td>
                  <td>
                    <v-btn fab
                      icon
                      color="green"
                    @click="() => {
                      validateprivilages(['Network', 'editor', true]).then(() => {
                        restartOpenvpn()
                      });
                    }">
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                    <!-- <span style="cursor: pointer" class="primary--text" @click="() => {
                      validateprivilages(['Network', 'editor', true]).then(() => {
                        restartOpenvpn()
                      });
                    }">Restart Service</span> -->
                    <!-- <span class="pl-3 error--text pr-3">Stop Service</span> -->
                    <v-btn fab
                      icon
                      color="red"
                      @click="() => {
                      validateprivilages(['Network', 'editor', true]).then(() => {
                        stopServiceOpenvpn()
                      });
                    }">
                      <v-icon>mdi-stop-circle-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
                <tr v-if="!getListIpsec.length && !getListOpenVpn.length">
                  <td
                    style="
                      width: 100%;
                      padding: 2rem 1.25rem !important;
                      text-align: center;"
                    colspan="3">
                    Looks like you don’t have any OpenVPN and IPsec
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          <!-- </v-container> -->
        </v-card>
      <!-- </v-col>
    </v-row> -->
  <!-- </v-card> -->
</div>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api'
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers'
import { VPN } from '../../namespace'

export default {
  setup() {
    const { restartIPsec, restartOpenvpn, stopServiceIpsec, stopServiceOpenvpn, fetchIpsec,fetchOpenVpn } = 
    useNamespacedActions(VPN, ["restartIPsec", "restartOpenvpn", "stopServiceIpsec", "stopServiceOpenvpn", "fetchIpsec","fetchOpenVpn"])

    const { getListIpsec, getListOpenVpn, isLoading } = 
    useNamespacedGetters(VPN, ["getListIpsec", "getListOpenVpn", "isLoading"])

    const {
      validateprivilages,
    } = useNamespacedActions("HOMEPAGE", [
      "validateprivilages",
    ]);

    let currentProj = JSON.parse(localStorage.getItem('currentProj'))
    let currentVpn = JSON.parse(localStorage.getItem('vpn'))
    const vpnVal = ref([])
    const load = ref(false)
    onMounted(async() => {
      load.value = true
      vpnVal.value = currentVpn
      await fetchIpsec({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        projek: currentProj.openstack_project_id,
        instance_name: currentVpn.instance_name

      })
      await fetchOpenVpn({
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        projek: currentProj.openstack_project_id,
        instance_name: currentVpn.instance_name
      })
      load.value = false
    })

    return{
      isLoading,
      restartIPsec,
      restartOpenvpn,
      stopServiceIpsec,
      stopServiceOpenvpn,
      validateprivilages,
      getListOpenVpn,
      getListIpsec,
      load,
      vpnVal
    }
  },
}
</script>



<style lang="scss" scoped>
.v-btn {
  height: 25px !important;
}
.v-btn--fab.v-size--default {
  width: 25px !important;
}
.page-title {
  font-style: normal;
  font-weight: bold;
  font-size: 21px;
  line-height: 140%;
  color: #556272;
}
.head{
  p:first-child{
    font-weight: 700;
  }
}
.mdi-chevron-down.rotate::before {
  transform: rotate(-180deg);
  transition: 100ms linear all;
}
.mdi-chevron-down::before {
  transition: 100ms linear all;
}
</style>
