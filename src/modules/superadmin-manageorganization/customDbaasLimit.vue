<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom DBaaS Limit
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
        <div class="headline font-weight-bold darkblue--text mt-6">
          Database
        </div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Datastore</p>
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
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { fetchDbaasLimit, updateDbaasLimit } = useNamespacedActions(
      "RDBMS",
      ["fetchDbaasLimit", "updateDbaasLimit", "loginRDBMS"]
    );
    const { loginDbaas } = useNamespacedActions(
      "SUPERADMIN",
      ["loginDbaas"]
    );

    const isLoading = ref(true);
    const databases = ref(0);

    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const organizationId = ref(currentOrg.id);
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const projectId = ref(currentProj.id);
    const paramsDbaas = {
      organizationId: organizationId.value,
      projectId: projectId.value,
      userId: localStorage.getItem("userId")?.replaceAll('"', ""),
      username: localStorage.getItem("username")
    }

    onMounted(() => {
      loginDbaas(paramsDbaas)
        .then(() => {
          fetchDbaasLimit(projectId.value)
            .then((res) => {
              console.log("res ", res);
              databases.value = res.data.limit;
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
        databases: { required, minValue: minValue(0) },
      },
      {
        databases,
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
        limit: parseInt(databases.value)
      };
      isLoading.value = true;
      updateDbaasLimit(payload)
        .then(() => {
          isLoading.value = false;
          showSuccessToast("Custom DBaaS Limit Updated!");
          context.root.$router.push(`/organization-detail/${organizationId.value}`);
        })
        .catch((err) => {
          if (err.response.data.responseMessage) {
            showErrorToast(err.response.data.responseMessage);
          } else {
            showErrorToast(err);
          }
          isLoading.value = false;
        });
    };

    return {
      $v,
      databases,
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
