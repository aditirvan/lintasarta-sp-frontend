<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Project Lists
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-data-table
          :headers="[{ text: 'Project name', value: 'project.name' }]"
          hide-default-footer
          :items="[...user.userproject || [], ...user.user_project || []]"
        ></v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col>
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
              Close
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {useDialog} from '@/composable/usedialog'
export default {
  props: ["value", "user"],
  setup(props, context){
    const {dialog} = useDialog(props, context)
    return {
      dialog
    }
  }
};
</script>
<style lang="scss" scoped>
.v-input--selection-controls {
  margin-top: 0;
}
.v-input--is-label-active {
  ::v-deep .v-input--switch__track {
    background-color: #27ae60;
    opacity: 1 !important;
  }
  ::v-deep .v-input--switch__thumb {
    background-color: white;
  }
}
</style>