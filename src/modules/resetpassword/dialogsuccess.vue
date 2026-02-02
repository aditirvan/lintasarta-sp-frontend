<template>
  <v-dialog persistent v-model="dialog" max-width="500">
    <v-card class="rounded-lg pa-2">
      <v-card-title>
        <v-icon left>$vuetify.icons.alertcircleIcon</v-icon>
        <div class="headline font-weight-bold font--text">
          Success
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="mb-0">New password has been created</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="mx-1">
          
          <v-col cols="12">
            <v-btn
              color="secondary"
              block
              height="50"
              depressed
              @click="
                () => {
                  $emit('confirm')
                }
              "
            >
              <span class="fz-14">Yes</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useDialog } from '@/composable/usedialog';
export default {
  props: ["value"],
  setup(props, context){
    const {dialog} = useDialog(props, context)
    return {
      dialog
    }
  }
};
</script>