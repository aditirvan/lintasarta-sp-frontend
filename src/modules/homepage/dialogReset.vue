<template>
  <v-dialog v-model="value" persistent max-width="500">
    <v-card>
      <v-card-title class="d-flex justify-center font--text  headline font-weight-bold">
        <p class="mb-0 text-center" style="text-transform:capitalize">request success</p>
      </v-card-title>
      <div style="height: 20px; width: auto" />
      <v-card-text class="pb-0">
        <p class="font-weight-bold text-center " >
          Please check your email to change your password
        </p>
      </v-card-text>
     
      <v-card-actions>
        <v-row class="ma-2">
            
          <v-col>
            <v-btn
              depressed
              color="secondary"
              height="50"
              block
              @click="
                () => {
                  $emit('input', false);
                }
              "
            >
              Okay
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useDialog } from "@/composable/usedialog";
export default {
  props: ["value"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    return {
      dialog,
    };
  },
};
</script>
