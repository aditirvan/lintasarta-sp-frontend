<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">{{ editMode ? "Edit" : "Create New" }} Zone</div>
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

        <v-row v-show="!editMode">
          <v-col md="12" class="pt-0">
            <p class="titletext">
              Zone
              <small class="error--text" v-if="$v.selectedZoneModel.$errors.length">&nbsp;*{{ $v.selectedZoneModel.$errors[0].$message }}</small>
            </p>
            <v-select id="SelectZone" v-model="selectedZoneModel" outlined :items="selectZones" placeholder="Choose Zone"> </v-select>
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
              @click="
                () => {
                  resetForm();
                  $emit('input', false);
                }
              "
              >Cancel</v-btn
            ></v-col
          >
          <v-col
            ><v-btn id="Add" depressed height="45" block class="secondary" @click="save" :disabled="isZoneLoading">
              <beat-loader v-if="isZoneLoading" size="10px" color="white" :loading="isZoneLoading" />
              <span v-else>
                {{ editMode ? "Save Changes" : "Add" }}
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
const { required, requiredIf, maxLength, minValue, maxValue, minLength } = require("@vuelidate/validators");
import { useNamespacedState } from "vuex-composition-helpers";
import { useZone } from "@/modules/instance/compositionapi/usezone";
import { MANAGEZONE } from "../namespace";

const useVuelidate = require("@vuelidate/core").default;
export default {
  props: ["value", "selectedZone"],
  setup(props, { root, emit }) {
    // Reset Form if create success
    root.$on("resetFormZone", () => {
      resetForm();
    });

    const { isZoneLoading } = useNamespacedState(MANAGEZONE, ["isZoneLoading"]);

    const { selectzonesos: selectZones, fetchzoneos } = useZone();
    const url = root._route.path;
    const lastIndex = url.lastIndexOf("/");
    const regionID = url.substring(lastIndex + 1);
    let params = {
      region_id: regionID,
    };
    onMounted(() => {
      fetchzoneos(params);
    });

    const editMode = ref(false);
    watch(
      () => props.selectedZone,
      (val) => {
        if (val === null) {
          editMode.value = false;
          resetForm();
        } else {
          editMode.value = true;
          name.value = props.selectedZone.name;
        }
      }
    );

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    const name = ref(null);
    const selectedZoneModel = ref(null);

    const $v = useVuelidate(
      {
        name: {
          required,
          minLength: minLength(5),
        },
        selectedZoneModel: {
          required: requiredIf(() => editMode.value == false),
        },
      },
      {
        name,
        selectedZoneModel,
      }
    );

    const resetForm = () => {
      name.value = null;
      selectedZoneModel.value = null;
      $v.value.$reset();
    };

    const save = async () => {
      $v.value.$touch();
      if ($v.value.$invalid) return false;
      const payload = {
        name: name.value,
        zone: editMode.value == true ? "" : selectedZoneModel.value.zoneName,
        region_id: regionID,
      };
      if (props.selectedZone) payload.sourceName = props.selectedZone.name;
      if (editMode.value) payload.id = props.selectedZone.id;
      if (editMode.value) emit("update", payload);
      else emit("create", payload);
    };

    return {
      props,
      resetForm,
      editMode,
      dialog,
      save,
      isZoneLoading,
      $v,
      name,
      selectedZoneModel,
      selectZones,
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
