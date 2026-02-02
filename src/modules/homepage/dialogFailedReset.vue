<template>
  <v-dialog v-model="value" persistent max-width="500">
    <v-card>
      <v-card-title class="headline"  >
          <v-icon class="mr-4">$vuetify.icons.notFoundIconError</v-icon>Failed Forgot Password
      </v-card-title>
     
      <div style="height: 20px; width: auto" />
      <v-card-text class="pb-0">
        <p style="color: #eb5757 !important">
          {{message}}
        </p>
         <p>*If you have trouble logging in, you can contact our service department at <a>info@cloudeka.id</a></p>
      </v-card-text>
     
      <v-card-actions>
        <v-row class="ma-2">
            
          <v-col>
            <v-btn
              depressed
              color="secondary"
              height="50"
              block
              @click="()=>{dialog = false}"
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
  props: ["value","message"],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    return {
      dialog,
    };
  },
};
</script>
