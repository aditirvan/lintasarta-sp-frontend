<template>
  <v-dialog persistent v-model="dialog" max-width="400">
    <v-card class="overflow-x-hidden">
      <v-row>
        <v-col class="pt-0">
          <v-card-text>
            <h2>Delete IP Set</h2>
          </v-card-text>
        </v-col>
        <v-col class="pt-0">
          <v-card-text>
            <div class="d-flex justify-end mb-4">
              <span class="cursor-pointer" @click="onCancel()"><v-icon color="red">mdi-close-circle</v-icon></span>
            </div>
          </v-card-text>
        </v-col>
      </v-row>

      <v-card-text>
        <div class="text-center mt-2">
          <p class="mb-0 text-h7">This action cannot be undone. This will permanently delete the IP Set.</p>
          <p class="text-h7">I understand the consequences, delete this IP Set.</p>
        </div>
      </v-card-text>

      <v-card-text>
        <v-row class="d-flex justify-end">
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn class="white--text" :disabled="isLoadingBtn" color="#a5b3bf" block height="35" @click="onCancel()"> Cancel </v-btn>
          </v-col>
          <v-col class="d-flex flex-row justify-center" cols="4">
            <v-btn color="error" :disabled="isLoadingBtn" :loading="isLoadingBtn" block height="35" @click="onSubmit()"> Confirm </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { ref } from "@vue/composition-api";
import { useNamespacedActions, useNamespacedGetters } from "vuex-composition-helpers";
import { DPSECURITY } from "../../namespace";
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    move: {
      type: Boolean,
      default: false,
    },
    idIndex: {
      type: Number,
      default: 0,
    },
    rowSelected: {
      type: Object
    }
  },
  setup(props, context) {
    const { dialog } = useDialog(props, context)

    const { isLoadingBtn,  } = useNamespacedGetters(DPSECURITY, ["isLoadingBtn"]);
    const { deleteIpsetNsxt } = useNamespacedActions(DPSECURITY, ["deleteIpsetNsxt"]);

    const onCancel = () => {
      dialog.value = false
    };
    const onSubmit = async() => {
      const id = context.root.$route.params.idEdge;
      let payload = {
        idEdge: id,
        ipsetId: props.rowSelected.id.replace("urn:vcloud:firewallGroup:", "")
      }
      await deleteIpsetNsxt(payload);
      context.emit('refreshTab')
      dialog.value = false
      // context.emit("update:dialogDelete", false);
    };
    return {
      onCancel,
      onSubmit,
      isLoadingBtn,
      dialog
    };
  },
};
</script>

<style lang="scss" scoped></style>
