<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col class="pb-0" cols="12">
              <p>
                <span class="font-weight-bold mb-0">Select Machine Set Flavor</span>
              </p>
            </v-col>
            <v-slide-group class="py-4 pt-0" show-arrows>
              <v-col class="d-flex flex-row flex-wrap">
                <v-card
                  width="185"
                  v-for="flavor in listFlavorDekaRock"
                  :key="flavor.id"
                  @click="
                    () => {
                      selectedFlavor = flavor;
                    }
                  "
                  :class="selectedFlavor.id == flavor.id ? 'selected' : ''"
                  border-color="primary"
                  outlined
                  class="rounded-lg select-instance mb-4 row"
                  style="text-align: center; margin-right: 20px"
                  :style="{
                    border: $v.selectedFlavor.$errors.length ? '1px solid #eb5757 !important' : '',
                  }"
                >
                  <v-col>
                    <v-card-text class="pb-0 pt-5">
                      <div>
                        <p class="font-weight-bold">
                          {{ flavor.type_name }}
                        </p>
                      </div>
                    </v-card-text>
                    <v-divider />
                    <v-card-text class="d-flex flavor-card">
                      <p class="mb-0">{{ flavor.cpu }}vCPU / {{ flavor.ram }}GB RAM</p>
                    </v-card-text>
                    <v-divider v-if="selectedFlavor.id == flavor.id" />
                    <v-card-text class="mb-0 pb-0 mb-0" v-if="selectedFlavor.id == flavor.id">
                      <p class="mb-0 mt-0">{{ total_worker }} Worker</p>
                      <v-slider v-model="total_worker" :min="1" :max="10"></v-slider>
                    </v-card-text>
                    <!-- <v-divider /> -->
                    <!-- <v-card-text class="pa-0" v-if="selectedFlavor.id == flavor.id">
                      <v-text-field
                        class="px-4 pt-2 input-center"
                        value="100 GB"
                        @keydown="(ev) => (disk_size = addGBText(ev, disk_size))"
                        max="100"
                        flat
                        readonly
                      >
                      </v-text-field>
                    </v-card-text>
                    <v-card-text class="pa-0" v-else>
                      <v-text-field disabled value="100 GB" class="px-4 pt-2 input-center" max="100" flat> </v-text-field>
                    </v-card-text> -->
                  </v-col>
                  <!-- <v-col cols="2" v-if="selectedFlavor.id == flavor.id">
                        <v-slider vertical v-model="total_worker"></v-slider>
                      </v-col> -->
                </v-card>
              </v-col>
            </v-slide-group>
          </v-row>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn color="accent" block depressed height="50" @click="cancel()"> Cancel </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                class="secondary"
                block
                height="50"
                @click="
                  () => {
                    addMachineSet();
                  }
                "
                depressed
              >
                Create
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, onMounted, computed } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedState, useNamespacedGetters } from "vuex-composition-helpers";
import { DEKAROCK, DEKAROCKBILLING } from "@/modules/deka-rock/namespace";
import { toThousands, addGBText, removeGBText } from "@/lib/formatter";
import { toInteger } from "lodash";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
export default {
  props: ["value", "dekarock_id"],
  setup(props, context) {
    const { currentProj } = useNamespacedState("SUPERADMIN", ["currentProj"]);
    // const { getDekarockFlavors } = useNamespacedActions(DEKAROCK, ["getDekarockFlavors"]);
    const { getFlavorDekaRock } = useNamespacedActions(DEKAROCKBILLING, ["getFlavorDekaRock"]);
    const { listFlavorDekaRock } = useNamespacedGetters(DEKAROCKBILLING, ["listFlavorDekaRock"]);
    const { flavor_list, flavor_pagination } = useNamespacedState(DEKAROCK, ["flavor_list", "flavor_pagination"]);

    // const { getFlavorDekaRock } = useNamespacedActions(DEKAROCKBILLING, [
    //   "getFlavorDekaRock",
    // ]);
    // const { listFlavorDekaRock } = useNamespacedGetters(DEKAROCKBILLING, [
    //   "listFlavorDekaRock",
    // ]);
    const { addOpenshiftMachineSet, getOpenshiftDetail, getOpenshiftMachineSetList } = useNamespacedActions(DEKAROCK, [
      "addOpenshiftMachineSet",
      "getOpenshiftDetail",
      "getOpenshiftMachineSetList",
    ]);

    const selectedFlavor = ref("");
    const disk_size = ref(null);
    const total_worker = ref(null);

    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        context.emit("input", val);
      },
    });

    async function addMachineSet() {
      $v.value.$touch();
      if ($v.value.$errors.length) return;
      // context.root.$store.dispatch("HOMEPAGE/showProcessToastWS", `Creating the machine set`, { root: true });
      let res = await addOpenshiftMachineSet({
        id: props.dekarock_id,
        payload: {
          project_id: currentProj.value.id,
          item_id: selectedFlavor.value.id,
          flavor_id: selectedFlavor.value.flavor_id,
          flavor_type: selectedFlavor.value.type_name,
          // disk_size: toInteger(removeGBText(disk_size.value)),
          total_worker: toInteger(total_worker.value),
        },
      });
      if (res.status === 200 || res.status === 204) {
        await getOpenshiftDetail(props.dekarock_id);
        await getOpenshiftMachineSetList({ payload: { id: props.dekarock_id } });
      }
      dialog.value = false;
    }

    onMounted(async () => {
      // await getDekarockFlavors();

      const url_params = new URLSearchParams();
      url_params.append("project_id", currentProj.value.id);
      await getFlavorDekaRock(url_params);
    });
    const cancel = () => {
      selectedFlavor.value = "";
      dialog.value = false;
      $v.value.$reset();
    };

    const $v = useVuelidate(
      {
        selectedFlavor: { required },
      },
      { selectedFlavor }
    );

    return {
      // flavor_list,
      listFlavorDekaRock,
      total_worker,
      disk_size,
      addMachineSet,
      selectedFlavor,
      dialog,
      addGBText,
      $v,
      cancel,
    };
  },
};
</script>

<style scoped lang="scss">
.selected {
  border-color: #2c94d2;
}
::v-deep .input-center.theme--light.v-input input {
  text-align: center;
}
::v-deep .theme--light.v-input--is-disabled input {
  text-align: center;
}
</style>
