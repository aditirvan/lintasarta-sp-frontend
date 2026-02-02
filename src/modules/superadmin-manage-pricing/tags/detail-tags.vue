<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="rounded-lg" flat>
          <v-container fluid class="px-7 py-4">
            <v-card flat outlined class="rounded-lg">
              <v-row
                ><v-col cols="12">
                  <v-card-text class="headline font-weight-bold font--text">Detail Tags</v-card-text>
                  <v-divider></v-divider>
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col sm="12" md="6" class="pt-0 pb-0"
                        ><p>Name</p>
                        <span class="font-weight-bold font--text">{{ detailTags.name }}</span>
                      </v-col>
                      <v-col sm="12" md="6" class="pt-0 pb-0"
                        ><p>Status</p>
                        <span class="font-weight-bold font--text">{{ detailTags.status == 1 ? "Active" : "Shutoff" }}</span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col sm="12" md="6" class="pt-0 pb-0"
                        ><p>Unit</p>
                        <span class="font-weight-bold font--text">{{ detailTags.unit }}</span>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <br />
                  <br />
                  <v-card-text class="pb-0">
                    <v-row>
                      <v-col cols="6">
                        <v-btn depressed color="#a5b3bf" class="white--text" block height="50" to="/manage-pricing/tags">
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
import { onMounted, ref, reactive } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { SUPERADMINMANAGEPRICING } from "../namespace";
import popupquote from "@/modules/customsharedcomponents/popupquote.vue";

export default {
  components: {
    popupquote,
  },
  setup(props, context) {
    const { getDetailTags } = useNamespacedActions(SUPERADMINMANAGEPRICING, ["getDetailTags"]);
    const { detailTags } = useNamespacedGetters(SUPERADMINMANAGEPRICING, ["detailTags"]);
    onMounted(() => {
      getDetailTags(context.root.$route.params.id);
    });

    return {
      detailTags,
    };
  },
};
</script>

<style lang="scss" scoped></style>
