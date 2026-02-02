<template>
  <v-dialog v-model="dialog" max-width="546">
    <v-card class="rounded-l pa-7">
      <v-card-title class="pa-0 mb-5">
        <div class="headline font-weight-bold font--text">Delete CDN</div>
      </v-card-title>
      <div class="banner mb-5">
        <p class="mb-0" style="color: #f99c1d; font-weight: 600">
          Unexpected bad things will happen if you dont read this!
        </p>
      </div>
      <v-card-text class="pa-0 mb-4">
        <p class="mb-5">
          The loading transfer of your website might be slower by deleting the CDN
        </p>
        <p>
          Please type <b>{{ selectedCdn.domain }}</b> to confirm
        </p>
        <v-text-field
          id="instanceName"
          v-model="deleteType"
          flat
          outlined
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-row class="ma-0">
          <v-btn
            id="confirm"
            color="error"
            block
            height="50"
            depressed
            :disabled="disableBtn || isLoadingDelete"
            @click="validateCdn"
          >
            <beat-loader
              v-if="isLoadingDelete"
              :loading="isLoadingDelete"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            />
            {{
              isLoadingDelete
                ? ""
                : "I understand the consequences, delete this CDN"
            }}
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  useNamespacedActions,
  useNamespacedState,
  useState
} from "vuex-composition-helpers";
import { computed, ref, watch } from "@vue/composition-api";
export default {
  props: ["value", "selectedCdn"],
  setup: (props, context) => {
    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        val == false ? (deleteType.value = "") : "";
        context.emit("input", val);
      },
    });
    const { deleteCDN, getListCDN } = useNamespacedActions("CDN",["deleteCDN", "getListCDN"]);
    const { isLoadingDelete } = useNamespacedState("CDN", ["isLoadingDelete"]);
    const { topbarloading } = useState(["topbarloading"]);
    const deleteType = ref("");
    const disableBtn = ref(true);

    const validateCdn = () => {
      const name = props.selectedCdn.domain;
      if (name == deleteType.value) {
          topbarloading.value.start();
          deleteCDN({id: props.selectedCdn.id}).then(async() => {
            dialog.value = false;
            await getListCDN()
          });
          topbarloading.value.done();
      }
    };

    watch(deleteType, (val) => {
      return val == props.selectedCdn.domain
        ? (disableBtn.value = false)
        : (disableBtn.value = true);
    });

    return {
      validateCdn,
      deleteType,
      dialog,
      disableBtn,
      isLoadingDelete,
    };
  },
};
</script>
<style lang="css">
.banner {
  background-color: #faefd0;
  padding: 10px;
  border-radius: 8px;
}
</style>
