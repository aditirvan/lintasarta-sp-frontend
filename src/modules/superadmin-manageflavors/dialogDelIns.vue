<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Delete Instance Size {{instance.name}}
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p class="fz-16">Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
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
              <span class="fz-14">Cancel</span>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              depressed
              @click="Delete"
            >
             <span class="fz-14">Confirm</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent } from '@vue/composition-api'
import {useNamespacedActions} from 'vuex-composition-helpers'
import {useDialog} from '@/composable/usedialog'
import { MANAGEFLAVOR } from './namespace';
const module =  defineComponent({
  props: ["value",'instance'],
  setup(props,{emit}){
    console.log(props.instance)
    const {dialog} = useDialog(props,{emit})
    const {deleteFlavor} = useNamespacedActions(MANAGEFLAVOR,['deleteFlavor'])
    return{
        dialog,
        Delete: async()=>{
          try{
            await deleteFlavor(props.instance).then(()=>{
              emit('deleted')
            })
          }finally{
            dialog.value = false
          }
        }
    }
  },
});
export default module
</script>