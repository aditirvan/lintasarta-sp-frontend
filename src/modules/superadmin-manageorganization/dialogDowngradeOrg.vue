<template>
  <v-dialog v-model="dialog" max-width="450">
    <v-card class="pt-4 px-2">
      <v-card-title class="d-flex flex-row justify-center">
        <div style="font-size:28px" class=" font-weight-bold font--text pb-4">
        Downgrade to basic
        </div>
      </v-card-title>
      <v-card-text class="pb-0 d-flex flex-row justify-center">
        <p style="line-height:30px" class="fz-18 accent-text text-center">Are you sure to downgrade this organization to basic?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col>
            <v-btn
              color="accent"
              block
              height="50"
              depressed
              @click="
                () => {
                  dialog = false
                }
              "
            >
              <span class="fz-16">No</span>
            </v-btn>
          </v-col>
          <v-col>
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
              <span class="fz-16">Yes</span>
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