<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 pt-0">
            <br />
            <v-row
              ><v-col md="3"
                ><v-btn
                  block
                  color="secondary"
                  dark
                  v-if="!read_only"
                  @click="
                    () => {
                      openGuest = true;
                    }
                  "
                  >Edit</v-btn
                ></v-col
              ></v-row
            >
            <v-card class="rounded-lg mt-4 mb-4" flat>
              <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                  <v-expansion-panel-header color="#f1f2f2">General</v-expansion-panel-header>
                  <div :style="hide == true ? '' : 'display: none'">
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Enable guest customization </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.GuestCustomizationSection.Enabled == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Change SID </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.GuestCustomizationSection.ChangeSid == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>

            <v-card class="rounded-lg mt-4 mb-4" flat>
              <v-expansion-panels v-model="panel1">
                <v-expansion-panel>
                  <v-expansion-panel-header color="#f1f2f2">Password Reset</v-expansion-panel-header>
                  <div :style="hide1 == true ? '' : 'display: none'">
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Allow local administrator password </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.GuestCustomizationSection.AdminPasswordEnabled == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Require Administrator to change password on first login </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.GuestCustomizationSection.ResetPasswordRequired == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Auto generate password </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.GuestCustomizationSection.AdminPasswordAuto == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Number of times to log on automatically </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content> {{ detailVm.GuestCustomizationSection.AdminAutoLogonCount }} </v-expansion-panel-content></v-col
                      >
                    </v-row>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>

            <v-card class="rounded-lg mt-4 mb-4" flat>
              <v-expansion-panels v-model="panel2">
                <v-expansion-panel>
                  <v-expansion-panel-header color="#f1f2f2">Join Domain</v-expansion-panel-header>
                  <div :style="hide2 == true ? '' : 'display: none'">
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Enable this VM join a domain </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.GuestCustomizationSection.JoinDomainEnabled == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                    <v-divider></v-divider>
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Override organization's domain </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.GuestCustomizationSection.UseOrgSettings == false ? "Disabled" : "Enabled" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>

            <v-card class="rounded-lg mt-4 mb-4" flat>
              <v-expansion-panels v-model="panel3">
                <v-expansion-panel>
                  <v-expansion-panel-header color="#f1f2f2">Script</v-expansion-panel-header>
                  <div :style="hide3 == true ? '' : 'display: none'">
                    <v-row class="ma-0">
                      <v-col md="6"><v-expansion-panel-content> Script file </v-expansion-panel-content></v-col
                      ><v-col md="6"
                        ><v-expansion-panel-content>
                          {{ detailVm.GuestCustomizationSection.CustomizationScript || "-" }}
                        </v-expansion-panel-content></v-col
                      >
                    </v-row>
                  </div>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <DialogEditGuest :open-guest.sync="openGuest"></DialogEditGuest>
  </div>
</template>

<script>
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { ref, computed } from "@vue/composition-api";
import { VDC } from "../namespace";
import DialogEditGuest from "../dialog/dialog-edit-guest.vue";
import { AccessControl } from "@/lib/middleware";

export default {
  components: {
    DialogEditGuest,
  },
  setup(props, context) {
    const { detailVm } = useNamespacedGetters(VDC, ["detailVm"]);
    const panel = ref(0);
    const panel1 = ref(0);
    const panel2 = ref(0);
    const panel3 = ref(0);
    const access_control = new AccessControl(context.root.$store);
    const read_only = ref(access_control.is_read_mode('Instance'));
    const hide = computed(() => {
      return Number.isInteger(panel.value);
    });
    const hide1 = computed(() => {
      return Number.isInteger(panel1.value);
    });
    const hide2 = computed(() => {
      return Number.isInteger(panel2.value);
    });
    const hide3 = computed(() => {
      return Number.isInteger(panel2.value);
    });
    const openGuest = ref(false);
    return {
      detailVm,
      panel,
      panel1,
      hide,
      hide1,
      panel2,
      hide2,
      panel3,
      hide3,
      openGuest,
      read_only,
    };
  },
};
</script>

<style lang="scss" scoped></style>
