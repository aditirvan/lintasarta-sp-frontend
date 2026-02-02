<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4" v-if="loadingDetail">
            <v-card flat outlined class="rounded-lg">
              <div class="d-flex justify-center pa-10">
                <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
              </div>
            </v-card>
          </v-container>

          <v-container fluid class="px-7 py-4" v-else>
            <v-card flat outlined class="rounded-lg">
              <v-row
                ><v-col cols="12">
                  <v-card-text class="headline font-weight-bold font--text">Detail Item</v-card-text>
                  <v-divider></v-divider>
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col sm="12" md="6" class="pt-0 pb-0"
                        ><p class="mb-1">Name</p>
                        <span class="font-weight-bold font--text">{{ detailFlavor.name }}</span>
                      </v-col>
                      <v-col sm="12" md="6" class="pt-0 pb-0"
                        ><p class="mb-1">Product</p>
                        <span class="font-weight-bold font--text">{{ detailFlavor.description }}</span>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col sm="12" md="6" class="pt-0 pb-0"
                        ><p class="mb-1">Status</p>
                        <span class="font-weight-bold font--text">{{ detailFlavor.status == 1 ? "Active" : "Shutoff" }}</span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <br />
                  <br />
                  <br />
                  <br />
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col cols="6">
                        <v-btn depressed color="#a5b3bf" class="white--text" block height="50" to="/manage-pricing/flavor-type">
                          <span class="fz-16">Back</span>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { onMounted } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";

export default {
  setup(props, context) {
    const { getDetailFlavor } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["getDetailFlavor"]);
    const { detailFlavor, loadingDetail } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["detailFlavor", "loadingDetail"]);
    onMounted(() => {
      getDetailFlavor(context.root.$route.params.id);
    });

    return {
      detailFlavor,
      loadingDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .theme--light.v-input--is-disabled input,
.theme--light.v-input--is-disabled textarea {
  color: black;
}
::v-deep .theme--light.v-select .v-select__selection--disabled {
  color: black;
}
</style>
