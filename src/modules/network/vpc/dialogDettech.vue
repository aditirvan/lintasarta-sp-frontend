<template>
  <v-dialog v-model="modal" max-width="500">
    <v-card>
      <v-card-title class="px-7">
        <div class="headline font-weight-bold font--text pb-4">
          Dettech Interface
        </div>
      </v-card-title>
      <v-card-text class="pb-0 px-7">
        <p class="fz-16" style="font-weight:600">Are you sure you want to Dettech?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              :disabled="false"
              @click="
                () => {
                  modal = false;
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
							@click="modal = false"
            >
              <span class="fz-14">Confirm</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { SLB } from "./namespace"
import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, requiredIf } from "@vuelidate/validators";

export default defineComponent({
  props: ['value', 'loadBalancer', 'textDelete'],
  setup(props, context) {
    const name = ref('')
    const modal = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
					console.log()
        }
        context.emit("close", false)
      }
    })

    const doDelete = async () => {
      context.emit('delete')
    }
    
    onMounted(() => {
      // console.log(props.loadBalancer)
    })

    return {
      doDelete,
      name,
      modal,
    };
  },
});
</script>