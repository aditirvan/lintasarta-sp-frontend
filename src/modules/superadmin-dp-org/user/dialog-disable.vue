<template>
  <v-dialog max-width="550" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">Disable User</div>
      </v-card-text>

      <v-card-text >
        This action will prevent the user from logging in to VMWare Cloud Director.
        <br />
        <br />
        Disable User <span class="font-weight-bold"> {{ item.name }} </span>?
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
            class="secondary"
            @click="setData"
            >
              DISABLE
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
import { ORGDP } from '../namespace';

export default {
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { updateUser } = useNamespacedActions(ORGDP, ["updateUser"])
    const { isLoadingBtn, } = useNamespacedGetters(ORGDP, ["isLoadingBtn",])
    
    const splitIOrgId = (data) => {
      let splitData = data.split(':')
      return splitData[3]
    }

    const setData = async() => {
      // let detailOrg = JSON.parse(localStorage.getItem('detailOrg'))
      let detailOrg = JSON.parse(localStorage.getItem('orgDP'))
      let payload = {
          idOrg: splitIOrgId(detailOrg.id),
          idUser: splitIOrgId(props.item.id),
          value: {
            ...props.item,
            isEnabled: !props.item.isEnabled,
          }
        }
        // console.log(payload)
        await updateUser(payload)
        dialog.value = false
        context.emit('refreshPage')
    }

    return{
      dialog,
      isLoadingBtn,
      setData
    }
  },
}
</script>