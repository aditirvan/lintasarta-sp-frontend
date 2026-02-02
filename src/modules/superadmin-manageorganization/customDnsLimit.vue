<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom DNS Limit
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
        <div class="font-weight-bold darkblue--text">Site Limit ( {{ used }} used )</div>
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
        <div class="font-weight-bold darkblue--text">Record Limit ( {{ usedval }} used )</div>
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
import { DNS } from '@/modules/dns/namespace';
import {
  useNamespacedActions,
  useNamespacedGetters,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { currentOrg } = useNamespacedState("SUPERADMIN", ["currentOrg"]);
    const { fetchDnsLimit, saveLimitDns } = useNamespacedActions(DNS, ["fetchDnsLimit", "saveLimitDns"]);
    const { getLimitDns } = useNamespacedGetters(DNS, ["getLimitDns"])
    const isLoading = ref(true);
    const databases = ref(0);
    const used = ref(0);
    const val = ref(0);
    const usedval = ref(0);
    const organizationId = ref(currentOrg.value.id);

    function getSettings(){
      fetchDnsLimit()
        .then((res) => {
          databases.value = res.limit
          used.value = res.site

          val.value = res.limit_row
          usedval.value = res.row
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
      },
      {
        databases,
        val
      }
    );

    const submit = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
          limit: parseInt(databases.value),
          limit_row: parseInt(val.value),
      };
      console.log("payload : ");
      console.log(payload);
      isLoading.value = true;
      const dataRes = await saveLimitDns({body:payload})
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
      submit,
      isLoading,
      getLimitDns
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
