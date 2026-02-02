<template>
  <v-dialog v-model="modal" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Attach Interface
        </div>
      </v-card-title>
      <!-- <v-card-text>
        <p class="font-weight-bold">The way to specify an interface</p>
        <v-select
        :items="[]"
        item-text="name"
        item-value="id"
        placeholder="Type"
        multiple
        outlined
        flat
        >
        </v-select>
    </v-card-text> -->
    <v-card-text>
      <p class="font-weight-bold">Instance Name</p>
      <v-text-field
      readonly
      placeholder="name"
      single-line
      outlined
      :value="itemInstances"
    ></v-text-field>
    </v-card-text>
    <v-card-text>
      <p class="font-weight-bold">Instance Port IP</p>
      <v-text-field
      placeholder="Port"
      single-line
      outlined
      v-model="port_ip"
      :error-messages="$v.port_ip.$errors.length ? $v.port_ip.$errors[0].$message : ''"
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
              @click="
                () => {
                  modal = false
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="error"
              block
              height="50"
              depressed
              @click="
                () => {
                  confirmAttach()
                }
              "
            >
              Confirm
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { computed, defineComponent, ref } from '@vue/composition-api';
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, requiredIf } from "@vuelidate/validators";

export default defineComponent({
  props: ["value", "itemInstances"],
  setup(props: any, context) {
    const port_ip = ref('')

    const modal = computed({
      get: () => props.value,
      set: (val) => {
        if(!val){
          console.log(val)
        }
        context.emit("close", false)
      }
    })

    const $v = useVuelidate(
        {
          port_ip:{ 
            required,
            regex: {
              $message: "Invalid ip value",
              $validator: (val) => {
                return /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/.test(val);
              },
            },
          },
        },
        {
            port_ip,
        }
    )

    const confirmAttach = async () => {
      $v.value.$touch()
      if ($v.value.$errors.length) return;
      context.emit('confirm', port_ip.value)
      modal.value = false
    }
    return {
      modal,
      port_ip,
      confirmAttach,
      $v
    }
  },
});
</script>