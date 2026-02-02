<template>
  <v-dialog v-model="dialog" max-width="340">
    <v-card>
      <v-card-title class="d-flex justify-center">
        <p class="headline font-weight-bold font--text pb-4">
          Cannot Delete Member
        </p>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>Transfer creator role first to delete this user</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="12">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  dialog = false
                }
              "
            >
              <span class="fz-14">Ok</span>
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