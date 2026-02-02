<template>
  <div>
    <!-- <v-card flat outlined class="rounded-lg mt-4">
      <v-row class="mr-0 ml-0">
        <v-col cols="8"
          ><h4 class="ml-6">Custom Nameservers</h4>
          <br />
          <div class="ml-6">
            Custom nameservers allow you to create your own, unique nameservers
            in place of you assigned Cloudeka nameservers. To switch to using
            custom nameservers. first create them here, then add them as glue
            records at your register
          </div>
        </v-col>
        <v-col cols="4" class="border-custom center"
          ><div>
            <v-btn color="primary">Upgrade to Business</v-btn>
          </div></v-col
        >
      </v-row>
      <v-divider></v-divider>
      <v-row justify="center" class="mr-0 ml-0 d-flex justify-end">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header expand-icon="mdi-menu-down"
              ><p class="mb-0 text-right">Help</p></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <h4>What is a custom nameservers ?</h4>
              <br />
              <div>
                Cloudeka enables you to use nameservers which reflect your own
                domain You can use them in place of you Cloudeka assigned
                nameservers
              </div>
              <br />
              <div>
                <span>Custom nameservers here the following limitation</span
                ><br />
                <ul class="ml-4 mt-4">
                  <li>You must have between and five custom nameservers</li>
                  <li>
                    The custom nameservers can only be created at subdomains of
                    cloudeka.com
                  </li>
                  <li>
                    When custom nameservers are created glue record need to be
                    created at your register with the IP addresses of your
                    custom nameservers failure to do can cause all DNS lookups
                    for you site to fail. Further information can be found here
                  </li>
                </ul>
              </div>
              <br />
              <div>
                <strong>Note: </strong> Your assigned Cloudeka nameservers will
                continue to work even after custom nameservers are enabled
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card> -->

    <!-- <v-card flat outlined class="rounded-lg mt-4">
      <v-row class="mr-0 ml-0">
        <v-col cols="8"
          ><h4 class="ml-6">DNSSEC</h4>
          <br />
          <div class="ml-6">
            DNSSEC protects againts forged DNS answers. DNSSEC protected zones
            area cryptographically signed to ensure the DNS records received are
            identical to the DNS records published by the domain owner.
          </div>
          <br />
          <div class="ml-6">
            <div class="ml-2">
              <v-icon>mdi-clock-time-three-outline</v-icon>
              DNSSEC is pending while we wait for the DS to be added to your
              register. This usually takes ten minutes, but can take up to an
              hour
            </div>
          </div>
        </v-col>
        <v-col cols="4" class="border-custom center"
          ><div>
            <v-btn :color="detailDns.IsCustomNs == true ? 'success' : 'primary' ">Cancel Setup</v-btn>
          </div></v-col
        >
      </v-row>
      <v-divider></v-divider>
      <v-row justify="center" class="mr-0 ml-0 d-flex justify-end">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header expand-icon="mdi-menu-down"
              ><p class="mb-0 text-right">Help</p></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <h4>What is a custom nameservers ?</h4>
              <br />
              <div>
                Cloudeka enables you to use nameservers which reflect your own
                domain You can use them in place of you Cloudeka assigned
                nameservers
              </div>
              <br />
              <div>
                <span>Custom nameservers here the following limitation</span
                ><br />
                <ul class="ml-4 mt-4">
                  <li>You must have between and five custom nameservers</li>
                  <li>
                    The custom nameservers can only be created at subdomains of
                    cloudeka.com
                  </li>
                  <li>
                    When custom nameservers are created glue record need to be
                    created at your register with the IP addresses of your
                    custom nameservers failure to do can cause all DNS lookups
                    for you site to fail. Further information can be found here
                  </li>
                </ul>
              </div>
              <br />
              <div>
                <strong>Note: </strong> Your assigned Cloudeka nameservers will
                continue to work even after custom nameservers are enabled
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card> -->

    <v-card flat outlined class="rounded-lg mt-4">
      <v-row class="mr-0 ml-0">
        <v-col cols="8"
          ><h4 class="ml-6">Custom Nameservers</h4>
          <br />
          <div class="ml-6">
            Custom nameservers allow you to create your own, unique nameservers
            in place of you assigned Cloudeka nameservers. To switch to using
            custom nameservers. first create them here, then add them as glue
            records at your register
          </div>
        </v-col>
        <v-col cols="4" class="border-custom center"
          ><div>
            <v-btn
              :disabled="read_only"
              :color="detailDns.is_custom_ns == true ? 'success' : 'primary'"
              @click="
                if(read_only){
                  return
                }
                detailDns.is_custom_ns == true ? cancelNameserver() : openDialog()
              "
              >{{
                detailDns.is_custom_ns == true
                  ? "Cancel Custom Nameservers"
                  : "Add Custom Nameservers"
              }}</v-btn
            >
          </div></v-col
        >
      </v-row>
      <v-divider></v-divider>
      <v-row justify="center" class="mr-0 ml-0 d-flex justify-end">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header expand-icon="mdi-menu-down"
              ><p class="mb-0 text-right">Help</p></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <h4>What is a custom nameservers ?</h4>
              <br />
              <div>
                Cloudeka enables you to use nameservers which reflect your own
                domain You can use them in place of you Cloudeka assigned
                nameservers
              </div>
              <br />
              <div>
                <span>Custom nameservers here the following limitation</span
                ><br />
                <ul class="ml-4 mt-4">
                  <li>You must have between and five custom nameservers</li>
                  <li>
                    The custom nameservers can only be created at subdomains of
                    cloudeka.com
                  </li>
                  <li>
                    When custom nameservers are created glue record need to be
                    created at your register with the IP addresses of your
                    custom nameservers failure to do can cause all DNS lookups
                    for you site to fail. Further information can be found here
                  </li>
                </ul>
              </div>
              <br />
              <div>
                <strong>Note: </strong> Your assigned Cloudeka nameservers will
                continue to work even after custom nameservers are enabled
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card>

    <!-- <v-card flat outlined class="rounded-lg mt-4">
      <v-row class="mr-0 ml-0">
        <v-col cols="8"
          ><h4 class="ml-6">DNSSEC</h4>
          <br />
          <div class="ml-6">
            DNSSEC protects againts forged DNS answers. DNSSEC protected zones
            area cryptographically signed to ensure the DNS records received are
            identical to the DNS records published by the domain owner.
          </div>
        </v-col>
        <v-col cols="4" class="border-custom center"
          ><div>
            <v-btn color="primary" @click="showDialog()">Enable DNSSEC</v-btn>
          </div></v-col
        >
      </v-row>
      <v-divider></v-divider>
      <v-row justify="center" class="mr-0 ml-0 d-flex justify-end">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header expand-icon="mdi-menu-down"
              ><p class="mb-0 text-right">Help</p></v-expansion-panel-header
            >
            <v-expansion-panel-content>
              <h4>What is a custom nameservers ?</h4>
              <br />
              <div>
                Cloudeka enables you to use nameservers which reflect your own
                domain You can use them in place of you Cloudeka assigned
                nameservers
              </div>
              <br />
              <div>
                <span>Custom nameservers here the following limitation</span
                ><br />
                <ul class="ml-4 mt-4">
                  <li>You must have between and five custom nameservers</li>
                  <li>
                    The custom nameservers can only be created at subdomains of
                    cloudeka.com
                  </li>
                  <li>
                    When custom nameservers are created glue record need to be
                    created at your register with the IP addresses of your
                    custom nameservers failure to do can cause all DNS lookups
                    for you site to fail. Further information can be found here
                  </li>
                </ul>
              </div>
              <br />
              <div>
                <strong>Note: </strong> Your assigned Cloudeka nameservers will
                continue to work even after custom nameservers are enabled
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-card> -->
    <dialogNameserver :show.sync="close"></dialogNameserver>
    <!-- <dialogDnssec :show-dialog.sync="hideDialog"></dialogDnssec> -->
    <dialogCancelNameserver
      :cancel.sync="cancelDialog"
    ></dialogCancelNameserver>
  </div>
</template>

<script>
import { ref, reactive, defineComponent, computed } from "@vue/composition-api";
import dialogNameserver from "./dialog/dialogNameserver.vue";
import dialogDnssec from "./dialog/dialogDnssec.vue";
import dialogCancelNameserver from "./dialog/dialog-cancel-nameservers.vue";
import {
  useNamespacedGetters,
  useNamespacedActions,
} from "vuex-composition-helpers";
// import { DNS } from "../namespace";
import { AccessControl } from "@/lib/middleware";
export default defineComponent({
  components: {
    dialogNameserver,
    dialogDnssec,
    dialogCancelNameserver,
  },
  setup(props, { emit, root }) {
    const access_control = new AccessControl(root.$store);
    const read_only = ref(access_control.is_read_mode('DNS'));
    const { detailDns } = useNamespacedGetters("DNS", ["detailDns"]);
    const hideDialog = ref(false);
    const close = ref(false);
    const cancelDialog = ref(false);
    function showDialog() {
      hideDialog.value = true;
    }
    function openDialog() {
      close.value = true;
    }
    function cancelNameserver() {
      cancelDialog.value = true;
    }
    return {
      read_only,
      hideDialog,
      close,
      detailDns,
      cancelDialog,
      showDialog,
      openDialog,
      cancelNameserver,
    };
  },
});
</script>

<style lang="scss" scoped>
.border-custom {
  background-color: #ebebeb;
  border-left-style: solid;
  border-left-width: thin;
  border-left-color: gainsboro;
  border-bottom-right-radius: inherit;
  border-top-right-radius: inherit;
}

.center {
  display: grid;
  justify-content: center;
  align-items: center;
}

.add-btn {
  display: grid;
  justify-content: normal;
}

.btn-switch {
  text-align: center;
  display: grid;
  justify-content: center;
}
::v-deep .v-text-field__details {
  position: static;
}
</style>