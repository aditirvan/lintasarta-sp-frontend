<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Create New Zone</div>
      </v-card-text>
      <v-card-text class="pb-0">
        <v-row>
          <v-col md="12" class="pt-0">
            <p class="titletext">
              Name
              <small class="error--text" v-if="$v.name.$errors.length">&nbsp;*{{ $v.name.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" v-model="name" placeholder="Name" flat outlined></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="12" class="pt-0">
            <p class="titletext">
              Region
              <small class="error--text" v-if="$v.selectedRegionModel.$errors.length">&nbsp;*{{ $v.selectedRegionModel.$errors[0].$message }}</small>
            </p>
            <v-select id="SelectZone" v-model="selectedRegionModel" outlined :items="listRegionDekabox.list_region" placeholder="Choose Region"> </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="12" class="pt-0">
            <p class="titletext">
              S3 URL
              <small class="error--text" v-if="$v.s3_url.$errors.length">&nbsp;*{{ $v.s3_url.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" v-model="s3_url" placeholder="S3 URL" flat outlined></v-text-field>
          </v-col>
        </v-row>
         <v-row>
          <v-col md="12" class="pt-0">
            <p class="titletext">
              Type
              <small class="error--text" v-if="$v.site.$errors.length">&nbsp;*{{ $v.site.$errors[0].$message }}</small>
            </p>
            <v-text-field maxlength="100" v-model="site" placeholder="site" flat outlined></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col
            ><v-btn
              depressed
              height="45"
              block
              class="accent"
              @click="cancel"
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn id="Add" depressed height="45" block class="secondary" @click="save" :disabled="setIsBucketLoading">
              <beat-loader v-if="setIsBucketLoading" size="10px" color="white" :loading="setIsBucketLoading" />
              <span v-else>
                Add
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed, onMounted, ref, watch } from "@vue/composition-api";
const { required, requiredIf,url } = require("@vuelidate/validators");
import { useNamespacedState,useNamespacedActions } from "vuex-composition-helpers";
import { useZone } from "@/modules/instance/compositionapi/usezone";
import { DEKABOXREGION } from "../namespace";

const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value", "selectedBucket"],
  setup(props, { root, emit }) {
    // Reset Form if create success
    root.$on("resetFormZone", () => {
      resetForm();
    });

    const { setIsBucketLoading,listRegionDekabox } = useNamespacedState(DEKABOXREGION, ["setIsBucketLoading","listRegionDekabox"]);
    const { fetchListRegion } = useNamespacedActions(DEKABOXREGION, ["fetchListRegion"]);

    const { selectzonesos: selectZones, fetchzoneos } = useZone();

    const routeUrl = root._route.path;
    const lastIndex = routeUrl.lastIndexOf("/");
    const objectStorageId = routeUrl.substring(lastIndex + 1);
   
    onMounted(() => {
      fetchListRegion(objectStorageId);
    });
    

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    const name = ref(null);
    const s3_url =ref(null);
    const site =ref(null);
    const selectedRegionModel = ref(null);

    const $v = useVuelidate(
      {
        name: {
          required
        },
        selectedRegionModel: {
          required,
        },
        s3_url: {
          url,
          required
        },
        site:{
          required,
        }
      },
      {
        name,
        selectedRegionModel,
        s3_url,
        site,
      }
    );

    const resetForm = () => {
      name.value = null;
      selectedRegionModel.value = null;
      s3_url.value=null;
      site.value=null
      $v.value.$reset();
    };

    const save = async () => {
      $v.value.$touch();
      if ($v.value.$invalid) return false;
      const payload = {
        name: name.value,
        region:selectedRegionModel.value,
        s3_url:s3_url.value,
        object_storage_id: objectStorageId,
        site:site.value,
      };
      resetForm();
      emit("create", payload);
    };

    const cancel = () => {
      resetForm();
      emit("input", false);
    };

    return {
      props,
      resetForm,
      dialog,
      save,
      setIsBucketLoading,
      $v,
      name,
      selectedRegionModel,
      selectZones,
      listRegionDekabox,
      s3_url,
      cancel,
      site,
    };
  },
};
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
