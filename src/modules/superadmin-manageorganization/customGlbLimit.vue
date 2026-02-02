<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4 darkblue--text">
        Custom Global Load Balancer Limit
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
        <!-- <div class="headline font-weight-bold darkblue--text mt-6">
          Dekarock Cluster
        </div> -->
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Load Balancer ( {{ getLimitGlb.used_load_balancer }} used )</p>
                <v-text-field
                outlined
                  placeholder="0"
                  single-line
                  v-model="load_balancer"
                  type="number"
                  :error-messages="
                    $v.load_balancer.$errors.length
                      ? $v.load_balancer.$errors[0].$message
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
import { SLB } from '@/modules/network/slb/namespace';
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { currentProj, currentOrg } = useNamespacedState("SUPERADMIN", ["currentProj", "currentOrg"]);
    const { fetchLimitGlb, saveLimitGlb } = useNamespacedActions(SLB, ["fetchLimitGlb", "saveLimitGlb"]);
    const { getLimitGlb } = useNamespacedGetters(SLB, ["getLimitGlb"])
    const isLoading = ref(true);
    const load_balancer = ref(0);

    const organizationId = ref(currentOrg.value.id);

    function getSettings(){
      fetchLimitGlb({openstack_id: currentProj.value.openstack_project_id, tier: 'glb'})
        .then((res) => {
          load_balancer.value = res.data.load_balancer;
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
        load_balancer: { required, minValue: minValue(0) }
      },
      {
        load_balancer
      }
    );

    const submit = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        slb_limit: parseInt(load_balancer.value),
        tier: 'glb',
      };
      isLoading.value = true;
      await saveLimitGlb({body:payload, openstack_id:currentProj.value.openstack_project_id})
      getSettings()
      isLoading.value = false;
      context.root.$router.push(`/organization-detail/${organizationId.value}`);
    };

    return {
      $v,
      load_balancer,
      submit,
      isLoading,
      organizationId,
      getLimitGlb
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