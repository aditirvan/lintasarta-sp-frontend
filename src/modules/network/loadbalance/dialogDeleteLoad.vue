<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="px-7">
        <div class="headline font-weight-bold font--text pb-4">
          Delete Load Balancer
        </div>
      </v-card-title>
      <v-card-text class="pb-0 px-7">
        <p class="fz-16" style="font-weight:600">Are you sure you want to proceed?</p>
      </v-card-text>
      <v-card-actions>
        <v-row class="ma-2">
          <v-col cols="6">
            <v-btn
              color="accent"
              block
              depressed
              height="50"
              :disabled="isLoading"
              @click="
                () => {
                  dialog = false;
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
              :disabled="isLoading"
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
import { useDialog } from "@/composable/usedialog";
import { useLoadBalancer } from './useLoadBalancer'
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: ['value', 'loadBalancer', 'redirectToPageList'],
  setup(props, context) {
    const { dialog } = useDialog(props, context);
    const { deleteLoadBalancer, isLoading } = useLoadBalancer()

    const doDelete = async () => {
      console.log(props)
      const { id } = props.loadBalancer
      const response = await deleteLoadBalancer(id)
      if (response.status == 200) {
        context.emit('close')
        if (props.redirectToPageList) context.root.$router.replace('/network/loadbalancer')
      }
    }

    return {
      dialog,
      isLoading,
      doDelete,
    };
  },
});
</script>