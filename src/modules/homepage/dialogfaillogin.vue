<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
      
      <v-card >
        <v-card-title class="headline" v-if="message=='Too many login attempts, wait for 30 Minutes'" >
          <v-icon class="mr-4">$vuetify.icons.notFoundIconError</v-icon>Yout Account Has Been Locked
        </v-card-title>
        <v-card-title class="headline" v-else >
          <v-icon class="mr-4">$vuetify.icons.notFoundIconError</v-icon>Login Failed 
        </v-card-title>
        <v-card-text class="pb-0">
         
          <!-- <p class="font-weight-bold" style="color: #eb5757 !important" v-if="error_code == '403'">{{message}}</p> -->
          <p style="color: #eb5757 !important" v-if="message!='Too many login attempts, wait for 30 Minutes'">{{message}}</p>
          
          <p
            class="font-weight-bold"
            v-if="
              message != 'Too many login attempts, wait for 30 Minutes' &&
              !message.includes('suspended') && error_code != '403'
            "
          >
            Please recheck the username and password and try again!
          </p>



          <p class="font-weight-bold" v-if="message=='Too many login attempts, wait for 30 Minutes'">Because you have reached the maximum number of invalid sign-in attempts. <a>Please try again in 30 minutes</a> !</p>
          <p v-if="message!=''">*If you have trouble logging in, you can contact our service department at <a>info@cloudeka.id</a></p>
          </v-card-text>
        <v-card-actions  v-if="message=='Too many login attempts, wait for 30 Minutes'">
          <v-row class="ma-2">
            
            <v-col>
              <v-btn
              height="50"
              depressed
            color="#a5b3bf"
            block
            @click="()=>{dialog = false}"
          >
            <span style="color: #fff;">Cancel</span>
          </v-btn>
            </v-col>

            <v-col >
              <v-btn
              height="50"
              depressed
            color="error"
            block
            @click="()=>{$emit('reset')}"
          >
            Reset Password
          </v-btn>


          

            </v-col>

          </v-row>
          
          
        </v-card-actions>


        <v-card-actions  v-else-if="message!='Too many login attempts, wait for 30 Minutes'">
          <v-row class="ma-2">
            
            <v-col>
              <v-btn s
              height="50"
              depressed
            color="#a5b3bf"
            block
            @click="()=>{dialog = false}"
          >
            <span style="color: #fff;">Close</span>
          </v-btn>
            </v-col>

         

          </v-row>
          
          
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { useDialog } from '@/composable/usedialog'
import {computed, ref} from '@vue/composition-api'
import localstorage from "@/lib/localstorage";

export default {
    props:['value', 'message','data', 'error_code'],
    setup(props, context){
      
      const {dialog} = useDialog(props, context)

      

      return {
        dialog
      }

    },
}
</script>
