<template>
  <v-dialog v-model="modal" max-width="500">
    <v-card>
      <v-card-title class="px-7">
        <div class="headline font-weight-bold font--text pb-4">
          Delete {{ header == 'staticroute' ? 'Static Routing' : header == 'nat' ? 'NAT' : 'Interfaces' }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0 px-7">
        <p class="fz-16" style="font-weight:600">Are you sure you want to proceed?</p>
        <p>Please Type <span class="font-weight-bold">{{ name }}</span> in The Form Below</p> 
        <v-text-field
        v-model="textDel"
        outlined
        :error-messages="
        $v.textDel.$errors.length
            ? $v.textDel.$errors[0].$message
            : ''
        "
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              :disabled="isLoadingBtn"
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
              :loading="isLoadingBtn"
              :disabled="isLoadingBtn"
              @click="doDelete"
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
import { NETWORKVPC } from "../namespace"
import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedState } from "vuex-composition-helpers";
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, requiredIf } from "@vuelidate/validators";

export default defineComponent({
  props: ['value', 'dataItem', 'textDelete', 'header'],
  setup(props, context) {
    const { isLoadingBtn } = useNamespacedState(NETWORKVPC, ["isLoadingBtn"])
    const name = ref('')
    const textDel = computed({
      get: () => props.textDelete,
      set: (val) => {
        context.emit("deleteText", val)
      }
    })
    const modal = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
          textDel.value = ''
        }
        context.emit("input", false)
      }
    })

    const $v = useVuelidate(
        {
            textDel:{ 
                required,
                sameAs: helpers.withMessage( 'The value must be the same as your static routing name' ,sameAs(name)) 
            },
        },
        {
            textDel: textDel,
        }
    )

    const doDelete = async () => {
      $v.value.$touch()
      if ($v.value.$errors.length) return;
      context.emit('delete')
    }
    
    onMounted(() => {
        console.log(props.dataItem)
        name.value = props.dataItem.instance_name
    })

    return {
      doDelete,
      textDel,
      name,
      modal,
      isLoadingBtn,
      $v
    };
  },
});
</script>