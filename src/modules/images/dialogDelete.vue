<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline font-weight-bold font--text pb-4">
          Confirm Snapshot Delete
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <p>This action is irreversible. To confirm deletion, click the button below.</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              :disabled="isLoading"
              block
              depressed
              height="50"
              @click="
                () => {
                  $emit('close');
                }
              "
            >
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              :disabled="isLoading"
              color="error"
              block
              height="50"
              depressed
              @click="
                () => {
                  doDelete()
                }
              "
            >
              Delete
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { defineComponent } from '@vue/composition-api';
import { useNamespacedActions, useNamespacedState } from 'vuex-composition-helpers'
import { IMAGES } from './namespace'

export default defineComponent({
  props: {
    value: Boolean,
    snapshot: Object,
    filterByInstanceID: Boolean,
  },
  setup(props, context) {
    const { isLoading } = useNamespacedState(IMAGES, ['isLoading'])
    const { deleteSnapshot } = useNamespacedActions(IMAGES, ['deleteSnapshot'])

    return {
      isLoading,
      async doDelete() {
        const data = Object.assign({}, props.snapshot)
        const payload = { ...data, filterByInstanceID: props.filterByInstanceID }
        const response = await deleteSnapshot(payload)
        if (response.status === 200) context.emit('close')
      }
    }
  },
  computed: {
    dialog: {
      get: function (): any {
        return this.value;
      },
      set: function (val: boolean): any {
        this.$emit("close", val);
      },
    },
  },
});
</script>