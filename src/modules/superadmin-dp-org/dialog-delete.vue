<template>
  <v-dialog max-width="550" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Delete Organization</div>
      </v-card-text>

      <v-card-text>
        Deleting the Organization cannot be undone.
        <br />
        <br />
        Delete Organization <span class="font-weight-bold"> {{ item.name }} </span>?
      </v-card-text>

      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn"
            depressed
            height="45"
            block
            class="accent"
            @click="
              () => {
                dialog = false
              }
            "
            >Cancel</v-btn>
          </v-col>
          <v-col>
            <v-btn
            :disabled="isLoadingBtn"
            :loading="isLoadingBtn"
            id="Add"
            depressed
            height="45"
            block
            class="error"
            @click="setData"
            >
              Delete
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { useDialog } from '@/composable/usedialog';
import { useNamespacedActions, useNamespacedGetters } from 'vuex-composition-helpers';
import { ORGDP } from './namespace';

export default {
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { deleteOrg } = useNamespacedActions(ORGDP, ["deleteOrg"])
    const { isLoadingBtn, } = useNamespacedGetters(ORGDP, ["isLoadingBtn",])
    
    const setData = async() => {
      let payload = {
          orgId: props.item.id,
        }
        console.log(payload)
        await deleteOrg(payload)
        dialog.value = false
        context.root.$router.replace("/manage-orgdp");
    }

    return{
      dialog,
      isLoadingBtn,
      setData
    }
  },
}
</script>