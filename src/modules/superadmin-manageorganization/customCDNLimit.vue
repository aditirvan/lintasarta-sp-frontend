<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom CDN Limit
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
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">CDN</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="cdn"
                  type="number"
                  :error-messages="
                    $v.cdn.$errors.length
                      ? $v.cdn.$errors[0].$message
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
import { required, minValue, helpers } from "@vuelidate/validators";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { getCDNLimit, setCDNLimit } = useNamespacedActions(
      "CDN",
      ["getCDNLimit", "setCDNLimit", "cdnLimit"]
    );
    const { loginSsl } = useNamespacedActions(
      "SUPERADMIN",
      ["loginSsl"]
    );

    const isLoading = ref(true);
    const cdn = ref(0);
    const handleCdn = ref(0);

    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const organizationId = ref(currentOrg.id);
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const projectId = ref(currentProj.id);
    const paramsLogin = {
      organization_id: organizationId.value,
      project_id: projectId.value,
      user_id: localStorage.getItem("userId")?.replaceAll('"', ""),
    }

    onMounted(() => {
      loginSsl(paramsLogin)
        .then(() => {
          getCDNLimit(projectId.value)
            .then(({data:{data}}) => {
              cdn.value = data.limit;
              if(data.limit == data.used){
                handleCdn.value = data.limit
              }else{
                handleCdn.value = data.used
              }
              isLoading.value = false;
            })
            .catch(() => {
              isLoading.value = false;
            });
        })
        .catch(() => {
          isLoading.value = false;
        })
    });

    const $v = useVuelidate(
      {
        cdn: { $autoDirty: true, required, maxWeight: helpers.withMessage(
            "Value must be greater than existing value",
            val => { 
              let valid = true
              if(parseInt(val) < parseInt(handleCdn.value)){
                valid = false
              } 
              return valid
            }
          )},
      },
      {
        cdn,
      }
    );

    const { showErrorToast, showSuccessToast } = useNamespacedActions(
      "HOMEPAGE",
      ["showErrorToast", "showSuccessToast"]
    );

    const submit = () => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        projectId: projectId.value,
        limit: parseInt(cdn.value)
      };
      isLoading.value = true;
      setCDNLimit(payload)
        .then(() => {
          isLoading.value = false;
          showSuccessToast("Custom CDN has successfully updated!");
          context.root.$router.push(`/organization-detail/${organizationId.value}`);
        })
        .catch((err) => {
          showErrorToast("Failed to update CDN Limit, Please try again");
          isLoading.value = false;
        });
    };

    return {
      $v,
      cdn,
      submit,
      isLoading,
      organizationId,
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
