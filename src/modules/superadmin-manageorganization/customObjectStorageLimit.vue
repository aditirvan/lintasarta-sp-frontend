<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4">
        Custom Deka Box Limit
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
        <v-divider />
        <div class="headline font-weight-bold darkblue--text mt-6">
          Deka Box
        </div>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Deka Box</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="object_storage_total"
                  type="number"
                  :error-messages="
                    $v.object_storage_total.$errors.length
                      ? $v.object_storage_total.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
              <v-col>
                <p class="font-weight-bold">Deka Box Size</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="object_storage"
                  suffix="GB"
                  type="number"
                  :error-messages="
                    $v.object_storage.$errors.length
                      ? $v.object_storage.$errors[0].$message
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
import { required, minValue, helpers} from "@vuelidate/validators";
import moment from "moment";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
export default {
  setup(props, context) {
    const { getObjectStorageLimit, updateObjectStorageLimit } = useNamespacedActions(
      "LIMITSERVICE",
      ["getObjectStorageLimit", "updateObjectStorageLimit"]
    );
    const isLoading = ref(true);
    const object_storage = ref(0);
    const object_storage_total = ref(0);

    const currentOrg = JSON.parse(localStorage.getItem("currentOrg"));
    const organizationId = ref(currentOrg.id);
    const currentProj = JSON.parse(localStorage.getItem("currentProj"));
    const projectId = ref(currentProj.id);
    onMounted(async() => {
      await getObjectStorageLimit(projectId.value)
        .then(({ data: { data } }) => {
          console.log(data);
          object_storage.value = data.object_storage.object_storage.limit;
          object_storage_total.value = data.object_storage.object_storage_total.limit;
          isLoading.value = false;
        })
        .catch(() => {
          isLoading.value = false;
        });
    });

    const $v = useVuelidate(
      {
        object_storage: { required, minValue: minValue(0)},
        object_storage_total: { required, minValue: minValue(0)},
      },
      {
        object_storage,
        object_storage_total,
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
        id: projectId.value,
        data: {
          object_storage: {
            object_storage: parseInt(object_storage.value),
            object_storage_total: parseInt(object_storage_total.value),
          },
        },
      };
      isLoading.value = true;
      updateObjectStorageLimit(payload)
        .then(() => {
          isLoading.value = false;
          showSuccessToast("Custom Deka Box limit has succesfully updated!");
        })
        .catch((err) => {
          showErrorToast(err.response.data.data);
          isLoading.value = false;
        });
    };

    return {
      $v,
      object_storage,
      object_storage_total,
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
