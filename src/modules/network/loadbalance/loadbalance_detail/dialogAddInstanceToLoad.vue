<template>
  <v-dialog v-model="dialog" max-width="715">
    <v-card>
      <v-card-title class="px-7">
        <div class="headline font-weight-bold font--text pb-4">
          Add Instance to {{ loadBalancer.name }}
        </div>
      </v-card-title>
      <v-card-text class="pb-0 px-7">
        <p class="fz-14" style="font-weight: 600">
          Choose Instance by adding their name or a tag below. Instance must be
          located within {{ loadBalancer.vpc_name }}.
        </p>
      </v-card-text>
      <v-card-text class="px-7 pb-0">
        <v-autocomplete
          v-model="instanceselected"
          :items="selectInstances"
          outlined
          autocomplete="off"
          item-text="name"
          item-value="id"
          placeholder="Choose an Instance"
          clearable
          hide-details
        >
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6" class="pr-5">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              @click="
                () => {
                  dialog = false;
                }
              "
            >
              <span class="fz-14">Cancel</span>
            </v-btn>
          </v-col>
          <v-col cols="6" class="pl-5">
            <v-btn
              color="secondary"
              block
              height="50"
              depressed
              :disabled="!instanceselected"
              @click="
                () => {
                  $emit('attach', instanceselected);
                  instanceselected = null
                }
              "
            >
              <span class="fz-14">Add Instance</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import Vue from "vue";
import { useDialog } from "@/composable/usedialog";
import {
  useNamespacedActions,
  useNamespacedState,
} from "vuex-composition-helpers";
import INSTANCE from "@/modules/instance/namespace";
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";

export default defineComponent({
  props: ['value', 'loadBalancer', 'instances'],
  setup(props: any, context) {
    const { dialog } = useDialog(props, context);

    const instanceselected = ref(null);
    const selectInstances = ref([])
    watch([() => props.loadBalancer, () => props.instances], val => {
      selectInstances.value = props.instances.filter((x: any) => {
        return !props.loadBalancer.instances.includes(x.id)
      })
    })

    return {
      selectInstances,
      dialog,
      instanceselected,
    };
  },
});
</script>