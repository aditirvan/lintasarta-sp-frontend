<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4 darkblue--text">
        Custom Deka Harbor Limit
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
                <p class="font-weight-bold">Cluster ( {{ getLimitHarbor.used_master }} used )</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="master"
                  type="number"
                  :error-messages="
                    $v.master.$errors.length
                      ? $v.master.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Worker ( {{ getLimitHarbor.used_worker }} used )</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="worker"
                  type="number"
                  :error-messages="
                    $v.worker.$errors.length
                      ? $v.worker.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Load Balancer ( {{ getLimitHarbor.used_load_balancer }} used )</p>
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
import { HARBOR } from '@/modules/harbor/namespace';
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { currentProj, currentOrg } = useNamespacedState("SUPERADMIN", ["currentProj", "currentOrg"]);
    const { fetchLimitHarbor, saveLimitHarbor } = useNamespacedActions(HARBOR, ["fetchLimitHarbor", "saveLimitHarbor"]);
    const { getLimitHarbor } = useNamespacedGetters(HARBOR, ["getLimitHarbor"])
    const isLoading = ref(true);
    const master = ref(0);
    const worker = ref(0);
    const load_balancer = ref(0);

    const organizationId = ref(currentOrg.value.id);

    function getSettings(){
      fetchLimitHarbor({openstack_id: currentProj.value.openstack_project_id})
        .then((res) => {
          master.value = res.data.master;
          worker.value = res.data.worker;
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
        master: { 
          required, 
          $autoDirty: true,
          conditional :{
            $message: "Minimum cluster is 1",
            $validator: (val) => {
              if(val < 1){
                return false
              }else{
                return true
              }
            }
          },
        },
        worker: { 
          required, 
          $autoDirty: true,
          conditional :{
            $message: () => {
              return `Minimum worker is ${master.value*3} or more`
            },
            $validator: (val) => {
              if(val < master.value*3){
                return false
              }else{
                return true
              }
            }
          },
        },
        load_balancer: { 
          required, 
          $autoDirty: true,
          conditional :{
            $message: "Must be the same as it's cluster limit",
            $validator: (val) => {
              if(val != master.value){
                return false
              }else{
                return true
              }
            }
          },
        },
      },
      {
        master,worker,load_balancer
      }
    );

    const submit = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
          master: parseInt(master.value),
          worker: parseInt(worker.value),
          load_balancer: parseInt(load_balancer.value),
      };
      isLoading.value = true;
      const dataRes = await saveLimitHarbor({body:payload, openstack_id:currentProj.value.openstack_project_id})
      getSettings()
      isLoading.value = false;
      if (dataRes.data.status) {
        context.root.$router.push(`/organization-detail/${organizationId.value}`);
      }
    };

    return {
      $v,
      master,
      worker,
      load_balancer,
      submit,
      isLoading,
      organizationId,
      getLimitHarbor
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