<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Destroy Object Storage
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Destroying a bucket will schedule the bucket and all the objects inside to be permanently destroyed.</p>
        <p><b>Warning:</b> Destroying a bucket can take several days depending on the amount of data. During this time, the name of the bucket cannot be reused.</p>
        <p>Do you want to permanently destroy this?</p>
          <p class="mb-5">
          Resource associated with this deka box will be deleted
        </p>
        <p>
          Please type <b>{{tenantName}}</b> to confirm
        </p>
        <v-text-field
          id="tenantName"
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
            @click="validateTenant"
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
  props: ["value", "tenantName","objectStorageID"],
  setup: (props, context) => {
     const Composable = {
      ...useObjectStorage(),
  };
  const {
    deleteObjectStorage,
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

    const validateTenant =async () => {
      const name = props.tenantName;
      console.log("name ", name);
      if (name == deleteType.value) { 
         isLoading.value=true
         disableBtn.value=true
         const response = await deleteObjectStorage({
            id: props.objectStorageID,
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
     
      return val == props.tenantName
        ? (disableBtn.value = false)
        : (disableBtn.value = true);
    });

    return {
      validateTenant,
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
