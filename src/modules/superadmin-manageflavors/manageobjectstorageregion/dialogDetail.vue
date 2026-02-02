<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Region Detail</div>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="titletext">Name
        </p>
        <v-text-field
          v-model="name"
          disabled
          flat
          outlined
        ></v-text-field>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="12" class="pt-0">
            <p class="titletext">Volume Limit (GB)
            </p>
            <v-text-field
              maxlength="100"
              v-model="volumeLimit"
              disabled
              flat
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pt-0">
            <p class="titletext">S3 URL
            </p>
            <v-text-field
              maxlength="100"
              placeholder="S3 URL"
              v-model="s3_url"
              disabled
              flat
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pt-0">
            <p class="titletext">S3 API URL
            </p>
            <v-text-field
              maxlength="100"
              placeholder="S3 API URL"
              v-model="s3_api_url"
              disabled
              flat
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pt-0">
            <p class="titletext">S3 Region Name
            </p>
            <v-text-field
              maxlength="100"
              placeholder="S3 Region Name"
              v-model="s3_region_name"
              disabled
              flat
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pt-0">
            <p class="titletext">S3 ADMIN USERNAME
            </p>
            <v-text-field
              maxlength="100"
              placeholder="S3 ADMIN USERNAME"
              v-model="s3_admin_username"
              disabled
              flat
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="titletext">Description
        </p>
        <v-textarea
            rows="5"
            id="description"
            flat
            outlined
            maxlength="255"
            v-model="description"
            placeholder="Description"
            style="margin-bottom: 22px"
            disabled
          ></v-textarea>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="
                () => {
                  $emit('input', false);
                }
              "
              >Close</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed, ref, watch } from "@vue/composition-api";
import { useNamespacedState } from 'vuex-composition-helpers'
import { MANAGEOBJECTSTORAGEREGION } from '../namespace'

const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value", 'selectedRegion'],
  setup(props, { root, emit }) {
    const {
      isRegionLoading,
    } = useNamespacedState(MANAGEOBJECTSTORAGEREGION, [
      "isRegionLoading",
    ])

    const name = ref(null)
    const volumeLimit = ref(null)
    const s3_url = ref(null)
    const s3_api_url = ref(null)
    const s3_region_name = ref(null)
    const s3_admin_username = ref(null)
    const description = ref(null)

    watch(() => props.selectedRegion, (val) => {
        if (props.value) {
          name.value = props.selectedRegion.name
          description.value = props.selectedRegion.description
          volumeLimit.value = props.selectedRegion.volume_limit
          s3_url.value = props.selectedRegion.s3_url
          s3_api_url.value = props.selectedRegion.s3_api_url
          s3_region_name.value = props.selectedRegion.s3_region_name
          s3_admin_username.value= props.selectedRegion.s3_admin_username
        }
    })

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    })

    return {
      dialog,
      isRegionLoading,
      name,
      description,
      s3_url,
      volumeLimit,
      s3_api_url,
      s3_region_name,
      s3_admin_username,
    }
  },
}
</script>
<style lang="scss" scoped>
.titletext {
  font-weight: 700;
  font-size: 12px;
}
.v-input--is-disabled {
  ::v-deep .v-input__slot {
    background: #f1f2f2;
  }
}

</style>