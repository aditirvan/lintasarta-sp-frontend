<template>
  <div>
    <v-dialog persistent v-model="close" max-width="500">
      <v-card class="pt-7 rounded-lg">
        <v-card-text>
          <div class="d-flex flex-row">
            <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
            <p class="fz-18 font-weight-bold mb-0"> Delete {{ dataDelete.title }}</p>
          </div>
        </v-card-text>
        <v-card-text>
          <div class="text-center mt-2">
            <p class="mb-0 text-h6">
              Do you want to delete this  {{ dataDelete.title }} ?
            </p>
          </div>
        </v-card-text>
        <v-card-text>
          <v-row class="d-flex justify-end">
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="#CDCDCD"
                depressed
                block
                height="35"
                @click="onCancel()"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col class="d-flex flex-row justify-center" cols="3">
              <v-btn
                color="primary"
                depressed
                block
                height="35"
                @click="onConfirm()"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  useNamespacedActions,
  useNamespacedGetters,
} from "vuex-composition-helpers";
import { REGISTRY } from "../namespace";
import { ref } from "@vue/composition-api";
export default {
  props: {
    close: {
      type: Boolean,
      default: false,
    },
    dataDelete: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const { getDeleteArtifact,getDeleteRepositories } =
      useNamespacedActions(REGISTRY, [
        "getDeleteArtifact",
        "getDeleteRepositories",
      ]);
    function onConfirm() {
      this.$emit("update:close", false);
      // console.log("=======props==========",props)
      
      if(props.dataDelete.title=="Artifact"){
        const params = {
          name: props.dataDelete.name,
          project: props.dataDelete.project,
          digest:props.dataDelete.digest,
        };
        getDeleteArtifact(params)
      }
      else if(props.dataDelete.title=="Repositories"){
        const params = {
          name: props.dataDelete.name,
        };
        getDeleteRepositories(params)

      }
    }
    function onCancel() {
      this.$emit("update:close", false);
    }
    return {
      // props,
      onCancel,
      onConfirm,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>