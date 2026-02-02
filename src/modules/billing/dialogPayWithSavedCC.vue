<template>
  <v-dialog  persistent max-width="500" v-model="dialog">
    <v-card>
      <v-toolbar
          color="default"
        >
        
          <v-toolbar-title>Payment Confirmation</v-toolbar-title>
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
        <p> We will use this credit card to process your payment of <b>{{ toIDRWithDotFormat(amount) }}</b>. </p>
        <p> Please type <b>yes</b> to confirm</p>
        <v-text-field :error-messages="$v.inputValidate.$errors.length > 0 ? $v.inputValidate.$errors[0].$message:''" v-model="inputValidate" outlined></v-text-field>
      </v-card-text>
      <v-card-actions >
        <v-btn @click="()=>Iunderstand()" depressed class="primary" block
          >Confirm Payment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent, ref } from '@vue/composition-api'
import { toIDRWithDotFormat } from "@/lib/formatter";
import { useDialog } from '@/composable/usedialog'
import {required} from '@vuelidate/validators'
import useVuelidate from "@vuelidate/core";
export default defineComponent({
  props: ["value", 'amount', 'payNow'],
  setup(props,{emit}){
    const {dialog} = useDialog(props,{emit})

    const inputValidate = ref("");

    const $v = useVuelidate(
      {
        inputValidate: {required, conditional:{
            $message:'wrong input',
            $validator:(val)=>{
              return val === "yes"
            }
        }},
      },
      { inputValidate }
    );

    return {
      $v,
      inputValidate,
      Iunderstand: async () => {
        $v.value.$touch()
        if($v.value.$errors.length) return
        props.payNow()
        dialog.value = false
      },
      dialog,
      toIDRWithDotFormat,
    };
  },
});
</script>