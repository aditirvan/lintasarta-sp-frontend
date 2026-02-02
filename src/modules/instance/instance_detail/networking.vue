<template>
  <v-container fluid>
    <v-row>
      <!-- <v-col class="pa-0">
                <v-card flat class="rounded-lg pa-3">
                    <v-card-text>
                        <div class="headline font-weight-bold font--text">Public Network</div>
                        </v-card-text>
                    <v-card-text>
                        <p>Anybody can access the VM via these public addresses</p>
                        <v-row>
                            <v-col class="pb-0"> -->
                                <!-- <p>
                                    <b>FLOATING IP</b>
                                </p>
                                <span v-if="instanceDetail.floating_ip">{{ instanceDetail.floating_ip ? instanceDetail.floating_ip.ip_address : null  }}</span> -->
      <!-- <span
                                    v-else
                                    tag="button"
                                    @click="openFloatingIPDialog = true"
                                    class="font-weight-bold"
                                    :disabled="!['ACTIVE', 'SHUTOFF'].includes(instanceDetail.state) || ![null, ''].includes(instanceDetail.revert_expired)"
                                    :class="{ 'linkpointer': ['ACTIVE', 'SHUTOFF'].includes(instanceDetail.state) || ![null, ''].includes(instanceDetail.revert_expired) }"
                                >Enable Now</span> -->
      <!-- <v-btn
                                    v-else
                                    depressed
                                    height="45"
                                    width="130"
                                    class="secondary align-self-center"
                                    tag="button"
                                    @click="openFloatingIPDialog = true"
                                    :disabled="!['ACTIVE', 'SHUTOFF'].includes(instanceDetail.state) || ![null, ''].includes(instanceDetail.revert_expired) || read_only"
                                >
                                    <span class="font-weight-bold" style="font-size: 12px">Enable Now</span>
                                </v-btn> -->
                            <!-- </v-col>
                            <v-col></v-col>
                            <v-col></v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col> -->
      <v-col cols="12" class="px-0 py-5">
        <v-card flat class="rounded-lg pa-3">
          <v-card-text>
            <div class="headline font-weight-bold font--text">Network</div>
          </v-card-text>
          <!-- <v-card-text class="pt-0">
                        <v-row>
                            <v-col>
                                <p>
                                    <b>PRIVATE IPV4 ADDRESS</b>
                                </p>
                                <p>
                                    {{ instanceDetail.ip_address_internal || '-' }} -->
          <!-- <span class="linkpointer">Copy</span> -->
          <!-- </p>
                            </v-col>
                            <v-col>
                                <p>
                                    <b>VPC GATEWAY</b>
                                </p>
                                <p>
                                    {{ instanceDetail.vpc ? instanceDetail.vpc.ip_gateway : '-' }} -->
          <!-- <span class="linkpointer">Copy</span> -->
          <!-- </p>
                            </v-col>
                            <v-col>
                                <p>
                                    <b>SUBNET MASK</b>
                                </p>
                                <p>
                                    {{ instanceDetail.vpc ? netmaskPrivate.mask : '-' }}  -->
          <!-- <span class="linkpointer">Copy</span> -->
          <!-- </p>
                                </v-col>
                            <v-col>
                            </v-col>                        
                        </v-row>
                    </v-card-text> -->
          <v-card-text>
            <v-data-table class="elevation-0 mb-30px" :hide-default-footer="true" :headers="headers" :items="instanceDetail.ins_vpc_port">
              <!-- Define v-slot for customizing columns -->
              <template v-slot:item.internal="{ item }">
                <span v-if="item.internal && item.internal.length">
                  <div v-for="ip in item.internal" :key="ip">{{ ip }}</div>
                </span>
                <span v-else>-</span>
              </template>

              <template v-slot:item.mac_address="{ item }">
                <span v-if="item.mac_address && item.mac_address.length">
                  <div v-for="ip in item.mac_address" :key="ip">{{ ip }}</div>
                </span>
                <span v-else>-</span>
              </template>

              <template v-slot:item.external="{ item }">
                <span v-if="item.external && item.external.length">
                  <div v-for="ip in item.external" :key="ip">{{ ip }}</div>
                </span>
                <span v-else>-</span>
              </template>

              <template v-slot:item.dns="{ item }">
                <v-col v-if="item.dns && item.dns.length">
                  <span
                    class="primary--text cursor-pointer"
                    @click="
                      () => {
                        openDialog = true;
                        dataDns = item.dns;
                      }
                    "
                  >
                  See all DNS
                  </span>
                </v-col>
                <v-col v-else>-</v-col>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <dialogFloatingIP v-if="openFloatingIPDialog" v-model="openFloatingIPDialog" :item="instanceDetail" :id-instance="idInstance" />
    <dialogDns :dialog-open.sync="openDialog" :data-dns="dataDns"></dialogDns>
  </v-container>
</template>
<script>
import { ref, reactive, onMounted } from "@vue/composition-api";
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
import Netmask from "netmask";
import dialogFloatingIP from "@/modules/instance/dialogFloatingIP";

import { AccessControl } from "@/lib/middleware";
import dialogDns from "./dialog-dns.vue";

export default {
  components: {
    dialogFloatingIP,
    dialogDns,
  },
  setup(props, context) {
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode("Project Network"));
    const { instanceDetail } = useNamespacedState("INSTANCE", ["instanceDetail"]);
    const netmaskPrivate = new Netmask.Netmask(`${instanceDetail.value.vpc.ip_prefix}/${instanceDetail.value.vpc.network_size}`);
    const idInstance = ref(instanceDetail.value.id);
    const openDialog = ref(false);
    const openFloatingIPDialog = ref(false);
    const dataDns = ref([]);
    const headers = ref([
      { text: "VPC", value: "vpc_name" },
      { text: "Type", value: "type" },
      { text: "Gateway", value: "ip_gateway" },
      { text: "Internal", value: "internal" },
      { text: "Mac Address", value: "mac_address" },
      { text: "External", value: "external" },
      { text: "DNS", value: "dns" },
    ]);

    return {
      read_only,
      instanceDetail,
      netmaskPrivate,
      idInstance,
      openDialog,
      openFloatingIPDialog,
      headers,
      dataDns,
    };
  },
};
</script>
<style scoped>
.headline {
  font-weight: 600;
  font-family: "Poppins", sans-serif;
}
</style>
