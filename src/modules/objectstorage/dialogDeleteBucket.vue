<template>
  <v-dialog v-model="dialog" max-width="546">
    <v-card class="rounded-l pa-7">
      <v-card-title class="pa-0 mb-5">
        <div class="headline font-weight-bold font--text">Delete Bucket</div>
      </v-card-title>
      <div class="banner mb-5">
        <p class="mb-0" style="color: #f99c1d; font-weight: 600">
          Unexpected bad things will happen if you dont read this!
        </p>
      </div>
      <v-card-text class="pa-0 mb-4">
        <p class="mb-5">
          Resource associated with this bucket will be deleted
        </p>
        <p>
          Please type <b>{{bucketName}}</b> to confirm
        </p>
        <v-text-field
          id="bucketName"
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
            :disabled="disableBtn || isLoading"
            @click="validateBucket"
          >
            <beat-loader
              v-if="isLoading"
              :loading="isLoading"
              :color="'white'"
              :size="'10px'"
              class="ml-2"
            />
            {{
              isLoading
                ? ""
                : "I understand the consequences, delete this bucket"
            }}
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useDialog } from "@/composable/usedialog";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import { computed, ref, watch } from "@vue/composition-api";
import OBJECTSTORAGEBILLING from "./namespace";
import { useObjectStorage } from "./composableapi/useobjectstorage";
export default {
  props: ["value", "bucketName","objectStorageID"],
  setup: (props, context) => {
     const Composable = {
      ...useObjectStorage(),
  };
  const {
    deleteBucketById,
  } = Composable;


    const dialog = computed({
      get: () => props.value,
      set: (val) => {
        val == false ? (deleteType.value = "") : "";
        context.emit("input", val);
      },
    });
   
    const deleteType = ref("");
    const disableBtn = ref(true);
    const isLoading=ref(false)

    const validateBucket =async () => {
      const name = props.bucketName;
      console.log("name ", name);
      if (name == deleteType.value) { 
         isLoading.value=true
         disableBtn.value=true
         const response = await deleteBucketById({
          "id": props.objectStorageID,
          "bucketName": name,
        });
        if (response.status == 200) {
            dialog.value = false;
            isLoading.value=false;
            disableBtn.value=false;
            context.emit('close')
            context.emit('refresh')
        
            deleteType.value = ''
        }

       
      }
    };

    watch(deleteType, (val) => {
     
      return val == props.bucketName
        ? (disableBtn.value = false)
        : (disableBtn.value = true);
    });

    return {
      validateBucket,
      deleteType,
      dialog,
      disableBtn,
      isLoading,
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
