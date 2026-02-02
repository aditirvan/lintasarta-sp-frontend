<template>
  <v-dialog max-width="550" v-model="dialog">
    <v-card ref="form" class="pt-7" id="container">
      <v-card-text>
        <div class="headline font-weight-bold font--text">{{ item.isEnabled ? 'Disable' : 'Enable' }} Organization VDC</div>
      </v-card-text>

      <v-card-text v-if="item.isEnabled">
        Disabling an Organization VDC prevents additional vApps or virtual machines using its compute and storage resources.
        Running vApps and powered on virtual machines continue to run, but you cannot create or start additional ones.
        <br />
        <br />
        Disable Organization VDC <span class="font-weight-bold"> {{ item.name }} </span>?
      </v-card-text>

      <v-card-text v-if="!item.isEnabled">
        Enabling an Organization VDC allows additional vApps or virtual machines using its compute and storage resources.
        <br />
        <br />
        Enable Organization VDC <span class="font-weight-bold"> {{ item.name }} </span>?
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
import { ORGVDC } from './namespace';

export default {
  props: ["value", "item"],
  setup(props, context) {
    const { dialog } = useDialog(props, context)
    const { enableOrgVdc } = useNamespacedActions(ORGVDC, ["enableOrgVdc"])
    const { isLoadingBtn, } = useNamespacedGetters(ORGVDC, ["isLoadingBtn",])
    
    const setData = async() => {
      let detailOrgVdc = JSON.parse(localStorage.getItem('detailOrgVdc'))
      let payload = {
        orgVdcId: detailOrgVdc.id,
        value: {
          ...props.item,
          // isEnabled: props.item.isEnabled,
        }
      }
      // console.log(payload)
      await enableOrgVdc(payload)
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