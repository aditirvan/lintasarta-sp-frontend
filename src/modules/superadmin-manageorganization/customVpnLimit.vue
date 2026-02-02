<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom VPN Limit
      </div>
      
      <v-card class="rounded-lg" flat v-if="isLoading">
        <v-card-text class="d-flex justify-center">
          <v-progress-circular
            style="margin: auto"
            :size="200"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-card-text>
      </v-card>
      <div v-else>
        <div class="font-weight-bold darkblue--text">VPN Limit ( {{ used }} used )</div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="databases"
                  type="number"
                  :error-messages="
                    $v.databases.$errors.length
                      ? $v.databases.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <br />
        <div class="font-weight-bold darkblue--text">OpenVPN User Limit ( {{ usedval }} used )</div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="val"
                  type="number"
                  :error-messages="
                    $v.val.$errors.length
                      ? $v.val.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <br />
        <div class="font-weight-bold darkblue--text">IPSec Phase 2 Limit ( {{ usedvalIpsec }} used )</div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="valIpsec"
                  type="number"
                  :error-messages="
                    $v.valIpsec.$errors.length
                      ? $v.valIpsec.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              height="58"
              depressed
              block
              color="accent"
              :to="`/organization-detail/${organizationId}`"
              exact
            >
              <span style="font-size: 16px"> Cancel</span>
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              height="58"
              depressed
              block
              color="secondary"
              @click="submit"
            >
              <span style="font-size: 16px"> Submit</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>

    </v-container>
  </v-card>
</template>


<script>
import { ref, onMounted, watch } from "@vue/composition-api";
import useVuelidate from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
import { VPN } from '@/modules/network/vpn/namespace';
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { currentOrg } = useNamespacedState("SUPERADMIN", ["currentOrg"]);
    const { fetchVpnLimit, saveLimitVpn } = useNamespacedActions(VPN, ["fetchVpnLimit", "saveLimitVpn"]);
    const { getLimitVpn } = useNamespacedGetters(VPN, ["getLimitVpn"])
    const isLoading = ref(true);
    const databases = ref(0);
    const used = ref(0);
    const val = ref(0);
    const usedval = ref(0);
    const valIpsec = ref(0);
    const usedvalIpsec = ref(0);
    const organizationId = ref(currentOrg.value.id);

    function getSettings(){
      fetchVpnLimit()
        .then((res) => {
          databases.value = res.limit
          used.value = res.vpn

          val.value = res.limit_ovpn
          usedval.value = res.usr_ovpn

          valIpsec.value = res.limit_ipsec_phase2
          usedvalIpsec.value = res.ipsec_phase2
          isLoading.value = false;
        })
        .catch(() => {
          isLoading.value = false;
        })
    }

    onMounted(() => {
      getSettings()
    });

    const $v = useVuelidate(
      {
        databases: { required, minValue: minValue(0) },
        val: { required, minValue: minValue(0) },
        valIpsec: { required, minValue: minValue(0) },
      },
      {
        databases,
        valIpsec,
        val
      }
    );

    const submit = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
          limit: parseInt(databases.value),
          limit_usr_ovpn: parseInt(val.value),
          limit_ipsec: parseInt(valIpsec.value),
      };
      console.log("payload : ");
      console.log(payload);
      isLoading.value = true;
      const dataRes = await saveLimitVpn({body:payload})
      getSettings()
      isLoading.value = false;
      if (dataRes.data.status) {
        context.root.$router.push(`/organization-detail/${organizationId.value}`);
      }
    };
    
    return {
      $v,
      organizationId,
      databases,
      used,
      val,
      usedval,
      valIpsec,
      usedvalIpsec,
      submit,
      isLoading,
      getLimitVpn
    };
  },
};
</script>
 

<style lang="scss" scoped>
.hideinput {
  ::v-deep input {
    position: relative;
    bottom: 50px;
    z-index: -4;
  }
}
.btn-delete-flavor {
  font-size: 14px;
  height: 50px !important;
}
</style>
