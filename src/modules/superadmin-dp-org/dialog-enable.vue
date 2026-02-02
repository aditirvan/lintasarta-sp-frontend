<template>
  <v-dialog max-width="550" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">{{ item.isEnabled ? 'Disable' : 'Enable' }} Organization</div>
      </v-card-text>

      <v-card-text v-if="item.isEnabled">
        Disabling an organization prevents users from logging in to the organization and terminates the sessions of currently logged in users.
        Running vApps in the organization continue to work. Even after an organization is disabled, a system administrator can allocate resources, add networks, and so on.
        <br />
        <br />
        Disable Organization <span class="font-weight-bold"> {{ item.name }} </span>?
      </v-card-text>

      <v-card-text v-if="!item.isEnabled">
        You must enable an organization so that the users can log in to it and use its resources.
        <br />
        <br />
        Enable Organization <span class="font-weight-bold"> {{ item.name }} </span>?
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
              {{ item.isEnabled ? 'DISABLE' : 'ENABLE' }}
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
    const { updateOrg } = useNamespacedActions(ORGDP, ["updateOrg"])
    const { isLoadingBtn, } = useNamespacedGetters(ORGDP, ["isLoadingBtn",])
    
    const setData = async() => {

      let payload = {
          orgId: props.item.id,
          value: {
            ...props.item,
            isEnabled: props.item.isEnabled ? false : true,
          }
        }
        // console.log(payload)
        await updateOrg(payload)
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