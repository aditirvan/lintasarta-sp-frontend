<template>
  <v-dialog  persistent max-width="500" v-model="dialog">
    <v-card>
      <v-toolbar
          color="default"
        >
        
          <v-toolbar-title>{{ stateTitle }} Payment Recurring</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
              <v-btn
                icon
                color="primary"
                @click="dialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
          </v-toolbar-items>
        </v-toolbar>
      <v-card-text class="mt-8 text-center">
        <p>
          This will <b>{{ stateName }}</b> recurring payment using this credit card. 
        </p>
        <p>{{ message }}</p>
        <p>
          Please type <b>{{ stateName }}</b> to confirm
        </p>
        <v-text-field :error-messages="$v.inputValidate.$errors.length > 0 ? $v.inputValidate.$errors[0].$message:''" v-model="inputValidate" outlined></v-text-field>
      </v-card-text>
      <v-card-actions>
        
        <v-btn @click="()=>Iunderstand()" depressed class="primary" block>
          {{ stateName }} recurring payment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent, computed, ref } from '@vue/composition-api'
import { useDialog } from '@/composable/usedialog'
import {required} from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
export default defineComponent({
  props: ["value", 'projectCCMeta', 'changeProjectCCStatus'],
  setup(props,{emit}){
    const {dialog} = useDialog(props,{emit})

    const stateName = computed(() => {
      return !props.projectCCMeta?.is_active ? "activate" : "deactivate" 
    })

    const stateTitle = computed(() => {
      return !props.projectCCMeta?.is_active ? "Activate" : "Deactivate"
    })
    
    const message = computed(() => {
      return !props.projectCCMeta?.is_active ?
      'Please be aware that the credit card you submit will be automatically debited for subsequent bills. To prevent any service interruptions, make sure your credit card information is up to date.' :
      'By deactivating this recurring payment, you will be in charge of making all subsequent payments by hand. Service disruptions may occur if payments are not made on schedule. Kindly make sure you remember when your bills are due in order to prevent any problems.'
    })

    const inputValidate = ref("");

    const $v = useVuelidate(
      {
        inputValidate: {required, conditional:{
            $message:'wrong input',
            $validator:(val)=>{
              return val === stateName.value
            }
        }},
      },
      { inputValidate }
    );

    return {
      $v,
      inputValidate,
      stateName,
      stateTitle,
      message,
      Iunderstand: async () => {
        $v.value.$touch()
        if($v.value.$errors.length) return
        props.changeProjectCCStatus()
        dialog.value = false
      },
      dialog,
    };
  },
});
</script>