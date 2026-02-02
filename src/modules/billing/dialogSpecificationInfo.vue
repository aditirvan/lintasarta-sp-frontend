<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="550"
    >
      
      <v-card>
        <v-card-title class="headline">
          <v-icon class="mr-4">$vuetify.icons.alertcircleIcon</v-icon>Spesification Info
        </v-card-title>
        <v-card-text class="pb-0">
          <p class="fz-16 mb-0 ">This service has been changed before</p>
          </v-card-text>
        <v-card-actions>
          <v-row class="ma-2">
            
            <v-col>
              <v-btn
              height="50"
              depressed
            color="secondary"
            block
            @click="()=>{dialog = false}"
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
    props:['value', 'message'],
    setup(props, context){
        const {dialog} = useDialog(props, context)
        return{
            dialog
        }
    }
}
</script>