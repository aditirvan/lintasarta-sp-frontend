<template>
  <v-card flat class="rounded-lg pa-5 mt-3">
    <v-container>
      <div class="headline font-weight-bold font--text mb-4 darkblue--text">
        Custom NFS Limit
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
                <p class="font-weight-bold">NFS ( {{ nfsLimit.limit.nfs_total_used }} used )</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="nfs"
                  type="number"
                  :error-messages="
                    $v.nfs.$errors.length
                      ? $v.nfs.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Client ( {{ nfsLimit.limit.nfs_client_total_used }} used )</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="client"
                  type="number"
                  :error-messages="
                    $v.client.$errors.length
                      ? $v.client.$errors[0].$message
                      : ''
                  "
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <p class="font-weight-bold">Size ( {{ nfsLimit.limit.nfs_size_total_used }} used )</p>
                <v-text-field
                  outlined
                  placeholder="0"
                  single-line
                  v-model="size"
                  type="number"
                  :error-messages="
                    $v.size.$errors.length
                      ? $v.size.$errors[0].$message
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
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import { NFS } from '../network-file-system/namespace';

export default {
  setup(props, { root }) {
    const { currentProj, currentOrg } = useNamespacedState("SUPERADMIN", ["currentProj", "currentOrg"]);
    const { getNFSLimit, updateNFSLimit } = useNamespacedActions(NFS, ["getNFSLimit", "updateNFSLimit"]);
    const { nfsLimit } = useNamespacedState(NFS, ["nfsLimit"]);

    const isLoading = ref(true);
    const nfs = ref(0);
    const client = ref(0);
    const size = ref(0);

    const organizationId = ref(currentOrg.value.id);

    function getSettings(){
      getNFSLimit(currentProj.value.id)
        .then((res) => {
          let resp = res.data.data
          nfs.value = resp.limit.nfs_total
          client.value = resp.limit.nfs_client_total
          size.value = resp.limit.nfs_size_total
          isLoading.value = false
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
        nfs: { required, minValue: minValue(0) },
        size: { required, minValue: minValue(0) },
        client: { required, minValue: minValue(0) },
      },
      {
        nfs,size,client
      }
    );

    const submit = async() => {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      const payload = {
        project_id: currentProj.value.id,
        body: {
          limit: {
            nfs_total: parseInt(nfs.value),
            nfs_size_total: parseInt(size.value),
            nfs_client_total: parseInt(client.value),
          }
        }
      };
      // console.log(payload)
      isLoading.value = true;
      const dataRes = await updateNFSLimit(payload)
      getSettings()
      isLoading.value = false;
      if (dataRes.status == 204) {
        root.$router.push(`/organization-detail/${organizationId.value}`);
      }
    };

    return {
      $v,
      nfs,
      size,
      client,
      submit,
      isLoading,
      organizationId,
      nfsLimit
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
