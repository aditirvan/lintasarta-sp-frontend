<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="pt-7">
      <v-card-text>
        <div class="headline font-weight-bold font--text">List Region Detail</div>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="titletext">Name</p>
        <v-text-field :value="selectedRegion.name" disabled flat outlined></v-text-field>
      </v-card-text>
      <v-card-text class="pb-0">
        <p class="titletext">
          S3 List Region
        </p>
        <v-row>
          <v-col v-if="loading" cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
          <v-col v-else v-for="(option, index) in region_options" :key="index" cols="6" class="pr-2">
            <v-checkbox
              :label="option"
              v-model="selected_regions"
              :value="option"
              :disabled="loading"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn depressed height="45" block class="accent" @click="closeDialog">Close</v-btn>
          </v-col>
           <v-col
            ><v-btn id="Add" depressed height="45" block class="secondary" @click="save">
              <span>
                Submit
              </span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent, ref, watch, onMounted, computed } from "@vue/composition-api";
import { useNamespacedState, useNamespacedActions } from "vuex-composition-helpers";
import { DEKABOXREGION } from "../../namespace";

export default {
  props: ["value", "selectedRegion"],
  setup(props, { root, emit }) {
    const selected_regions = ref([]);
    const loading = ref(false);

    const { listRegionDekabox } = useNamespacedState(DEKABOXREGION, ["listRegionDekabox"]);
    const { fetchListRegion } = useNamespacedActions(DEKABOXREGION, ["fetchListRegion"]);

    onMounted(() => {
      loading.value = true; // Mengaktifkan loading saat proses fetch dimulai
      fetchListRegion(props.selectedRegion.id)
        .then(() => {
          loading.value = false; // Menonaktifkan loading setelah fetch selesai
        });
    });

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        emit("input", val);
      },
    });

    watch(() => listRegionDekabox.value.data_region_object_storage, (newValue) => {
      if (newValue != null) {
        selected_regions.value = newValue;
      }
    });

    const region_options = computed(() => {
      return listRegionDekabox.value.list_region || [];
    });

    const closeDialog = () => {
      emit("input", false);
    };

   const save = async () => {
      
      const payload = {
        id : props.selectedRegion.id,
        list_region:selected_regions.value,
      };

      console.log("save ", payload);

      emit("addRegion", payload);

      // if (props.selectedRegion) payload.ID = props.selectedRegion.id;
      // if (editMode.value) emit("update", payload);
      // else emit("create", payload);
    };

    return {
      dialog,
      selected_regions,
      region_options,
      closeDialog,
      loading,
      save,
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
